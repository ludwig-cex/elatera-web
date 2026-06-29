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
  // Serialise concurrent POSTs. Without this, two overlapping requests (e.g. a
  // manual backfill racing the cron) each delete-then-append and the rows end up
  // duplicated. The lock makes the read-delete-append cycle atomic.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
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
    var width = header.length || rows[0].length;

    // Dates present in this payload (col 0 = "YYYY-MM-DD" string).
    var incomingDates = {};
    rows.forEach(function (r) { incomingDates[String(r[0])] = true; });

    // Idempotent upsert WITHOUT deleteRow: read existing rows, drop the ones whose
    // date is in this payload, then rewrite kept + fresh in one block. deleteRow
    // throws "cannot delete all non-frozen rows" when a backfill covers every
    // existing date; rewriting sidesteps that and is atomic under the lock.
    var last = sheet.getLastRow();
    var lastCol = Math.max(width, sheet.getLastColumn());
    var kept = [];
    if (last > 1) {
      var existing = sheet.getRange(2, 1, last - 1, lastCol).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (!incomingDates[toYmd_(existing[i][0], tz)]) kept.push(existing[i]);
      }
    }

    // Fresh rows: store col A as a real Date so the Dashboard QUERY/SUMIFS work.
    var fresh = rows.map(function (r) {
      var out = r.slice();
      out[0] = ymdToDate_(String(r[0]));
      return out;
    });

    // Normalise every row to the current header width (handles added columns).
    var all = kept.concat(fresh).map(function (row) {
      var r = row.slice(0, width);
      while (r.length < width) r.push("");
      return r;
    });

    if (last > 1) sheet.getRange(2, 1, last - 1, lastCol).clearContent();
    if (all.length) {
      sheet.getRange(2, 1, all.length, width).setValues(all);
      sheet.getRange(2, 1, all.length, 1).setNumberFormat("yyyy-mm-dd");
    }

    return json_({ ok: true, written: fresh.length, kept: kept.length, dates: Object.keys(incomingDates).length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
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
  buildDashboard_(SpreadsheetApp.getActiveSpreadsheet());
}

// Delete a sheet if it exists, then (re)create it. flush() forces the delete to
// commit before the insert — without it, deleting the active sheet and inserting
// the same name back-to-back can throw "Service Spreadsheets failed".
function freshSheet_(ss, name, index) {
  var s = ss.getSheetByName(name);
  if (s) { ss.deleteSheet(s); SpreadsheetApp.flush(); }
  return index == null ? ss.insertSheet(name) : ss.insertSheet(name, index);
}

function ensureDashboard_(ss) {
  if (ss.getSheetByName(DASH_SHEET)) return; // build once; never clobber user edits
  buildDashboard_(ss);
}

function buildDashboard_(ss) {
  var d = freshSheet_(ss, DASH_SHEET, 0);

  // CRITICAL: setFormula() does NOT convert argument separators to the sheet's
  // locale. A de_DE sheet needs ';' (English locales use ','). Comma decimals →
  // semicolon list separator, so: non-"en_*" locale ⇒ ';'.
  var S = /^en/.test(String(ss.getSpreadsheetLocale())) ? "," : ";";
  var EUR = "0.00 €", PCT = "0.00%", XX = '0.00"×"';
  buildDetail_(ss, S, EUR, PCT, XX); // Datenquelle für ④ liegt auf eigenem Tab "Detail"
  buildTagesauswertung_(ss, S, EUR, PCT); // Tab: Tag- & Wochen-Vergleich
  buildAdAnalyse_(ss, S, EUR, PCT); // Tab: Ads spaltenweise, harte Zahlen + Quoten über mehrere Zeiträume
  buildCostPerStep_(ss, S, EUR, PCT); // Tab: Funnel mit Kosten pro Stufe über den Zeitraum

  // Rohdaten-Spalten: F=Impr G=Link-Klicks H=Spend I=LP-CTA J=WK K=Kasse
  //   L=Bestellt M=Kauf N=Landung O=Reach P=Alle-Klicks Q=Meta-LPV R=Produktansicht S=Umsatz
  function sumifs(col) {
    var date = "Rohdaten!$A:$A";
    return "=SUMIFS(Rohdaten!$" + col + ":$" + col + S + date + S + '">="&$B$3' + S + date + S + '"<="&$B$4)';
  }
  function div(numCell, denCell, mult) { // ratio of two already-computed cells
    return "=IF(" + denCell + "=0" + S + "\"\"" + S + numCell + "/" + denCell + (mult || "") + ")";
  }
  function lbl(a1, text) { d.getRange(a1).setValue(text); }
  function note(a1, text) { d.getRange(a1).setValue(text).setFontStyle("italic").setFontColor("#666666"); }

  d.getRange("A1").setValue("📊 Ads-Funnel Dashboard — Meta ↔ PostHog").setFontWeight("bold").setFontSize(14);
  d.getRange("A3").setValue("Von").setFontWeight("bold");
  d.getRange("A4").setValue("Bis").setFontWeight("bold");
  d.getRange("B3").setFormula("=TODAY()-7");
  d.getRange("B4").setFormula("=TODAY()-1");
  d.getRange("B3:B4").setNumberFormat("yyyy-mm-dd");
  d.getRange("C3").setValue("◀ Zeitraum frei wählbar. Nur Paid (utm fb/ig); ohne utm = eigene Tests, nicht enthalten.").setFontStyle("italic");

  // ===== ① SCORECARD (Zeile 6 Titel, 7 Labels, 8 Werte) — referenziert den Funnel unten =====
  d.getRange("A6").setValue("① Scorecard").setFontWeight("bold");
  var score = [
    ["Spend", "=B17", EUR], ["Impressions", "=B12", "#,##0"],
    ["Link-CTR", div("B15", "B12"), PCT], ["CPC", div("B17", "B15"), EUR],
    ["Landungen", "=E12", "#,##0"], ["Bestellt", "=E17", "#,##0"],
    ["CAC (/Bestellt)", div("B17", "E17"), EUR], ["ROAS", div("E19", "B17"), XX],
  ];
  score.forEach(function (s, i) {
    d.getRange(7, 1 + i).setValue(s[0]).setFontColor("#666666");
    d.getRange(8, 1 + i).setFormula(s[1]).setNumberFormat(s[2]).setFontSize(13).setFontWeight("bold");
  });

  // ===== ② ZWEI-WELTEN-FUNNEL =====
  d.getRange("A10").setValue("② Zwei-Welten-Funnel").setFontWeight("bold");
  d.getRange("A11").setValue("META — Lieferung (misst die Anzeige)").setFontWeight("bold").setFontColor("#185FA5");
  d.getRange("D11").setValue("POSTHOG — Website (misst die Seite)").setFontWeight("bold").setFontColor("#0F6E56");

  // Meta-Seite: Label A · Wert B · Quote C (Schritt-Conversion).
  d.getRange("C11").setValue("Quote").setFontWeight("bold").setFontColor("#888780");
  lbl("A12", "Impressions");           d.getRange("B12").setFormula(sumifs("F")).setNumberFormat("#,##0");
  lbl("A13", "Reach (Personen)");      d.getRange("B13").setFormula(sumifs("O")).setNumberFormat("#,##0");
  d.getRange("C13").setFormula(div("B12", "B13")).setNumberFormat(XX);   // Frequency
  lbl("A14", "Alle Klicks");           d.getRange("B14").setFormula(sumifs("P")).setNumberFormat("#,##0");
  lbl("A15", "Link-Klicks");           d.getRange("B15").setFormula(sumifs("G")).setNumberFormat("#,##0");
  d.getRange("C15").setFormula(div("B15", "B12")).setNumberFormat(PCT);  // CTR (vs Impr)
  lbl("A16", "Angekommen — Meta-LPV"); d.getRange("B16").setFormula(sumifs("Q")).setNumberFormat("#,##0");
  d.getRange("C16").setFormula(div("B16", "B15")).setNumberFormat(PCT);  // Klick→Seite
  lbl("A17", "Spend €");               d.getRange("B17").setFormula(sumifs("H")).setNumberFormat(EUR);
  d.getRange("C17").setFormula(div("B17", "B15")).setNumberFormat(EUR);  // CPC

  // PostHog-Seite: Label D · Wert E · Quote F (Schritt-Conversion vom Schritt davor).
  d.getRange("F11").setValue("Quote").setFontWeight("bold").setFontColor("#888780");
  lbl("D12", "Angekommen — Landung");  d.getRange("E12").setFormula(sumifs("N")).setNumberFormat("#,##0");
  lbl("D13", "CTA → Shop");            d.getRange("E13").setFormula(sumifs("I")).setNumberFormat("#,##0");
  d.getRange("F13").setFormula(div("E13", "E12")).setNumberFormat(PCT);  // CTA/Landung
  lbl("D14", "Produktansicht (Shop)"); d.getRange("E14").setFormula(sumifs("R")).setNumberFormat("#,##0");
  d.getRange("F14").setFormula(div("E14", "E13")).setNumberFormat(PCT);
  lbl("D15", "Warenkorb");             d.getRange("E15").setFormula(sumifs("J")).setNumberFormat("#,##0");
  d.getRange("F15").setFormula(div("E15", "E14")).setNumberFormat(PCT);  // Produkt→WK
  lbl("D16", "Zur Kasse");             d.getRange("E16").setFormula(sumifs("K")).setNumberFormat("#,##0");
  d.getRange("F16").setFormula(div("E16", "E15")).setNumberFormat(PCT);
  lbl("D17", "Bestellt (zahlungspfl.)"); d.getRange("E17").setFormula(sumifs("L")).setNumberFormat("#,##0");
  d.getRange("F17").setFormula(div("E17", "E16")).setNumberFormat(PCT);
  lbl("D18", "Gekauft");               d.getRange("E18").setFormula(sumifs("M")).setNumberFormat("#,##0");
  d.getRange("F18").setFormula(div("E18", "E17")).setNumberFormat(PCT);
  lbl("D19", "Umsatz €");              d.getRange("E19").setFormula(sumifs("S")).setNumberFormat(EUR);
  d.getRange("F19").setFormula(div("E19", "B17")).setNumberFormat(XX);   // ROAS
  note("A20", "Angekommen: Meta-LPV mit Pixel (eher zu niedrig) · PostHog-Landung pixel-less (eher zu hoch) — Differenz = Mess-Methode, kein Fehler.");
  d.getRange("A21").setFormula(
    "=\"Produktansicht zählt nur den Advertorial-Pfad · direkt zum Shop (separate Ads, nicht im Funnel): \"&TEXT(SUMIFS(Rohdaten!$T:$T" +
    S + "Rohdaten!$A:$A" + S + "\">=\"&$B$3" + S + "Rohdaten!$A:$A" + S + "\"<=\"&$B$4)" + S + "\"0\")&\" Personen\""
  ).setFontStyle("italic").setFontColor("#666666");

  // ===== ③ LEGENDE (einklappbar — [−]/[+] am linken Rand, Zeilen 23–27) =====
  d.getRange("A22").setValue("③ Legende").setFontWeight("bold");
  note("A23", "Link-Klick (Meta): Klick, der wirklich zur Seite führt (ohne Likes/Profil). Basis für CTR & CPC.");
  note("A24", "Meta-LPV: Metas eigene Zählung „Seite geladen\" — braucht Pixel, daher eher zu niedrig.");
  note("A25", "Landung: Person, die laut PostHog aufs Advertorial kam (fb/ig). Cookieless, daher eher zu hoch.");
  note("A26", "CTA: Klick vom Advertorial in den Shop.   ·   CAC = Spend ÷ Zahlungspfl. Bestellt   ·   ROAS = Umsatz ÷ Spend.");
  note("A27", "Meta misst die Anzeige, PostHog die Website — sie stimmen nie exakt überein. Beide nebeneinander zeigt, wo Leute abspringen.");
  try { d.getRange("23:27").shiftRowGroupDepth(1); d.getRowGroup(23, 1).collapse(); } catch (e) {}

  // ===== ④ ALLE ADS NEBENEINANDER — transponierter Vergleich (Quelle: Tab „Detail") =====
  var rules = [];
  function heatRow(row, greenHigh) { // höher (oder bei false: niedriger) = besser → grün
    var lo = greenHigh ? "#F7C1C1" : "#C0DD97", hi = greenHigh ? "#C0DD97" : "#F7C1C1";
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpoint(lo).setGradientMaxpoint(hi)
      .setRanges([d.getRange(row, 2, 1, 14)]).build());
  }
  d.getRange("A29").setValue("④ Alle Ads nebeneinander (Spend > 2 €, nach Spend sortiert)").setFontWeight("bold");
  d.getRange("A30").setValue("Kennzahl ↓ / Ad →").setFontWeight("bold");
  var cmpLabels = [
    "Spend €", "Frequency", "CTR (Link)", "CPC €", "Landungen",
    "CTA-Rate", "Produktansicht", "Produkt→WK", "Warenkörbe", "davon Auto-WK", "Zahlungspfl. bestellt", "CAC € (/Best.)", "ROAS",
  ];
  cmpLabels.forEach(function (t, i) { d.getRange(31 + i, 1).setValue(t).setFontColor("#666666"); });
  // Kuratierte Auswahl aus dem Detail-Tab (Daten ab Zeile 2), nur Ads mit Spend > 2 €.
  // Detail-Spalten (abgeleitete je +1 verschoben durch neue Auto-WK-Basis-Spalte P=Col16):
  //   Col1=Ad Col2=Spend Col17=Freq Col19=CTR Col20=CPC Col7=Landung Col23=CTA-Rate
  //   Col10=Produktansicht Col24=Produkt→WK Col11=Warenkorb Col16=Auto-WK Col13=Bestellt Col26=CAC Col27=ROAS
  d.getRange("B30").setFormula(
    "=TRANSPOSE(QUERY(Detail!$A$2:$AA$120" + S +
    "\"select Col1,Col2,Col17,Col19,Col20,Col7,Col23,Col10,Col24,Col11,Col16,Col13,Col26,Col27 where Col1 is not null and Col2 > 2 order by Col2 desc\"" + S + "0))");
  d.getRange("B30:O30").setFontWeight("bold").setWrap(true); // Ad-Namen als Spaltenköpfe
  var cmpFmt = [EUR, XX, PCT, EUR, "#,##0", PCT, "#,##0", PCT, "#,##0", "#,##0", "#,##0", EUR, XX];
  cmpFmt.forEach(function (f, i) { d.getRange(31 + i, 2, 1, 14).setNumberFormat(f); });
  heatRow(33, true);   // CTR (Link)
  heatRow(34, false);  // CPC — niedriger = besser
  heatRow(36, true);   // CTA-Rate
  heatRow(38, true);   // Produkt→WK
  d.setConditionalFormatRules(rules);

  // ===== ⑤ CPC-VERLAUF je Ad — Abnutzung über die Zeit (gleiche Ad-Spalten wie ④) =====
  d.getRange("A44").setValue("⑤ CPC-Verlauf je Ad — wie nutzt sich der Klickpreis ab?").setFontWeight("bold");
  d.getRange("B45").setFormula("=B30"); // Ad-Namen aus ④ spiegeln
  d.getRange("B45").copyTo(d.getRange("C45:O45"), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
  d.getRange("B45:O45").setFontWeight("bold").setWrap(true);
  function cpc(dateCrit) { // CPC = Spend / Link-Klicks für Ad (B$30) + Datumskriterium
    var base = "Rohdaten!$D:$D" + S + "B$30" + S + dateCrit;
    var g = "SUMIFS(Rohdaten!$G:$G" + S + base + ")";
    var h = "SUMIFS(Rohdaten!$H:$H" + S + base + ")";
    return "=IF(" + g + "=0" + S + "\"\"" + S + h + "/" + g + ")";
  }
  var dCol = "Rohdaten!$A:$A";
  var cpcRows = [
    ["CPC Zeitraum", dCol + S + '">="&$B$3' + S + dCol + S + '"<="&$B$4'],
    ["CPC Stichtag (Bis)", dCol + S + "$B$4"],
    ["CPC −3 Tage", dCol + S + "$B$4-3"],
    ["CPC −7 Tage", dCol + S + "$B$4-7"],
  ];
  cpcRows.forEach(function (r, i) {
    var row = 46 + i;
    d.getRange(row, 1).setValue(r[0]).setFontColor("#666666");
    d.getRange(row, 2).setFormula(cpc(r[1]));
    d.getRange(row, 2).copyTo(d.getRange(row, 3, 1, 13), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    d.getRange(row, 2, 1, 14).setNumberFormat(EUR);
  });

  d.getRange("A51").setValue("Vollständige Tabelle (alle Ads, alle Kennzahlen): Tab „Detail" + String.fromCharCode(8221) + " unten.").setFontStyle("italic").setFontColor("#666666");

  // ---- Optik: Gitterlinien aus, Sektionen abgesetzt, Karten/Block-Rahmen ----
  d.setHiddenGridlines(true);
  var GREY = "#D3D1C7", BAND = "#EEEDF0", CARD = "#F7F6F2", SOLID = SpreadsheetApp.BorderStyle.SOLID;
  [6, 10, 22, 29, 44].forEach(function (r) { d.getRange(r, 1, 1, 15).setBackground(BAND); });
  d.getRange("A7:H8").setBackground(CARD).setBorder(true, true, true, true, true, false, GREY, SOLID);
  d.getRange("A11:C17").setBorder(true, true, true, true, false, false, "#85B7EB", SOLID); // Meta-Block
  d.getRange("D11:F19").setBorder(true, true, true, true, false, false, "#5DCAA5", SOLID); // PostHog-Block
  d.getRange("A30:O30").setBorder(null, null, true, null, null, null, GREY, SpreadsheetApp.BorderStyle.SOLID_MEDIUM); // ④ Kopf
  d.getRange("A45:O45").setBorder(null, null, true, null, null, null, GREY, SOLID); // ⑤ Kopf

  d.setColumnWidth(1, 230);
  d.setColumnWidth(4, 180);
  d.setFrozenColumns(1);
}

// Eigener Tab „Detail": pro Ad eine Zeile, alle Kennzahlen — Datenquelle für den
// ④ Vergleich. Zeitraum kommt aus Dashboard!B3/B4.
function buildDetail_(ss, S, EUR, PCT, XX) {
  var t = freshSheet_(ss, "Detail", null);
  var sel = "select D, sum(H), sum(F), sum(O), sum(P), sum(G), sum(N), sum(Q), sum(I), sum(R), sum(J), sum(K), sum(L), sum(M), sum(S), sum(U) ";
  var where = "where D is not null and toDate(A) >= date '\"&TEXT(Dashboard!$B$3" + S + "\"yyyy-mm-dd\")&\"' and toDate(A) <= date '\"&TEXT(Dashboard!$B$4" + S + "\"yyyy-mm-dd\")&\"' ";
  var tail = "group by D order by sum(H) desc label D 'Ad', sum(H) 'Spend €', sum(F) 'Impr', sum(O) 'Reach', sum(P) 'Alle Klk', sum(G) 'Link-Klk', sum(N) 'Landung', sum(Q) 'Meta-LPV', sum(I) 'CTA', sum(R) 'Produktans.', sum(J) 'Warenkorb', sum(K) 'Kasse', sum(L) 'Bestellt', sum(M) 'Gekauft', sum(S) 'Umsatz €', sum(U) 'Auto-WK'";
  t.getRange("A1").setFormula("=QUERY(Rohdaten!$A:$U" + S + "\"" + sel + where + tail + "\"" + S + "1)");
  // Header Zeile 1, Daten ab 2. A=Ad B=Spend C=Impr D=Reach E=AlleKlk F=LinkKlk
  //   G=Landung H=LPV I=CTA J=Prod K=WK L=Kasse M=Bestellt N=Kauf O=Umsatz P=Auto-WK
  t.getRange("B2:B").setNumberFormat(EUR);
  t.getRange("O2:O").setNumberFormat(EUR);
  function ratio(n, dn, mult) {
    return "=ARRAYFORMULA(IF(($A$2:$A=\"\")+(" + dn + "=0)" + S + "\"\"" + S + n + "/" + dn + (mult || "") + "))";
  }
  var derived = [
    ["Frequency", "$C$2:$C", "$D$2:$D", "", XX],
    ["CPM €", "$B$2:$B", "$C$2:$C", "*1000", EUR],
    ["CTR (Link)", "$F$2:$F", "$C$2:$C", "", PCT],
    ["CPC €", "$B$2:$B", "$F$2:$F", "", EUR],
    ["Landerate", "$G$2:$G", "$F$2:$F", "", PCT],
    ["€/Landung", "$B$2:$B", "$G$2:$G", "", EUR],
    ["CTA-Rate", "$I$2:$I", "$G$2:$G", "", PCT],
    ["Produkt→WK", "$K$2:$K", "$J$2:$J", "", PCT],
    ["Kasse-Rate", "$L$2:$L", "$K$2:$K", "", PCT],
    ["CAC € (/Bestellt)", "$B$2:$B", "$M$2:$M", "", EUR],
    ["ROAS", "$O$2:$O", "$B$2:$B", "", XX],
  ];
  var rules = [];
  derived.forEach(function (c, i) {
    var ci = 17 + i; // Q.. (P = Auto-WK aus der QUERY)
    t.getRange(1, ci).setValue(c[0]).setFontWeight("bold");
    t.getRange(2, ci).setFormula(ratio(c[1], c[2], c[3]));
    t.getRange(2, ci, 3000, 1).setNumberFormat(c[4]);
  });
  ["S", "U", "W", "X"].forEach(function (col) { // CTR, Landerate, CTA-Rate, Produkt→WK (je +1 verschoben)
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpoint("#F7C1C1").setGradientMaxpoint("#C0DD97")
      .setRanges([t.getRange(col + "2:" + col + "3000")]).build());
  });
  t.setConditionalFormatRules(rules);
  t.getRange(1, 1, 1, 27).setFontWeight("bold");
  t.setColumnWidth(1, 230);
  t.setFrozenRows(1);
  t.setFrozenColumns(1);
}

// Tab "Tagesauswertung": Tag vs Vortag UND Woche-bis-Stichtag vs Vorwoche
// (gleiche Wochentags-Spanne). Stichtag = TODAY()-1 (letzter voller Tag), frei
// änderbar. Datenquelle der täglichen Telegram-Auswertung.
function buildTagesauswertung_(ss, S, EUR, PCT) {
  var t = freshSheet_(ss, "Tagesauswertung", 1);
  var INT = "#,##0";
  t.getRange("A1").setValue("📅 Tagesauswertung — Tag & Woche im Vergleich").setFontWeight("bold").setFontSize(14);
  t.getRange("A3").setValue("Stichtag (letzter voller Tag)").setFontWeight("bold");
  t.getRange("B3").setFormula("=TODAY()-1").setNumberFormat("yyyy-mm-dd");
  t.getRange("D3").setValue("Wochenstart (Mo)").setFontColor("#666666");
  t.getRange("E3").setFormula("=$B$3-(WEEKDAY($B$3" + S + "2)-1)").setNumberFormat("yyyy-mm-dd");
  t.getRange("A4").setValue("Vortag · Woche-bis-Stichtag · Vorwoche rechnen sich relativ zum Stichtag. Nur Paid (utm fb/ig).").setFontStyle("italic").setFontColor("#666666");

  // dir: 1 = höher besser (grün bei Δ>0), -1 = niedriger besser, 0 = neutral.
  var metrics = [
    { l: "Impressions", k: "count", c: "F", f: INT, dir: 1 },
    { l: "Link-Klicks", k: "count", c: "G", f: INT, dir: 1 },
    { l: "CTR (Link)", k: "rate", n: "G", d: "F", f: PCT, dir: 1 },
    { l: "Landungen", k: "count", c: "N", f: INT, dir: 1 },
    { l: "CTA → Shop", k: "count", c: "I", f: INT, dir: 1 },
    { l: "CTA-Rate", k: "rate", n: "I", d: "N", f: PCT, dir: 1 },
    { l: "Produktansicht", k: "count", c: "R", f: INT, dir: 1 },
    { l: "Warenkorb", k: "count", c: "J", f: INT, dir: 1 },
    { l: "Zur Kasse", k: "count", c: "K", f: INT, dir: 1 },
    { l: "Zahlungspfl. bestellt", k: "count", c: "L", f: INT, dir: 1 },
    { l: "Gekauft", k: "count", c: "M", f: INT, dir: 1 },
    { l: "Spend €", k: "count", c: "H", f: EUR, dir: 0 },
    { l: "CPC €", k: "rate", n: "H", d: "G", f: EUR, dir: -1 },
    { l: "CAC € (/Best.)", k: "rate", n: "H", d: "L", f: EUR, dir: -1 },
  ];
  function single(dayExpr) { return "Rohdaten!$A:$A" + S + dayExpr; }
  function range(a, b) { return "Rohdaten!$A:$A" + S + '">="&' + a + S + "Rohdaten!$A:$A" + S + '"<="&' + b; }
  function val(m, dExpr) {
    if (m.k === "count") return "=SUMIFS(Rohdaten!$" + m.c + ":$" + m.c + S + dExpr + ")";
    var den = "SUMIFS(Rohdaten!$" + m.d + ":$" + m.d + S + dExpr + ")";
    var num = "SUMIFS(Rohdaten!$" + m.n + ":$" + m.n + S + dExpr + ")";
    return "=IF(" + den + "=0" + S + "\"\"" + S + num + "/" + den + ")";
  }

  var rules = [];
  function block(startRow, title, prevLabel, curLabel, prevExpr, curExpr) {
    t.getRange(startRow, 1).setValue(title).setFontWeight("bold");
    var hr = startRow + 1;
    t.getRange(hr, 1).setValue("Kennzahl").setFontWeight("bold");
    t.getRange(hr, 2).setFormula(prevLabel).setFontWeight("bold").setHorizontalAlignment("right");
    t.getRange(hr, 3).setFormula(curLabel).setFontWeight("bold").setHorizontalAlignment("right");
    t.getRange(hr, 4).setValue("Δ").setFontWeight("bold").setHorizontalAlignment("right");
    metrics.forEach(function (m, i) {
      var r = hr + 1 + i;
      t.getRange(r, 1).setValue(m.l).setFontColor("#666666");
      t.getRange(r, 2).setFormula(val(m, prevExpr)).setNumberFormat(m.f);
      t.getRange(r, 3).setFormula(val(m, curExpr)).setNumberFormat(m.f);
      t.getRange(r, 4).setFormula("=IF(OR($B" + r + "=\"\"" + S + "$C" + r + "=\"\")" + S + "\"\"" + S + "$C" + r + "-$B" + r + ")").setNumberFormat(m.f);
      if (m.dir !== 0) {
        var pos = m.dir === 1 ? "#1D9E75" : "#E24B4A", neg = m.dir === 1 ? "#E24B4A" : "#1D9E75";
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberGreaterThan(0).setFontColor(pos).setRanges([t.getRange(r, 4)]).build());
        rules.push(SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0).setFontColor(neg).setRanges([t.getRange(r, 4)]).build());
      }
    });
  }

  block(6, "① Tag — Stichtag vs. Vortag",
    "=\"Vortag \"&TEXT($B$3-1" + S + "\"dd.mm.\")",
    "=\"Stichtag \"&TEXT($B$3" + S + "\"dd.mm.\")",
    single("$B$3-1"), single("$B$3"));

  block(23, "② Woche bis Stichtag vs. Vorwoche (gleiche Spanne)",
    "=\"Vorwoche \"&TEXT($E$3-7" + S + "\"dd.mm\")&\"–\"&TEXT($B$3-7" + S + "\"dd.mm.\")",
    "=\"Diese Woche \"&TEXT($E$3" + S + "\"dd.mm\")&\"–\"&TEXT($B$3" + S + "\"dd.mm.\")",
    range("$E$3-7", "$B$3-7"), range("$E$3", "$B$3"));

  t.setConditionalFormatRules(rules);
  t.setColumnWidth(1, 180);
  t.setColumnWidth(2, 150);
  t.setColumnWidth(3, 150);
  t.setColumnWidth(4, 90);
  t.setFrozenColumns(1);
}

