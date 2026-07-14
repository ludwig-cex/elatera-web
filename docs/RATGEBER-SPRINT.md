# Ratgeber-Sprint (14.07.–28.07.2026)

Tägliche Content-Produktion für die KI-/Organik-Schiene (Bing/Copilot + Google).
Kontext: GSC zeigte erreichbare Nachfrage im Gehirnjogging-Cluster (Mentisana);
erster organischer Kauf kam am 14.07. über Microsoft Copilot.

## Produktions-Checkliste (pro Artikel)

1. **Thema** aus dem Backlog unten nehmen (oben = höchste Priorität), in „Erledigt" verschieben.
2. **Artikel schreiben** als Spoke in `src/content/ratgeber/spokes/<slug>.ts`:
   - Format: `Article`-Typ (`_types.ts`), Vorbild: `gehirnjogging-ab-60.ts`
   - Stil: Sie-Form, redaktionell-warm, KEINE Gedankenstriche, echter Nutzwert
     (konkrete Übungen/Aufgaben/Anleitungen, keine Textwüsten)
   - YMYL-Regeln: EFSA-konforme Nährstoff-Aussagen (Zink→kognitive Funktion,
     B6/B12→Nervensystem/Psyche, Magnesium→Nervensystem), NEM ≠ Arzneimittel,
     bei ernsten Beschwerden → ärztliches Gespräch
   - Der Produkt-Support kommt automatisch über die Support-Box der Artikelseite
     (productSlug korrekt setzen!), im Text selbst höchstens EIN dezenter Absatz
   - FAQ: 3–4 Fragen, die echte Suchintentionen beantworten (werden als
     Akkordeon gerendert; Fragen so formulieren, wie Menschen sie googeln/
     einer KI stellen würden, Antworten konkret in 2–4 Sätzen)
   - **Selbsttest** kommt automatisch pro Produktthema (self-tests.ts), nichts zu tun.
   - **Mitmach-Übungen**: wo das Thema es hergibt (Übungen/Aufgaben/Training)
     1–3 `exercises` setzen (Typen memory/quiz/reveal, siehe `_types.ts` und
     Beispiele in gehirnjogging-ab-60.ts). Interaktiv schlägt beschreibend.
   - **Interne Verlinkung (PFLICHT)**: `relatedSlugs` mit 2–3 verwandten
     Artikeln setzen ("Lesen Sie auch"-Karten). Bei bestehenden Artikeln des
     Clusters GEGENVERLINKEN (dort relatedSlugs ergänzen), damit ein echtes
     Netz entsteht statt Einbahnstraßen.
   - **keyFacts (PFLICHT, seit 14.07.)**: 3–5 Sätze "Das Wichtigste in Kürze"
     als `keyFacts`-Array. Jeder Satz für sich allein zitierfähig (das ist der
     Block, den Copilot/ChatGPT/Perplexity übernehmen), konkret mit Zahlen/
     Nährstoffnamen, EFSA-konform, keine Gedankenstriche.
   - **Answer-First (PFLICHT)**: Die ersten 1–2 Sätze unter jeder H2 geben die
     direkte, vollständige Antwort auf die Frage der Überschrift (40–60
     Wörter), Details danach. Kein Anteasern ("dazu später mehr"). LLM-Retrieval
     arbeitet passage-basiert; jeder Abschnitt muss ohne Kontext funktionieren.
   - **Bing-Exact-Match**: Das Ziel-Keyword wörtlich in Title, H1 und erstem
     Absatz (Bing gewichtet Exact-Match stärker als Google und füttert
     Copilot UND ChatGPT-Suche = unser nachweislich konvertierender Kanal).
   - **Zahlen + benannte Quellen**: Wo möglich quantifizieren (Mengen, Minuten,
     Referenzwerte) und Institutionen nennen (EFSA, DGE). Statistiken und
     Quellenangaben sind laut Princeton-GEO-Paper der stärkste einzelne
     Zitierhebel (+37–115 % AI-Sichtbarkeit).
   - **Quellen (`sources`, PFLICHT bei Guides, Soll bei Spokes)**: 3–5 Einträge,
     NUR selbst verifizierte URLs (curl 200 bzw. doi.org-Standard). Bewährt:
     EUR-Lex 432/2012, EU-Claims-Register, DGE-Referenzwerte, Fachgesellschaft
     des Themas (DGSM etc.), EFSA-Journal via doi.org. NIEMALS Links raten.
   - **Sektionsbilder (Guides)**: `image`/`imageAlt` pro Section möglich;
     bei Hub-Artikeln 2–3 Szenenbilder im Stil der Hero-Bilder ergänzen.
