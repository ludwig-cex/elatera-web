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
  if (header.length && sheet.getLastRow() === 0) {
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
  d.getRange(7, 1).setValue("GESAMT (gewählter Zeitraum)").setFontWeight("bold");
  var funnel = [
    ["Ad Views (Impressions)", "F"], ["Ad Clicks", "G"], ["LP CTA Clicks", "I"],
    ["In den Warenkorb", "J"], ["Gekauft", "K"], ["Spend (€)", "H"],
  ];
  funnel.forEach(function (f, i) {
    d.getRange(8 + i, 1).setValue(f[0]);
    d.getRange(8 + i, 2).setFormula(sumifs(f[1]));
  });

  // --- Raten / Kosten gesamt --- (B8 Views,B9 Clicks,B10 CTA,B11 WK,B12 Kauf,B13 Spend)
  d.getRange("B13").setNumberFormat("0.00 €");
  function rate(n, dn) { return "=IF(" + dn + "=0" + S + "\"\"" + S + n + "/" + dn + ")"; }
  d.getRange("D7").setValue("Raten / Kosten (gesamt)").setFontWeight("bold");
  var rates = [
    ["CTR", "B9", "B8", "0.00%"], ["Klick→LP-CTA", "B10", "B9", "0.00%"],
    ["LP-CTA→Warenkorb", "B11", "B10", "0.00%"], ["Warenkorb→Kauf", "B12", "B11", "0.00%"],
    ["CPC (€)", "B13", "B9", "0.00 €"], ["Kosten/Kauf (€)", "B13", "B12", "0.00 €"],
  ];
  rates.forEach(function (r, i) {
    d.getRange(8 + i, 4).setValue(r[0]);
    d.getRange(8 + i, 5).setFormula(rate(r[1], r[2])).setNumberFormat(r[3]);
  });

  // --- Per-Ad Tabelle: Basis via QUERY (A..G), abgeleitete KPIs via ARRAYFORMULA (H..Q).
  // toDate(A) so a datetime column compares to a date literal. ---
  d.getRange("A15").setValue("Quoten >100% möglich: CTA zählt Event-Klicks, Attribution ≠ Meta-Klicks.").setFontStyle("italic");
  d.getRange("A16").setValue("Pro Ad (gewählter Zeitraum, nach Spend sortiert)").setFontWeight("bold");
  var sel = "select D, sum(F), sum(G), sum(I), sum(J), sum(K), sum(H) ";
  var where = "where D is not null and toDate(A) >= date '\"&TEXT($B$3" + S + "\"yyyy-mm-dd\")&\"' and toDate(A) <= date '\"&TEXT($B$4" + S + "\"yyyy-mm-dd\")&\"' ";
  var tail = "group by D order by sum(H) desc label D 'Ad'" + ", sum(F) 'Views', sum(G) 'Klicks', sum(I) 'LP-CTA', sum(J) 'Warenkorb', sum(K) 'Gekauft', sum(H) 'Spend €'";
  d.getRange("A17").setFormula("=QUERY(Rohdaten!$A:$K" + S + "\"" + sel + where + tail + "\"" + S + "1)");

  // Derived column: blank when ad is empty OR denominator is 0.
  function ratio(n, dn, mult) {
    return "=ARRAYFORMULA(IF(($A$18:$A=\"\")+(" + dn + "=0)" + S + "\"\"" + S + n + "/" + dn + (mult || "") + "))";
  }
  var derived = [
    ["CTR", "$C$18:$C", "$B$18:$B", "", "0.00%"],
    ["CPM €", "$G$18:$G", "$B$18:$B", "*1000", "0.00 €"],
    ["CPC €", "$G$18:$G", "$C$18:$C", "", "0.00 €"],
    ["Klick→CTA", "$D$18:$D", "$C$18:$C", "", "0.00%"],
    ["CTA→WK", "$E$18:$E", "$D$18:$D", "", "0.00%"],
    ["WK→Kauf", "$F$18:$F", "$E$18:$E", "", "0.00%"],
    ["€/LP-CTA", "$G$18:$G", "$D$18:$D", "", "0.00 €"],
    ["€/Warenkorb", "$G$18:$G", "$E$18:$E", "", "0.00 €"],
    ["€/Kauf (CPA)", "$G$18:$G", "$F$18:$F", "", "0.00 €"],
    ["Spend-Anteil", "$G$18:$G", "$B$13", "", "0.0%"],
  ];
  derived.forEach(function (c, i) {
    var ci = 8 + i; // H..Q
    d.getRange(17, ci).setValue(c[0]).setFontWeight("bold");
    d.getRange(18, ci).setFormula(ratio(c[1], c[2], c[3]));
    d.getRange(18, ci, 3000, 1).setNumberFormat(c[4]);
  });

  d.getRange("A17:Q17").setFontWeight("bold");
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
