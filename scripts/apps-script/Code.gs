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

function ensureDashboard_(ss) {
  if (ss.getSheetByName(DASH_SHEET)) return; // build once; never clobber user edits
  var d = ss.insertSheet(DASH_SHEET, 0);

  d.getRange("A1").setValue("📊 Ads-Funnel Dashboard").setFontWeight("bold").setFontSize(14);
  d.getRange("A3").setValue("Von").setFontWeight("bold");
  d.getRange("A4").setValue("Bis").setFontWeight("bold");
  d.getRange("B3").setFormula("=TODAY()-7");
  d.getRange("B4").setFormula("=TODAY()-1");
  d.getRange("B3:B4").setNumberFormat("yyyy-mm-dd");
  d.getRange("C3").setValue("◀ Zeitraum frei wählbar — alles unten rechnet sich live neu.");

  // --- Gesamt-Funnel block ---
  var rawRange = "Rohdaten!$A:$K";
  var dateCol = "Rohdaten!$A:$A";
  var from = '">="&$B$3', to = '"<="&$B$4';
  function sumifs(col) { return "=SUMIFS(Rohdaten!$" + col + ":$" + col + "," + dateCol + "," + from + "," + dateCol + "," + to + ")"; }

  var rows = [
    ["", ""],
    ["GESAMT (gewählter Zeitraum)", ""],
    ["Ad Views (Impressions)", sumifs("F")],
    ["Ad Clicks", sumifs("G")],
    ["LP CTA Clicks", sumifs("I")],
    ["In den Warenkorb", sumifs("J")],
    ["Gekauft", sumifs("K")],
    ["Spend (€)", sumifs("H")],
  ];
  d.getRange(6, 1, rows.length, 2).setValues(rows.map(function (r) { return [r[0], ""]; }));
  // set formulas separately (setValues won't evaluate formula strings reliably)
  d.getRange("B8").setFormula(sumifs("F"));
  d.getRange("B9").setFormula(sumifs("G"));
  d.getRange("B10").setFormula(sumifs("I"));
  d.getRange("B11").setFormula(sumifs("J"));
  d.getRange("B12").setFormula(sumifs("K"));
  d.getRange("B13").setFormula(sumifs("H"));
  d.getRange("A7:B7").setFontWeight("bold");

  // --- Raten ---
  d.getRange("D7").setValue("Raten / Kosten").setFontWeight("bold");
  d.getRange("D8").setValue("CTR"); d.getRange("E8").setFormula("=IFERROR(B9/B8,0)").setNumberFormat("0.00%");
  d.getRange("D9").setValue("Klick→LP-CTA"); d.getRange("E9").setFormula("=IFERROR(B10/B9,0)").setNumberFormat("0.00%");
  d.getRange("D10").setValue("LP-CTA→Warenkorb"); d.getRange("E10").setFormula("=IFERROR(B11/B10,0)").setNumberFormat("0.00%");
  d.getRange("D11").setValue("Warenkorb→Kauf"); d.getRange("E11").setFormula("=IFERROR(B12/B11,0)").setNumberFormat("0.00%");
  d.getRange("D12").setValue("CPC (€)"); d.getRange("E12").setFormula("=IFERROR(B13/B9,0)").setNumberFormat("0.00 €");
  d.getRange("D13").setValue("Kosten/Kauf (€)"); d.getRange("E13").setFormula("=IFERROR(B13/B12,0)").setNumberFormat("0.00 €");

  // --- Per-Ad Tabelle (dynamisch nach Zeitraum) ---
  d.getRange("A16").setValue("Pro Ad (gewählter Zeitraum, nach Spend)").setFontWeight("bold");
  var q =
    '=QUERY(' + rawRange + ',"select D, sum(F), sum(G), sum(I), sum(J), sum(K), sum(H) ' +
    'where A is not null and A >= date \'"&TEXT($B$3,"yyyy-mm-dd")&"\' and A <= date \'"&TEXT($B$4,"yyyy-mm-dd")&"\' ' +
    'group by D order by sum(H) desc ' +
    'label D \'Ad\', sum(F) \'Views\', sum(G) \'Klicks\', sum(I) \'LP-CTA\', sum(J) \'Warenkorb\', sum(K) \'Gekauft\', sum(H) \'Spend €\'",1)';
  d.getRange("A17").setFormula(q);

  d.setColumnWidth(1, 220);
  d.setFrozenRows(1);
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