3. **Hero-Bild generieren** (Higgsfield GPT Image 2, 16:9, warme fotorealistische
   Senioren-Szene passend zum Thema, kein Text im Bild) → nach
   `public/ratgeber-img/<slug>.png`, im Artikel als `heroImage` setzen.
4. **Registrieren** in `src/lib/ratgeber.ts` (Import + SPOKES-Array).
5. **Prüfen**: `npx tsc --noEmit` sauber.
6. **Deploy**: Commit + `git push` (Vercel deployt auf legacy.nutra-sana.de).
7. **Verifizieren**: `https://ratgeber.nutra-sana.de/ratgeber/<slug>` → 200.
8. **IndexNow-Ping** (Key: `e41818661eb08a16903b2db77472ebc9`):
   POST https://api.indexnow.org/indexnow mit host `ratgeber.nutra-sana.de`,
   keyLocation `https://ratgeber.nutra-sana.de/e41818661eb08a16903b2db77472ebc9.txt`
   und der neuen URL.
9. **Bestands-Bebilderung**: Zusätzlich pro Lauf 2 ALTE Artikel ohne eigenes
   heroImage aussuchen (grep -L heroImage src/content/ratgeber/spokes/*.ts)
   und individuelle Hero-Bilder nachrüsten (gleicher Stil), damit die
   Übersicht keine doppelten Fallback-Bilder zeigt.
10. Diese Datei aktualisieren (Backlog/Erledigt/Log).

## GEO-Wissensstand (Recherche 14.07.2026)

Kurzfassung der Evidenz, damit wir Aufwand richtig priorisieren:

- **Stärkster Hebel:** Statistiken, Studienzitate und Quellenangaben IM TEXT
  (+37–115 % AI-Sichtbarkeit, Princeton-GEO-Paper arxiv 2311.09735). Schlägt
  jede technische Optimierung.
- **Schema ist KEIN Zitierhebel** (Ahrefs-Studie 2026: kein signifikanter
  Effekt; AI-Retrieval liest sichtbares HTML, nicht JSON-LD). Unser Setup
  (Article+MedicalWebPage, reviewedBy/lastReviewed, Person, FAQPage) ist
  ausreichend — kein weiteres Schema-Investment.
- **FAQPage-Rich-Results hat Google 05/2026 abgeschafft** — Markup bleibt
  trotzdem drin (Seitenverständnis), wichtig ist nur: FAQ-Antworten stehen
  sichtbar im DOM (unsere <details>-Akkordeons erfüllen das).
- **llms.txt: pflegen, nicht ausbauen** (97 % aller llms.txt bekommen null
  AI-Requests; nur Anthropic/Perplexity nutzen sie fallweise). Unsere ist
  seit 14.07. eine dynamische Route (src/app/llms.txt/route.ts) und
  aktualisiert sich selbst — nichts mehr zu tun. Kein llms-full.txt bauen.
- **Copilot = Bing-Index, ChatGPT-Suche ebenfalls.** Nicht in Bing indexiert
  heißt unsichtbar in beiden. IndexNow nach jedem Artikel ist Pflicht,
  Bing-WMT-Abdeckung regelmäßig prüfen.
- **Earned Media schlägt Owned Content** (92 % der AI-Overview-Zitate kommen
  von Drittseiten-Erwähnungen). Mittelfristig: Erwähnungen/Verlinkungen
  aufbauen (Gastbeiträge, Verzeichnisse, Fachpresse).
- **NetDoktor-Muster übernommen:** "Das Wichtigste in Kürze"-Box (keyFacts),
  sichtbare Autor/Prüf-Zeile, Autorenseite (/ratgeber/autor/jonas-guetermann),
  feste Artikelstruktur, aggressive interne Verlinkung.

## Keyword-Expansion (wöchentlicher Prozess, ab KW 30)

Ziel: systematisch neue Suchanfragen abgreifen und daraus Backlog erzeugen,
statt Themen zu raten.

1. **Query-Mining:** GSC + Bing WMT Performance-Report der Subdomain ziehen.
   Filter: hohe Impressionen + niedrige CTR bzw. Position 8–30 = validierte
   Nachfrage ohne passende Antwort.
2. **PAA-Baum:** Zur Kern-Query die People-Also-Ask-Fragen expandieren und
   den Fragenbaum notieren (Google + Bing).
3. **AI-Prompt-Mining:** Zielfragen direkt in Copilot/ChatGPT/Perplexity
   stellen; Folgefragen-Vorschläge und zitierte Konkurrenten dokumentieren.
   Zusätzlich LLM fragen: "Welche 30 Fragen stellen 65-Jährige zu <Thema>?"
4. **Clustern + Entscheiden:** Neue Fragen gegen bestehende Slugs abgleichen.
   Ein Intent-Cluster = ein neuer Spoke (primäre Frage als H1, verwandte als
   H2/FAQ). Einzelfragen ohne eigenes Volumen = FAQ-Ergänzung in bestehendem
   Artikel (dort auch keyFacts prüfen).
5. **Backlog aktualisieren** (unten) und Cluster-Hubs gegenverlinken.

## Kadenz

- 14.07.–21.07.: 2 Artikel/Tag (Cluster-Aufbau)
- 22.07.–28.07.: 1 Artikel/Tag (Erhaltung + neue Cluster anreißen)
- Nach dem 28.07.: Sprint endet, geplante Aufgabe löschen, Bilanz an Ludwig.

## Backlog (Priorität von oben)

- [ ] gehirnjogging-kostenlos — „Gehirnjogging kostenlos: 7 Übungen ganz ohne App und Abo" (Query-Umfeld: gehirnjogging kostenlos)
- [ ] gedaechtnistraining-senioren — „Gedächtnistraining für Senioren: Was wirklich hilft und was Zeitverschwendung ist"
- [ ] loci-methode — „Merkfähigkeit verbessern: Die Loci-Methode einfach erklärt (mit Übung)"
- [ ] wortfindungsstoerungen-ab-60 — „Wortfindungsstörungen ab 60: Was normal ist und wann Sie hinschauen sollten"
- [ ] gehirnjogging-zum-ausdrucken — „Gehirnjogging zum Ausdrucken: 10 Aufgabenblätter für jeden Tag" (ggf. PDF)
- [ ] konzentration-verbessern-alter — „Konzentration verbessern im Alter: 5 Hebel mit sofortiger Wirkung"
- [ ] gehirnjogging-zu-zweit — „Gehirnjogging zu zweit: 8 Spiele für Paare und Enkel"
- [ ] vergesslichkeit-normal — „Vergesslichkeit im Alter: Was normal ist und was nicht" (sensibel, YMYL!)
- [ ] schlaf-gedaechtnis — „Warum guter Schlaf das beste Gedächtnistraining ist" (Brücke zu Somnisana)
- [ ] spazieren-gehirn — „Spazierengehen als Gehirnjogging: Die unterschätzte Doppelwirkung"
- [ ] gehirnjogging-app-vergleich — „Gehirnjogging-Apps im Vergleich: Was taugen sie ab 60 wirklich?"
- [ ] zahlenraetsel-senioren — „Zahlenrätsel für Senioren: 15 Aufgaben von leicht bis knifflig"
- [ ] fingeruebungen-gehirn — „Fingerübungen fürs Gehirn: Feinmotorik als Gedächtnistraining"
- [ ] ernaehrung-konzentration — „Essen für den klaren Kopf: Der Wochenplan" (Abgrenzung zu ernaehrung-fuers-gehirn beachten!)
- [ ] RETROFIT Answer-First — Bestandsartikel schrittweise auf Answer-First-Absätze unter jeder H2 umschreiben (2 Artikel pro Sprint-Lauf mitziehen)
- [ ] RETROFIT Quellenverzeichnis — `sources` (seit 14.07. im Article-Typ, Komponente live) auf Bestandsartikel ausrollen; NUR verifizierte URLs (EUR-Lex 432/2012, EU-Claims-Register, DGE, DGSM, doi.org für EFSA-Journal); 2 Artikel pro Sprint-Lauf mitziehen
- [ ] META gelenke-guide — Hub für das Gelenk-Cluster nach dem Muster von gedaechtnis-guide/schlaf-guide (Kürze-Box, Answer-First, Sektionsbilder, Quellen, Wochenplan)

## Erledigt

- [x] 14.07. META schlaf-guide — „Besser schlafen ab 60: Der komplette Überblick" (Hub mit Sektionsbildern, Quellenverzeichnis, Wochenplan; Vorlage für weitere Guides)
- [x] 14.07. META gedaechtnis-guide — „Der große Gedächtnis-Guide ab 60" (Hub-Artikel, verlinkt alle 6 Gedächtnis-Artikel via relatedSlugs)
- [x] 14.07. gehirnjogging-ab-60 — „Gehirnjogging ab 60: 6 Übungen für jeden Tag" (+ Hero-Bild)
- [x] 14.07. gehirnjogging-aufgaben — „12 Aufgaben mit Lösungen" (+ Hero-Bild)
- [x] (Bestand) gehirnjogging-uebungen — rankender Ursprungs-Artikel (+ Hero-Bild nachgerüstet)

## Log

- 14.07.: Sprint-Setup: neues Artikel-Design (Navy-Brandmatch, Hero-Bilder,
  Support-Box mit 4,7/5 + 3.500 Kunden), IndexNow live, Bing verifiziert.
