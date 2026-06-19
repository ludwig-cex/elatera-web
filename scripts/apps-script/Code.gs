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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ["Dashboard", "Detail"].forEach(function (n) {
    var s = ss.getSheetByName(n);
    if (s) ss.deleteSheet(s);
  });
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
  var EUR = "0.00 €", PCT = "0.00%", XX = '0.00"×"';
  buildDetail_(ss, S, EUR, PCT, XX); // Datenquelle für ④ liegt auf eigenem Tab "Detail"

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
    ["CAC", div("B17", "E18"), EUR], ["ROAS", div("E19", "B17"), XX],
  ];
  score.forEach(function (s, i) {
    d.getRange(7, 1 + i).setValue(s[0]).setFontColor("#666666");
    d.getRange(8, 1 + i).setFormula(s[1]).setNumberFormat(s[2]).setFontSize(13).setFontWeight("bold");
  });

  // ===== ② ZWEI-WELTEN-FUNNEL =====
  d.getRange("A10").setValue("② Zwei-Welten-Funnel").setFontWeight("bold");
  d.getRange("A11").setValue("META — Lieferung (misst die Anzeige)").setFontWeight("bold").setFontColor("#185FA5");
  d.getRange("D11").setValue("POSTHOG — Website (misst die Seite)").setFontWeight("bold").setFontColor("#0F6E56");

  // Meta-Seite (Label A, Wert B) — nur Mengen; Raten stehen oben in der Scorecard.
  lbl("A12", "Impressions");           d.getRange("B12").setFormula(sumifs("F")).setNumberFormat("#,##0");
  lbl("A13", "Reach (Personen)");      d.getRange("B13").setFormula(sumifs("O")).setNumberFormat("#,##0");
  lbl("A14", "Alle Klicks");           d.getRange("B14").setFormula(sumifs("P")).setNumberFormat("#,##0");
  lbl("A15", "Link-Klicks");           d.getRange("B15").setFormula(sumifs("G")).setNumberFormat("#,##0");
  lbl("A16", "Angekommen — Meta-LPV"); d.getRange("B16").setFormula(sumifs("Q")).setNumberFormat("#,##0");
  lbl("A17", "Spend €");               d.getRange("B17").setFormula(sumifs("H")).setNumberFormat(EUR);

  // PostHog-Seite (Label D, Wert E)
  lbl("D12", "Angekommen — Landung");  d.getRange("E12").setFormula(sumifs("N")).setNumberFormat("#,##0");
  lbl("D13", "CTA → Shop");            d.getRange("E13").setFormula(sumifs("I")).setNumberFormat("#,##0");
  lbl("D14", "Produktansicht (Shop)"); d.getRange("E14").setFormula(sumifs("R")).setNumberFormat("#,##0");
  lbl("D15", "Warenkorb");             d.getRange("E15").setFormula(sumifs("J")).setNumberFormat("#,##0");
  lbl("D16", "Zur Kasse");             d.getRange("E16").setFormula(sumifs("K")).setNumberFormat("#,##0");
  lbl("D17", "Bestellt (zahlungspfl.)"); d.getRange("E17").setFormula(sumifs("L")).setNumberFormat("#,##0");
  lbl("D18", "Gekauft");               d.getRange("E18").setFormula(sumifs("M")).setNumberFormat("#,##0");
  lbl("D19", "Umsatz €");              d.getRange("E19").setFormula(sumifs("S")).setNumberFormat(EUR);
  note("A20", "Angekommen: Meta-LPV mit Pixel (eher zu niedrig) · PostHog-Landung pixel-less (eher zu hoch) — Differenz = Mess-Methode, kein Fehler.");

  // ===== ③ LEGENDE (einklappbar — [−]/[+] am linken Rand, Zeilen 23–27) =====
  d.getRange("A22").setValue("③ Legende").setFontWeight("bold");
  note("A23", "Link-Klick (Meta): Klick, der wirklich zur Seite führt (ohne Likes/Profil). Basis für CTR & CPC.");
  note("A24", "Meta-LPV: Metas eigene Zählung „Seite geladen\" — braucht Pixel, daher eher zu niedrig.");
  note("A25", "Landung: Person, die laut PostHog aufs Advertorial kam (fb/ig). Cookieless, daher eher zu hoch.");
  note("A26", "CTA: Klick vom Advertorial in den Shop.   ·   CAC = Spend ÷ Käufe   ·   ROAS = Umsatz ÷ Spend.");
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
    "CTA-Rate", "Produktansicht", "Produkt→WK", "Warenkörbe", "CAC €", "ROAS",
  ];
  cmpLabels.forEach(function (t, i) { d.getRange(31 + i, 1).setValue(t).setFontColor("#666666"); });
  // Kuratierte Auswahl aus dem Detail-Tab (Daten ab Zeile 2), nur Ads mit Spend > 2 €:
  //   Col1=Ad Col2=Spend Col16=Freq Col18=CTR Col19=CPC Col7=Landung
  //   Col22=CTA-Rate Col10=Produktansicht Col23=Produkt→WK Col11=Warenkorb Col25=CAC Col26=ROAS
  d.getRange("B30").setFormula(
    "=TRANSPOSE(QUERY(Detail!$A$2:$Z$120" + S +
    "\"select Col1,Col2,Col16,Col18,Col19,Col7,Col22,Col10,Col23,Col11,Col25,Col26 where Col1 is not null and Col2 > 2 order by Col2 desc\"" + S + "0))");
  d.getRange("B30:O30").setFontWeight("bold").setWrap(true); // Ad-Namen als Spaltenköpfe
  var cmpFmt = [EUR, XX, PCT, EUR, "#,##0", PCT, "#,##0", PCT, "#,##0", EUR, XX];
  cmpFmt.forEach(function (f, i) { d.getRange(31 + i, 2, 1, 14).setNumberFormat(f); });
  heatRow(33, true);   // CTR (Link)
  heatRow(34, false);  // CPC — niedriger = besser
  heatRow(36, true);   // CTA-Rate
  heatRow(38, true);   // Produkt→WK
  d.setConditionalFormatRules(rules);

  d.getRange("A43").setValue("Vollständige Tabelle (alle Ads, alle Kennzahlen): Tab „Detail" + String.fromCharCode(8221) + " unten.").setFontStyle("italic").setFontColor("#666666");
  d.setColumnWidth(1, 230);
  d.setColumnWidth(4, 180);
  d.setFrozenColumns(1);
}