// Tab "Ad-Analyse": Ads SPALTENWEISE, je Kern-Quote über drei Zeitfenster
// (frei wählbarer Zeitraum · letzte 3 Tage · letzte 7 Tage, relativ zum Stichtag).
// So sieht man pro Ad die Entwicklung von CTR / CTA-Rate / Produktrate / Warenkorb.
function buildAdAnalyse_(ss, S, EUR, PCT) {
  var INT = "#,##0";
  var t = freshSheet_(ss, "Ad-Analyse", 2);
  t.getRange("A1").setValue("📊 Ad-Analyse — harte Zahlen + Quoten über mehrere Zeiträume").setFontWeight("bold").setFontSize(14);
  t.getRange("A3").setValue("Stichtag (für 3/7 Tage)").setFontWeight("bold");
  t.getRange("B3").setFormula("=TODAY()-1").setNumberFormat("yyyy-mm-dd");
  t.getRange("A4").setValue("Zeitraum Von").setFontWeight("bold");
  t.getRange("B4").setFormula("=TODAY()-7").setNumberFormat("yyyy-mm-dd");
  t.getRange("A5").setValue("Zeitraum Bis").setFontWeight("bold");
  t.getRange("B5").setFormula("=$B$3").setNumberFormat("yyyy-mm-dd");
  t.getRange("A6").setValue("Ads = Spalten · je Kennzahl: gewählter Zeitraum · letzte 3 Tage · letzte 7 Tage (relativ zum Stichtag). Heatmap: grün = besser.").setFontStyle("italic").setFontColor("#666666");

  // Ad-Namen als Spaltenköpfe — aus dem Detail-Tab (nach Spend sortiert).
  t.getRange("A8").setValue("Kennzahl ↓ / Ad →").setFontWeight("bold");
  t.getRange("B8").setFormula("=TRANSPOSE(Detail!$A$2:$A$13)");
  t.getRange("B8:M8").setFontWeight("bold").setWrap(true);

  var windows = [
    ["Zeitraum", "$B$4", "$B$5"],
    ["3 Tage", "$B$3-2", "$B$3"],
    ["7 Tage", "$B$3-6", "$B$3"],
  ];
  // Funnel-Reihenfolge: harte Zahlen + Quote an ihrer Stufe. Rohdaten-Spalten:
  //   F=Impr G=Link-Klicks H=Spend I=CTA J=Warenkorb N=Landung R=Produktansicht
  // kind: "int" | "eur" | "rate"(num/den).
  var metrics = [
    { l: "Spend €", k: "eur", c: "H" },
    { l: "Impressions", k: "int", c: "F" },
    { l: "Link-Klicks", k: "int", c: "G" },
    { l: "CTR", k: "rate", n: "G", d: "F" },
    { l: "Landungen", k: "int", c: "N" },
    { l: "CTA → Shop", k: "int", c: "I" },
    { l: "CTA-Rate", k: "rate", n: "I", d: "N" },
    { l: "Produktansicht", k: "int", c: "R" },
    { l: "Produktrate", k: "rate", n: "R", d: "I" },
    { l: "Warenkorb", k: "int", c: "J" },
    { l: "davon Auto-WK", k: "int", c: "U" },
    { l: "Warenkorb-Rate", k: "rate", n: "J", d: "R" },
  ];
  function sumifs(col, from, to) {
    return "SUMIFS(Rohdaten!$" + col + ":$" + col + S + "Rohdaten!$D:$D" + S + "B$8" + S +
      "Rohdaten!$A:$A" + S + '">="&' + from + S + "Rohdaten!$A:$A" + S + '"<="&' + to + ")";
  }
  function val(m, from, to) {
    if (m.k === "rate") {
      var d = sumifs(m.d, from, to);
      return "=IF((B$8=\"\")+(" + d + "=0)" + S + "\"\"" + S + sumifs(m.n, from, to) + "/" + d + ")";
    }
    return "=IF(B$8=\"\"" + S + "\"\"" + S + sumifs(m.c, from, to) + ")";
  }

  var rules = [];
  var row = 9;
  metrics.forEach(function (m) {
    var fmt = m.k === "eur" ? EUR : m.k === "rate" ? PCT : INT;
    windows.forEach(function (w, wi) {
      var r = row++;
      t.getRange(r, 1).setValue(m.l + " · " + w[0])
        .setFontColor(wi === 0 ? "#000000" : "#888780")
        .setFontWeight(m.k === "rate" ? "normal" : "bold");
      t.getRange(r, 2).setFormula(val(m, w[1], w[2]));
      t.getRange(r, 2).copyTo(t.getRange(r, 3, 1, 11), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
      t.getRange(r, 2, 1, 12).setNumberFormat(fmt);
      rules.push(SpreadsheetApp.newConditionalFormatRule()
        .setGradientMinpoint("#F7C1C1").setGradientMaxpoint("#C0DD97")
        .setRanges([t.getRange(r, 2, 1, 12)]).build());
    });
    t.getRange(row, 1).setValue(""); // Trennzeile zwischen Kennzahl-Blöcken
    row++;
  });
  t.setConditionalFormatRules(rules);
  t.setHiddenGridlines(true);
  t.setColumnWidth(1, 165);
  t.setFrozenColumns(1);
  t.setFrozenRows(8);
}

// Tab „Cost-per-Step": Funnel mit Kosten je Stufe — drei Zeitfenster NEBENEINANDER
// (Gesamt · letzte 7 Tage · letzte 3 Tage). Endpunkt = Bestell-Klick
// („Jetzt zahlungspflichtig bestellen" = payment_submitted); die Stripe-Autorisierung
// danach ist bewusst nicht enthalten. Warenkorb ist in „selbst gewählt" (add_to_cart −
// Auto-WK) und „von uns" (Auto-WK / direct_cart, ?addtocart=) aufgeteilt. Nur Paid:
// die Rohdaten enthalten ausschließlich den fb/ig-Anzeigenaccount.
function buildCostPerStep_(ss, S, EUR, PCT) {
  var INT = "#,##0", CPM = '0.00" €/1k"';
  var t = freshSheet_(ss, "Cost-per-Step", 3);

  function colL(n) { var s = ""; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; }
  function sumifs(col, fromE, toE) {
    var dc = "Rohdaten!$A:$A";
    return "SUMIFS(Rohdaten!$" + col + ":$" + col + S + dc + S + '">="&' + fromE + S + dc + S + '"<="&' + toE + ")";
  }

  t.getRange("A1").setValue("💸 Cost-per-Step — Funnel & Kosten je Stufe (Gesamt · 7 Tage · 3 Tage)").setFontWeight("bold").setFontSize(14);
  t.getRange("A3").setValue("Von").setFontWeight("bold");
  t.getRange("B3").setFormula("=MIN(Rohdaten!$A$2:$A)").setNumberFormat("yyyy-mm-dd");
  t.getRange("A4").setValue("Bis").setFontWeight("bold");
  t.getRange("B4").setFormula("=MAX(Rohdaten!$A$2:$A)").setNumberFormat("yyyy-mm-dd");
  t.getRange("C3").setValue("◀ „Gesamt\" = Von/Bis frei wählbar; 7/3 Tage zählen ab „Bis\" zurück. Nur Paid — Rohdaten enthält nur den fb/ig-Anzeigenaccount.").setFontStyle("italic").setFontColor("#666666");

  // Drei Zeitfenster, je 3 Spalten: Anzahl · €/Step · →Quote. base = Spalte „Anzahl".
  var groups = [
    { title: "GESAMT (Von–Bis)", base: 2, from: "$B$3",   to: "$B$4" },
    { title: "Letzte 7 Tage",    base: 5, from: "$B$4-6", to: "$B$4" },
    { title: "Letzte 3 Tage",    base: 8, from: "$B$4-2", to: "$B$4" },
  ];

  // Funnel-Stufen. Rohdaten-Spalten: F=Impr G=Link-Klick N=Landung I=CTA R=Produktansicht
  //   J=Warenkorb(gesamt) U=Auto-WK(von uns) K=Kasse W=Kasse-seeded V=Bestell-Klick(inkl.retro)
  //   X=Bestell-Klick-seeded. selbst = gesamt − seeded (J−U, K−W, V−X).
  // „den" = Stufen-Index, gegen den die →Quote (Stufe ÷ Vorstufe) rechnet; der Cart-Split
  // wird kohorten-rein durchgezogen (selbst-Stufe ÷ selbst-Vorstufe, von-uns ÷ von-uns).
  var R0 = 9;
  var steps = [
    { l: "Impression",                    col: "F", cpm: true },
    { l: "Link-Klick",                    col: "G", den: 0 },
    { l: "Landung (Advertorial)",         col: "N", den: 1 },
    { l: "CTA → Shop",                    col: "I", den: 2 },
    { l: "Produktansicht",                col: "R", den: 3 },
    { l: "Warenkorb gesamt",              col: "J", den: 4 },
    { l: "   ╴ selbst gewählt",           sub: true, minus: ["J", "U"], den: 4 },
    { l: "   ╴ von uns (Auto-WK)",        sub: true, col: "U", seedEntry: true },
    { l: "Zur Kasse gesamt",              col: "K", den: 5 },
    { l: "   ╴ selbst",                   sub: true, minus: ["K", "W"], den: 6 },
    { l: "   ╴ von uns",                  sub: true, col: "W", den: 7 },
    { l: "Bestell-Klick (inkl. retro)",   col: "V", den: 8, endpoint: true },
    { l: "   ╴ selbst",                   sub: true, minus: ["V", "X"], den: 9, endpoint: true },
    { l: "   ╴ von uns",                  sub: true, col: "X", den: 10, endpoint: true },
  ];

  // Kopf je Zeitfenster (Zeile 6 Titel, 7 Spend, 8 Unterspalten).
  t.getRange("A6").setValue("Stufe ↓ / Zeitraum →").setFontWeight("bold");
  t.getRange("A8").setValue("Stufe").setFontWeight("bold");
  groups.forEach(function (g) {
    var c = g.base;
    t.getRange(6, c, 1, 3).merge().setValue(g.title).setFontWeight("bold").setFontColor("#15562d").setFontSize(12).setHorizontalAlignment("center");
    t.getRange(7, c, 1, 3).merge();
    t.getRange(7, c).setFormula("=\"Spend  \"&TEXT(" + sumifs("H", g.from, g.to) + S + "\"#,##0.00 €\")").setHorizontalAlignment("center").setFontColor("#555555");
    t.getRange(8, c).setValue("Anzahl").setFontWeight("bold").setHorizontalAlignment("right");
    t.getRange(8, c + 1).setValue("€/Step").setFontWeight("bold").setHorizontalAlignment("right");
    t.getRange(8, c + 2).setValue("→Quote").setFontWeight("bold").setHorizontalAlignment("right");
  });

  // Stufen-Zeilen je Zeitfenster.
  groups.forEach(function (g) {
    var c = g.base, cL = colL(c), spendF = sumifs("H", g.from, g.to);
    steps.forEach(function (s, i) {
      var r = R0 + i;
      if (c === 2) t.getRange(r, 1).setValue(s.l)
        .setFontColor(s.sub ? "#888780" : "#333333")
        .setFontWeight(s.endpoint && !s.sub ? "bold" : "normal");
      var anz = s.minus ? sumifs(s.minus[0], g.from, g.to) + "-" + sumifs(s.minus[1], g.from, g.to) : sumifs(s.col, g.from, g.to);
      var anzCell = cL + r;
      t.getRange(r, c).setFormula("=" + anz).setNumberFormat(INT);
      // €/Step nur auf den Gesamt-Stufen — bei Sub-Zeilen wäre Spend ÷ Teilmenge irreführend.
      if (!s.sub) {
        var costF = s.cpm
          ? "=IF(" + anzCell + "=0" + S + "\"\"" + S + spendF + "/" + anzCell + "*1000)"
          : "=IF(" + anzCell + "=0" + S + "\"\"" + S + spendF + "/" + anzCell + ")";
        t.getRange(r, c + 1).setFormula(costF).setNumberFormat(s.cpm ? CPM : EUR);
      }
      var q = t.getRange(r, c + 2);
      if (i === 0 || s.seedEntry) {
        q.setValue(s.seedEntry ? "geseedet" : "–").setFontColor(s.seedEntry ? "#9a7b0a" : "#999999")
          .setFontStyle(s.seedEntry ? "italic" : "normal").setHorizontalAlignment("right");
      } else {
        var den = cL + (R0 + s.den);
        q.setFormula("=IF(" + den + "=0" + S + "\"\"" + S + anzCell + "/" + den + ")").setNumberFormat(PCT);
      }
    });
  });

  // Durchstich-Quoten & Endkosten (referenzieren die Funnel-Zellen je Zeitfenster).
  var kr = R0 + steps.length + 1;
  t.getRange(kr, 1).setValue("Durchstich-Quoten & Endkosten — bestellen die geseedeten Körbe wirklich?").setFontWeight("bold");
  var rProd = R0 + 4, rWkSelf = R0 + 6, rWkSeed = R0 + 7, rOrdSelf = R0 + 12, rOrdSeed = R0 + 13, rEnd = R0 + 11;
  var kpis = [
    { l: "Bestell-Klick ÷ Produktansicht (gesamt)", num: rEnd,     den: rProd,   fmt: PCT },
    { l: "Warenkorb → Bestell-Klick · SELBST",      num: rOrdSelf, den: rWkSelf, fmt: PCT },
    { l: "Warenkorb → Bestell-Klick · VON UNS",     num: rOrdSeed, den: rWkSeed, fmt: PCT },
    { l: "CAC — Spend ÷ Bestell-Klick",             cac: true,                   fmt: EUR },
  ];
  kpis.forEach(function (k, j) {
    var r = kr + 1 + j;
    t.getRange(r, 1).setValue(k.l).setFontColor("#333333").setFontWeight(k.cac ? "bold" : "normal");
    groups.forEach(function (g) {
      var c = g.base, cL = colL(c);
      var f = k.cac
        ? "=IF(" + cL + rEnd + "=0" + S + "\"\"" + S + sumifs("H", g.from, g.to) + "/" + cL + rEnd + ")"
        : "=IF(" + cL + k.den + "=0" + S + "\"\"" + S + cL + k.num + "/" + cL + k.den + ")";
      t.getRange(r, c, 1, 3).merge();
      t.getRange(r, c).setFormula(f).setNumberFormat(k.fmt).setHorizontalAlignment("right").setFontWeight(k.cac ? "bold" : "normal");
    });
  });

  // Optik: Endpunkt grün, Sub-Zeilen abgesetzt, Blöcke gerahmt.
  t.setHiddenGridlines(true);
  var GREY = "#D3D1C7", SOLID = SpreadsheetApp.BorderStyle.SOLID, SAND = "#FAF7EE";
  [R0 + 6, R0 + 9, R0 + 12].forEach(function (rr) { t.getRange(rr, 1, 2, 10).setBackground(SAND); }); // selbst / von-uns
  t.getRange(rEnd, 1, 1, 10).setBackground("#E1F5EE"); // Endpunkt (Bestell-Klick gesamt)
  var lastRow = R0 + steps.length - 1;
  groups.forEach(function (g) { t.getRange(6, g.base, lastRow - 6 + 1, 3).setBorder(true, true, true, true, false, false, GREY, SOLID); });
  t.getRange(8, 1, 1, 10).setBorder(null, null, true, null, null, null, GREY, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  var noteRow = kr + kpis.length + 2;
  t.getRange(noteRow, 2, 5, 9).merge();
  t.getRange(noteRow, 2).setValue(
    "€/Step = Spend des Zeitfensters ÷ Anzahl auf der Stufe (Impression als CPM je 1.000), nur auf den Gesamt-Stufen. →Quote = Stufe ÷ Vorstufe; bei selbst/von-uns kohorten-rein (selbst ÷ selbst, von-uns ÷ von-uns). " +
    "„von uns\" = Auto-Warenkorb (?addtocart=, direct_cart) — von uns vorbefüllt; „selbst\" = Gesamt − von uns (gilt für Warenkorb, Kasse, Bestell-Klick). " +
    "Endpunkt = Bestell-Klick „Jetzt zahlungspflichtig bestellen\" INKL. RETRO: ab 18.06.2026 das explizite Event payment_submitted, davor aus PostHog-Autocapture rekonstruiert (Klick auf den Bestell-Button) — daher bis zum Launch durchgehend auswertbar. " +
    "Autocapture kann den Klick leicht überzählen (Mehrfachklicks), ist für den Zeitraum vor dem expliziten Tracking aber die beste verfügbare Rekonstruktion."
  ).setFontStyle("italic").setFontColor("#666666").setVerticalAlignment("top").setWrap(true);

  t.setColumnWidth(1, 235);
  [2, 5, 8].forEach(function (c) { t.setColumnWidth(c, 82); t.setColumnWidth(c + 1, 96); t.setColumnWidth(c + 2, 78); });
  t.setFrozenRows(8);
  t.setFrozenColumns(1);
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
