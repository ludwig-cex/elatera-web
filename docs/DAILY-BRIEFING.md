# Tägliches Ads-Briefing (Meta × PostHog → Google Sheet + Telegram)

Automatisches Daily, das Meta-Auslieferung und den PostHog-On-Site-Funnel pro Ad
zusammenführt, in ein Google Sheet schreibt (Rohdaten + dynamisches Dashboard)
und ein Briefing mit Empfehlungen nach Telegram pusht.

## Funnel

| Stufe | Quelle |
|---|---|
| Ad Views | Meta `impressions` |
| Ad Clicks | Meta `inline_link_clicks` |
| LP CTA Click | PostHog `advertorial_cta_click` |
| In den Warenkorb | PostHog `add_to_cart` |
| Gekauft | PostHog `payment_authorized` (Stripe Auth-Hold) |

Join Meta↔PostHog über die Ad-ID + Datum. URL-codierte Dubletten werden
normalisiert, Legacy-Daten weiter über den Namen gematcht (s. UTM-Standard).

## Meta UTM-Standard (im „URL-Parameter"-Feld jeder Ad)

```
utm_content={{ad.name}}    ← Anzeige-Name im Dashboard/Briefing
utm_term={{ad.id}}         ← stabiler Join-Key (übersteht Umbenennungen)
```

`utm_source` / `utm_medium` / `utm_campaign` (LP-Variante) bleiben unverändert.
Der Join bevorzugt die stabile `utm_term`-ID und zeigt den `utm_content`-Namen an;
fällt für Altdaten ohne `utm_term` automatisch auf den Namen (bzw. eine in
`utm_content` stehende ID) zurück. So bricht nichts, wenn eine Ad umbenannt wird.

## Architektur

```
Vercel Cron (täglich 07:00 Berlin / 05:00 UTC)
  └─ GET /api/cron/daily-briefing   (Auth: Bearer CRON_SECRET)
       ├─ fetchMetaDays()      Graph API insights, level=ad, time_increment=1
       ├─ fetchFunnelDays()    PostHog HogQL, Funnel pro Tag pro Ad
       ├─ buildRawRows()       Join + Normalisierung
       ├─ pushRows()           POST → Apps Script → Tab "Rohdaten" (Upsert pro Datum)
       ├─ ruleSignals()        Empfehlungen (+ optional Claude-Narrativ)
       └─ notifyTelegram()     Briefing-Push
```

Code: `src/lib/briefing/*`, Route: `src/app/api/cron/daily-briefing/route.ts`,
Cron: `vercel.json`.

## Einrichtung

### 1) Google Sheet + Apps Script
1. Neues Google Sheet anlegen.
2. **Erweiterungen → Apps Script**, Inhalt von `scripts/apps-script/Code.gs` einfügen, speichern.
3. **Projekteinstellungen → Skripteigenschaften**: `SHEET_SECRET` = langer Zufallsstring.
4. **Bereitstellen → Neue Bereitstellung → Web-App**: *Ausführen als: Ich*, *Zugriff: Jeder*. `/exec`-URL kopieren.
5. Beim ersten POST legt das Skript automatisch die Tabs **Rohdaten** und **Dashboard** an.

### 2) Meta `ads_read`-Token
Der Cron liest die Graph API serverseitig — der MCP-Token gilt dort nicht.
- **Schnell (60 Tage):** Graph API Explorer → App wählen → Permission `ads_read` → Token generieren → mit dem [Access Token Tool](https://developers.facebook.com/tools/debug/accesstoken/) auf *long-lived* verlängern.
- **Dauerhaft (empfohlen):** Business Manager → *System Users* → Token mit `ads_read` für das Werbekonto `4534772073470536`.

### 3) Vercel Environment Variables
| Variable | Pflicht | Wert |
|---|---|---|
| `META_ADS_ACCESS_TOKEN` | ✅ | Token aus Schritt 2 |
| `META_AD_ACCOUNT_ID` | – | Default `4534772073470536` |
| `POSTHOG_PERSONAL_API_KEY` | ✅ | bereits gesetzt (lokal vorhanden) |
| `POSTHOG_PROJECT_ID` | – | Default `182794` |
| `CRON_SECRET` | ✅ | langer Zufallsstring (Cron-Auth) |
| `BRIEFING_SHEET_URL` | ✅ | `/exec`-URL aus Schritt 1.4 |
| `BRIEFING_SHEET_SECRET` | ✅ | == `SHEET_SECRET` |
| `BRIEFING_DASHBOARD_LINK` | – | Link zum Sheet (für Telegram) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | ✅ | bereits gesetzt |
| `ANTHROPIC_API_KEY` | – | aktiviert das Claude-Empfehlungs-Narrativ |

Ohne ein Pflicht-Env macht der jeweilige Schritt einen sauberen No-op (kein Crash).

## Betrieb

```bash
# Erste Befüllung / Historie seit Kampagnenstart (max. 90 Tage):
curl "https://<domain>/api/cron/daily-briefing?days=30" -H "Authorization: Bearer $CRON_SECRET"

# Trockenlauf (kein Telegram-Push, nur JSON inkl. Briefing-Preview):
curl "https://<domain>/api/cron/daily-briefing?dry=1" -H "Authorization: Bearer $CRON_SECRET"
```

Der tägliche Cron schreibt jeweils die letzten 7 Tage (Upsert pro Datum) und
briefed Gestern + 7-Tage-Aggregat. Backfill ist idempotent.

## Dashboard
Tab **Dashboard**: Zeitraum via `Von`/`Bis` (B3/B4) frei wählbar — Gesamt-Funnel,
Raten/Kosten und die Pro-Ad-Tabelle (QUERY) rechnen sich live neu.
Tab **Rohdaten**: 1 Zeile pro Tag × Ad, Quelle für eigene Pivots/Charts.

## Pipeline lokal testen
`npx tsx scripts/test-briefing.ts` — füttert echte Beispieldaten durch
Join → Aggregation → Empfehlungen → Telegram-Format (ohne Netzwerk/Push).