// Eigener Tab „Detail": pro Ad eine Zeile, alle Kennzahlen — Datenquelle für den
// ④ Vergleich. Zeitraum kommt aus Dashboard!B3/B4.
function buildDetail_(ss, S, EUR, PCT, XX) {
  var existing = ss.getSheetByName("Detail");
  if (existing) ss.deleteSheet(existing);
  var t = ss.insertSheet("Detail");
  var sel = "select D, sum(H), sum(F), sum(O), sum(P), sum(G), sum(N), sum(Q), sum(I), sum(R), sum(J), sum(K), sum(L), sum(M), sum(S) ";
  var where = "where D is not null and toDate(A) >= date '\"&TEXT(Dashboard!$B$3" + S + "\"yyyy-mm-dd\")&\"' and toDate(A) <= date '\"&TEXT(Dashboard!$B$4" + S + "\"yyyy-mm-dd\")&\"' ";
  var tail = "group by D order by sum(H) desc label D 'Ad', sum(H) 'Spend €', sum(F) 'Impr', sum(O) 'Reach', sum(P) 'Alle Klk', sum(G) 'Link-Klk', sum(N) 'Landung', sum(Q) 'Meta-LPV', sum(I) 'CTA', sum(R) 'Produktans.', sum(J) 'Warenkorb', sum(K) 'Kasse', sum(L) 'Bestellt', sum(M) 'Gekauft', sum(S) 'Umsatz €'";
  t.getRange("A1").setFormula("=QUERY(Rohdaten!$A:$S" + S + "\"" + sel + where + tail + "\"" + S + "1)");
  // Header Zeile 1, Daten ab 2. A=Ad B=Spend C=Impr D=Reach E=AlleKlk F=LinkKlk
  //   G=Landung H=LPV I=CTA J=Prod K=WK L=Kasse M=Bestellt N=Kauf O=Umsatz
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
    ["CAC €", "$B$2:$B", "$N$2:$N", "", EUR],
    ["ROAS", "$O$2:$O", "$B$2:$B", "", XX],
  ];
  var rules = [];
  derived.forEach(function (c, i) {
    var ci = 16 + i; // P..
    t.getRange(1, ci).setValue(c[0]).setFontWeight("bold");
    t.getRange(2, ci).setFormula(ratio(c[1], c[2], c[3]));
    t.getRange(2, ci, 3000, 1).setNumberFormat(c[4]);
  });
  ["R", "T", "V", "W"].forEach(function (col) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpoint("#F7C1C1").setGradientMaxpoint("#C0DD97")
      .setRanges([t.getRange(col + "2:" + col + "3000")]).build());
  });
  t.setConditionalFormatRules(rules);
  t.getRange(1, 1, 1, 26).setFontWeight("bold");
  t.setColumnWidth(1, 230);
  t.setFrozenRows(1);
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
