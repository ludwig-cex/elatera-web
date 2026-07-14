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
   - FAQ: 3–4 Fragen, die echte Suchintentionen beantworten
3. **Hero-Bild generieren** (Higgsfield GPT Image 2, 16:9, warme fotorealistische
   Senioren-Szene passend zum Thema, kein Text im Bild) → nach
   `public/ratgeber-img/<slug>.png`, im Artikel als `heroImage` setzen.
4. **Registrieren** in `src/lib/ratgeber.ts` (Import + SPOKES-Array).
5. **Prüfen**: `npx tsc --noEmit` sauber.
6. **Deploy**: Commit + `git push` (Vercel deployt auf legacy.nutra-sana.de).
7. **Verifizieren**: `https://legacy.nutra-sana.de/ratgeber/<slug>` → 200.
8. **IndexNow-Ping** (Key: `e41818661eb08a16903b2db77472ebc9`):
   POST https://api.indexnow.org/indexnow mit host `legacy.nutra-sana.de`,
   keyLocation `https://legacy.nutra-sana.de/e41818661eb08a16903b2db77472ebc9.txt`
   und der neuen URL.
9. Diese Datei aktualisieren (Backlog/Erledigt/Log).

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

## Erledigt

- [x] 14.07. gehirnjogging-ab-60 — „Gehirnjogging ab 60: 6 Übungen für jeden Tag" (+ Hero-Bild)
- [x] 14.07. gehirnjogging-aufgaben — „12 Aufgaben mit Lösungen" (+ Hero-Bild)
- [x] (Bestand) gehirnjogging-uebungen — rankender Ursprungs-Artikel (+ Hero-Bild nachgerüstet)

## Log

- 14.07.: Sprint-Setup: neues Artikel-Design (Navy-Brandmatch, Hero-Bilder,
  Support-Box mit 4,7/5 + 3.500 Kunden), IndexNow live, Bing verifiziert.
