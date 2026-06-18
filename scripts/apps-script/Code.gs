/**
 * Daily Ads Briefing — Google Apps Script web app endpoint.
 *
 * Setup (one-time):
 *   1. Create a new Google Sheet.
 *   2. Extensions → Apps Script. Paste this file. Save.
 *   3. Project Settings → Script Properties → add  SHEET_SECRET = <a long random string>.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me.  Who has access: Anyone.
 *      Copy the /exec URL.
 *   5. In Vercel set  BRIEFING_SHEET_URL = <that /exec URL>  and
 *      BRIEFING_SHEET_SECRET = <same value as SHEET_SECRET>.
 *
 * The Vercel cron POSTs { secret, header, rows }. We upsert by date (deleting any
 * existing rows for the dates being written) so re-runs/backfills never duplicate.
 */

var RAW_SHEET = "Rohdaten";
var DASH_SHEET = "Dashboard";

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty("SHEET_SECRET");
    if (!expected || body.secret !== expected) {
      return json_({ ok: false, error: "unauthorized" });
    }

    var header = body.header || [];
    var rows = body.rows || [];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ensureRaw_(ss, header);
    ensureDashboard_(ss);

    if (rows.length === 0) return json_({ ok: true, written: 0 });

    var tz = ss.getSpreadsheetTimeZone();

    // Dates present in this payload (col 0 = "YYYY-MM-DD" string).
    var incomingDates = {};
    rows.forEach(function (r) { incomingDates[String(r[0])] = true; });

    // Delete existing rows whose date is in this payload (idempotent upsert).
    var last = sheet.getLastRow();
    if (last > 1) {
      var dateCol = sheet.getRange(2, 1, last - 1, 1).getValues();
      for (var i = dateCol.length - 1; i >= 0; i--) {
        var key = toYmd_(dateCol[i][0], tz);
        if (incomingDates[key]) sheet.deleteRow(i + 2);
      }
    }

    // Append, storing col A as a real Date so the Dashboard QUERY/SUMIFS work.
    var values = rows.map(function (r) {
      var out = r.slice();
      out[0] = ymdToDate_(String(r[0]));
      return out;
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).setNumberFormat("yyyy-mm-dd");

    return json_({ ok: true, written: values.length, dates: Object.keys(incomingDates).length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function ensureRaw_(ss, header) {
  var sheet = ss.getSheetByName(RAW_SHEET);
  if (!sheet) sheet = ss.insertSheet(RAW_SHEET);
  // Always (re)write the header so a changed column set (e.g. new checkout_clicked
  // column) stays in sync with the incoming rows.
  if (header.length) {
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Run this once from the Apps Script editor (Ausführen ▸ rebuildDashboard) to
// (re)create the Dashboard with locale-correct formulas. Needs no redeploy.
function rebuildDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var existing = ss.getSheetByName(DASH_SHEET);
  if (existing) ss.deleteSheet(existing);
  buildDashboard_(ss);
}

function ensureDashboard_(ss) {
  if (ss.getSheetByName(DASH_SHEET)) return; // build once; never clobber user edits
  buildDashboard_(ss);
}

function buildDashboard_(ss) {
  var d = ss.insertSheet(DASH_SHEET, 0);

  // CRITICAL: setFormula() does NOT convert argument separators to the sheet's
  // locale. A de_DE sheet needs ';' (English locales use ','). Comma decimals →
  // semicolon list separator, so: non-"en_*" locale ⇒ ';'.
  var S = /^en/.test(String(ss.getSpreadsheetLocale())) ? "," : ";";

  d.getRange("A1").setValue("📊 Ads-Funnel Dashboard").setFontWeight("bold").setFontSize(14);
  d.getRange("A3").setValue("Von").setFontWeight("bold");
  d.getRange("A4").setValue("Bis").setFontWeight("bold");
  d.getRange("B3").setFormula("=TODAY()-7");
  d.getRange("B4").setFormula("=TODAY()-1");
  d.getRange("B3:B4").setNumberFormat("yyyy-mm-dd");
  d.getRange("C3").setValue("◀ Zeitraum frei wählbar — alles unten rechnet sich live neu.");

  // --- Gesamt-Funnel block ---  SUMIFS(sumCol; dateCol; ">="&B3; dateCol; "<="&B4)
  function sumifs(col) {
    var date = "Rohdaten!$A:$A";
    return "=SUMIFS(Rohdaten!$" + col + ":$" + col + S + date + S + '">="&$B$3' + S + date + S + '"<="&$B$4)';
  }
  // Rohdaten cols: F=Views G=Meta-Clicks H=Spend I=LP-CTA J=WK K=Kasse L=Bestellt M=Kauf N=Landungen
  // "Klicks" = N (on-site Advertorial-Landungen fb/ig); Meta-Klicks bleiben in Rohdaten Spalte G.
  d.getRange(7, 1).setValue("GESAMT (gewählter Zeitraum)").setFontWeight("bold");
  var funnel = [
    ["Ad Views (Impressions)", "F"], ["Klicks (on-site, fb/ig)", "N"], ["LP CTA Clicks", "I"],
    ["In den Warenkorb", "J"], ["Zur Kasse", "K"], ["Bestellt (zahlungspfl.)", "L"],
    ["Gekauft", "M"], ["Spend (€)", "H"],
  ];
  funnel.forEach(function (f, i) {
    d.getRange(8 + i, 1).setValue(f[0]);
    d.getRange(8 + i, 2).setFormula(sumifs(f[1]));
  });
  d.getRange("B15").setNumberFormat("0.00 €"); // Spend

  // --- Raten/Kosten --- B8 Views,B9 Clicks,B10 CTA,B11 WK,B12 Kasse,B13 Bestellt,B14 Kauf,B15 Spend
  function rate(n, dn) { return "=IF(" + dn + "=0" + S + "\"\"" + S + n + "/" + dn + ")"; }
  d.getRange("D7").setValue("Raten / Kosten (gesamt)").setFontWeight("bold");
  var rates = [
    ["CTR", "B9", "B8", "0.00%"], ["Klick→LP-CTA", "B10", "B9", "0.00%"],
    ["LP-CTA→Warenkorb", "B11", "B10", "0.00%"], ["Warenkorb→Zur Kasse", "B12", "B11", "0.00%"],
    ["Zur Kasse→Bestellt", "B13", "B12", "0.00%"], ["Bestellt→Kauf", "B14", "B13", "0.00%"],
    ["CPC (€)", "B15", "B9", "0.00 €"], ["Kosten/Kauf (€)", "B15", "B14", "0.00 €"],
  ];
  rates.forEach(function (r, i) {
    d.getRange(8 + i, 4).setValue(r[0]);
    d.getRange(8 + i, 5).setFormula(rate(r[1], r[2])).setNumberFormat(r[3]);
  });

  // --- Per-Ad Tabelle: Basis via QUERY (A..I), abgeleitete KPIs via ARRAYFORMULA (J..). ---
  d.getRange("A17").setValue("Quoten >100% möglich: CTA zählt Event-Klicks, Attribution ≠ Meta-Klicks.").setFontStyle("italic");
  d.getRange("A18").setValue("Pro Ad (gewählter Zeitraum, nach Spend sortiert)").setFontWeight("bold");
  var sel = "select D, sum(F), sum(N), sum(I), sum(J), sum(K), sum(L), sum(M), sum(H) ";
  var where = "where D is not null and toDate(A) >= date '\"&TEXT($B$3" + S + "\"yyyy-mm-dd\")&\"' and toDate(A) <= date '\"&TEXT($B$4" + S + "\"yyyy-mm-dd\")&\"' ";
  var tail = "group by D order by sum(H) desc label D 'Ad'" + ", sum(F) 'Views', sum(N) 'Klicks', sum(I) 'LP-CTA', sum(J) 'Warenkorb', sum(K) 'Kasse', sum(L) 'Bestellt', sum(M) 'Gekauft', sum(H) 'Spend €'";
  d.getRange("A19").setFormula("=QUERY(Rohdaten!$A:$N" + S + "\"" + sel + where + tail + "\"" + S + "1)");

  // Base output (ab Zeile 20): A=Ad B=Views C=Klicks D=LP-CTA E=WK F=Kasse G=Bestellt H=Kauf I=Spend
  function ratio(n, dn, mult) {
    return "=ARRAYFORMULA(IF(($A$20:$A=\"\")+(" + dn + "=0)" + S + "\"\"" + S + n + "/" + dn + (mult || "") + "))";
  }
  var derived = [
    ["CTR", "$C$20:$C", "$B$20:$B", "", "0.00%"],
    ["CPM €", "$I$20:$I", "$B$20:$B", "*1000", "0.00 €"],
    ["CPC €", "$I$20:$I", "$C$20:$C", "", "0.00 €"],
    ["Klick→CTA", "$D$20:$D", "$C$20:$C", "", "0.00%"],
    ["CTA→WK", "$E$20:$E", "$D$20:$D", "", "0.00%"],
    ["WK→Kasse", "$F$20:$F", "$E$20:$E", "", "0.00%"],
    ["Kasse→Bestellt", "$G$20:$G", "$F$20:$F", "", "0.00%"],
    ["Bestellt→Kauf", "$H$20:$H", "$G$20:$G", "", "0.00%"],
    ["€/LP-CTA", "$I$20:$I", "$D$20:$D", "", "0.00 €"],
    ["€/Warenkorb", "$I$20:$I", "$E$20:$E", "", "0.00 €"],
    ["€/Kauf (CPA)", "$I$20:$I", "$H$20:$H", "", "0.00 €"],
    ["Spend-Anteil", "$I$20:$I", "$B$15", "", "0.0%"],
  ];
  derived.forEach(function (c, i) {
    var ci = 10 + i; // J..
    d.getRange(19, ci).setValue(c[0]).setFontWeight("bold");
    d.getRange(20, ci).setFormula(ratio(c[1], c[2], c[3]));
    d.getRange(20, ci, 3000, 1).setNumberFormat(c[4]);
  });

  d.getRange(19, 1, 1, 21).setFontWeight("bold"); // Header-Zeile A19:U19
  d.setColumnWidth(1, 240);
  d.setFrozenColumns(1);
}

// ---- helpers ----
function ymdToDate_(s) {
  var p = s.split("-");
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}
function toYmd_(v, tz) {
  if (v instanceof Date) return Utilities.formatDate(v, tz, "yyyy-MM-dd");
  return String(v);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
