import React, { useState, useEffect, useCallback } from 'react';

// Hilfsfunktion zur Berechnung der Tage zwischen zwei Daten
const daysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    // Setze die Uhrzeit auf Mitternacht, um nur die Tage zu vergleichen
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Hilfsfunktion zur Formatierung eines Datums als YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Hauptkomponente der Anwendung
const App = () => {
    // Zustand für die Aufgabenkarten (Definitionen)
    const [tasks, setTasks] = useState([]);
    // Zustand für den Abschlussstatus der Aufgaben (persistiert)
    const [taskCompletionStatus, setTaskCompletionStatus] = useState({});
    // Zustand für den Filter (alle Aufgaben oder fällige Aufgaben)
    const [filterType, setFilterType] = useState('all'); // 'all' oder 'due'

    // Effekt, der einmal beim Laden der Komponente ausgeführt wird, um die Aufgabenkarten zu parsen
    useEffect(() => {
        // Der Markdown-Inhalt der Aufgabenkarten
        const markdownContent = `
**Haushalts- und Verwaltungsaufgaben-Karten**

### 1. Küche Daily Business

**Beschreibung:** Spülmaschine ein- und ausräumen, Arbeitsflächen abwischen, von Hand abspülen (was nicht in die Spülmaschine passt).
**Punkte pro Ausführung:** 52.5
**Gesamtpunkte (pro 3x/Woche):** 157.5
**Berechnung:** $(20 + 1*5 + 1*10) * 1.5 = 52.5$
$52.5 * 3 \\text{ (3x/Woche)} = 157.5$

### 2. Müll rausbringen (Tonnen)

**Beschreibung:** Restmüll, Biomüll, gelber Sack und Papiermüll aus dem Haus in die jeweiligen großen Tonnen bringen.
**Punkte pro Ausführung:** 67.5
**Gesamtpunkte (pro Alle 1-2 Wochen):** 50.625
**Berechnung:** $(10 + 3*5 + 2*10) * 1.5 = 67.5$
$67.5 * 0.75 \\text{ (Alle 1-2 Wochen)} = 50.625$

### 3. Backofen reinigen

**Beschreibung:** Backofen innen gründlich reinigen.
**Punkte pro Ausführung:** 85
**Gesamtpunkte (pro Quartalsweise):** 8.5
**Berechnung:** $(60 + 3*5 + 1*10) * 1 = 85$
$85 * 0.1 \\text{ (Quartalsweise)} = 8.5$

### 4. Kühlschrank putzen

**Beschreibung:** Kühlschrank ausräumen, auswischen, Lebensmittel überprüfen (abgelaufene entsorgen).
**Punkte pro Ausführung:** 120
**Gesamtpunkte (pro Quartalsweise):** 12
**Berechnung:** $(60 + 2*5 + 1*10) * 1.5 = 120$
$120 * 0.1 \\text{ (Quartalsweise)} = 12$

### 5. Küchenboden wischen

**Beschreibung:** Küchenboden gründlich wischen.
**Punkte pro Ausführung:** 30
**Gesamtpunkte (pro Monatlich):** 7.5
**Berechnung:** $(15 + 1*5 + 1*10) * 1 = 30$
$30 * 0.25 \\text{ (Monatlich)} = 7.5$

### 6. Altglas sortieren & wegbringen

**Beschreibung:** Gesammeltes Altglas nach Farben sortieren und zum Container bringen.
**Punkte pro Ausführung:** 40
**Gesamtpunkte (pro Monatlich):** 10
**Berechnung:** $(15 + 1*5 + 2*10) * 1 = 40$
$40 * 0.25 \\text{ (Monatlich)} = 10$

### 7. Küchenschränke ausmisten & wischen

**Beschreibung:** Küchenschränke ausräumen, aussortieren (abgelaufene Dinge), auswischen und wieder einräumen.
**Punkte pro Ausführung:** 270
**Gesamtpunkte (pro Jährlich):** 8.1
**Berechnung:** $(240 + 2*5 + 2*10) * 1 = 270$
$270 * 0.03 \\text{ (Jährlich)} = 8.1$

### 8. Toiletten reinigen (beide Bäder)

**Beschreibung:** Toiletten in beiden Bädern innen und außen gründlich reinigen, Brillen abwischen.
**Punkte pro Ausführung:** 40
**Gesamtpunkte (pro Wöchentlich):** 40
**Berechnung:** $(10 + 4*5 + 1*10) * 1 = 40$
$40 * 1 \\text{ (Wöchentlich)} = 40$

### 9. Waschbecken & Badewanne reinigen (beide Bäder)

**Beschreibung:** Waschbecken und Armaturen in beiden Bädern reinigen. Badewanne und Duschbereich gründlich reinigen.
**Punkte pro Ausführung:** 40
**Gesamtpunkte (pro Wöchentlich):** 40
**Berechnung:** $(20 + 2*5 + 1*10) * 1 = 40$
$40 * 1 \\text{ (Wöchentlich)} = 40$

### 10. Bad Deepclean

**Beschreibung:** Alle Spiegel putzen (beide Bäder, inkl. Spiegelschranktüren), Ablagen an der Badewanne reinigen, Fliesen in beiden Bädern mit Reiniger und Bürste schrubben, Seifenspender reinigen, Mülleimer leeren, ggf. Wand mit Schimmelspray behandeln.
**Punkte pro Ausführung:** 95
**Gesamtpunkte (pro Monatlich):** 23.75
**Berechnung:** $(60 + 3*5 + 2*10) * 1 = 95$
$95 * 0.25 \\text{ (Monatlich)} = 23.75$

### 11. Badvorleger waschen

**Beschreibung:** Badvorleger schütteln, in die Waschmaschine geben, aufhängen/trocknen, und zurück ins Bad legen.
**Punkte pro Ausführung:** 55
**Gesamtpunkte (pro Monatlich):** 13.75
**Berechnung:** $(10 + 1*5 + 4*10) * 1 = 55$
$55 * 0.25 \\text{ (Monatlich)} = 13.75$

### 12. Böden wischen (beide Bäder)

**Beschreibung:** Böden in beiden Bädern wischen.
**Punkte pro Ausführung:** 35
**Gesamtpunkte (pro Monatlich):** 8.75
**Berechnung:** $(15 + 2*5 + 1*10) * 1 = 35$
$35 * 0.25 \\text{ (Monatlich)} = 8.75$

### 13. Badwände reinigen & ggf. streichen

**Beschreibung:** Nicht geflieste Wände in beiden Bädern reinigen und bei Bedarf mit Schimmelfarbe nachstreichen.
**Punkte pro Ausführung:** 145
**Gesamtpunkte (pro 2x/Jahr):** 8.7
**Berechnung:** $(120 + 1*5 + 2*10) * 1 = 145$
$145 * 0.06 \\text{ (2x/Jahr)} = 8.7$

### 14. Spiegelschrank aufräumen & putzen

**Beschreibung:** Inhalt des Spiegelschranks ausräumen, sortieren, Schrank innen und außen putzen, wieder einräumen.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Quartalsweise):** 8
**Berechnung:** $(60 + 2*5 + 1*10) * 1 = 80$
$80 * 0.1 \\text{ (Quartalsweise)} = 8$

### 15. Abfluss reinigen (beide Bäder)

**Beschreibung:** Abflüsse in beiden Bädern von Haaren und Seifenresten befreien (z.B. mit Abflussreiniger oder Spirale).
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Alle 2 Wochen):** 22.5
**Berechnung:** $(10 + 3*5 + 2*10) * 1 = 45$
$45 * 0.5 \\text{ (Alle 2 Wochen)} = 22.5$

### 16. Hund Füttern & Sauber machen (Einzeln)

**Beschreibung:** Gefrorenes Futter holen und auftauen lassen (Planungs-Mental-Load), Napf rausstellen. Hund nach dem Fressen reinholen und bei Bedarf säubern (Sommer ca. 5 Min., Winter ca. 10 Min. für Säubern, im Schnitt 7.5 Min).
**Punkte pro Ausführung:** 63.75
**Gesamtpunkte (pro Ausführung):** 63.75
**Berechnung:** $(7.5 + 1*5 + 3*10) * 1.5 = 63.75$

### 17. Hund Rein-/Rauslassen (Pro Tag)

**Beschreibung:** Hund 5 Mal zusätzlich zu den Fütterungen in den Garten lassen und wieder reinholen. Bei Bedarf säubern (Sommer < 2 Min., Winter ca. 5 Min., im Schnitt 3.5 Min pro Runde).
**Punkte pro Ausführung:** 56.25
**Gesamtpunkte (pro Tag):** 56.25
**Berechnung:** $(17.5 + 1*5 + 1.5*10) * 1.5 = 56.25$

### 18. Hundefutter kaufen & verräumen

**Beschreibung:** Neues Hundefutter zum Fressnapf fahren (mit Kühltaschen), kaufen und in die Gefriertruhe im Keller packen. Zeitfenster beachten (nicht zu früh/spät, ca. 4 Tage).
**Punkte pro Ausführung:** 135
**Gesamtpunkte (pro Alle 20 Tage):** 47.25
**Berechnung:** $(45 + 1*5 + 4*10) * 1.5 = 135$
$135 * 0.35 \\text{ (Alle 20 Tage)} = 47.25$

### 19. Krallen schneiden & feilen

**Beschreibung:** Hundekrallen clippen und feilen.
**Punkte pro Ausführung:** 100
**Gesamtpunkte (pro Monatlich):** 25
**Berechnung:** $(60 + 4*5 + 2*10) * 1 = 100$
$100 * 0.25 \\text{ (Monatlich)} = 25$

### 20. Jährliche Impfung & Tierarztbesuch

**Beschreibung:** Termin beim Tierarzt machen (10 Min). Mit Hund hinfahren und zurück (1.5 - 2 Stunden = 105 Min.), Impfung und Check-up. Ggf. Urlaub/Gleitzeit nehmen.
**Punkte pro Ausführung:** 495
**Gesamtpunkte (pro Jährlich):** 14.85
**Berechnung:** $(115 + 2*5 + 4*10) * 3 = 495$
$495 * 0.03 \\text{ (Jährlich)} = 14.85$

### 21. Wurmkur geben

**Beschreibung:** Wurmkur beim Tierarzt abholen (30 Min. mit Fahrt). Zum sinnvollen Zeitpunkt geben.
**Punkte pro Ausführung:** 97.5
**Gesamtpunkte (pro 4x/Jahr):** 5.85
**Berechnung:** $(30 + 1*5 + 3*10) * 1.5 = 97.5$
$97.5 * 0.06 \\text{ (4x/Jahr)} = 5.85$

### 22. Zeckentabletten geben

**Beschreibung:** Zeckentabletten vom Tierarzt besorgen (kann mit Wurmkur-Abholung kombiniert werden). An extra Zeitpunkt geben (nicht mit Wurmkur).
**Punkte pro Ausführung:** 60
**Gesamtpunkte (pro 4x/Jahr):** 3.6
**Berechnung:** $(5 + 1*5 + 3*10) * 1.5 = 60$
$60 * 0.06 \\text{ (4x/Jahr)} = 3.6$

### 23. Hund waschen

**Beschreibung:** Hund baden/waschen.
**Punkte pro Ausführung:** 60
**Gesamtpunkte (pro 2x/Jahr):** 7.2
**Berechnung:** $(30 + 2*5 + 2*10) * 2 = 60$
$60 * 0.06 \\text{ (2x/Jahr)} = 7.2$

### 24. Hundebetreuung bei Abwesenheit organisieren

**Beschreibung:** Hundesachen packen (10 Min.), Futter vorbereiten (30 Min.), Hund hinfahren (1 Std.) und abholen (1 Std.), Sachen verräumen (10 Min.). Koordination mit Betreuer (Paddy).
**Punkte pro Ausführung:** 645
**Gesamtpunkte (pro Nach Bedarf):** 29.025
**Berechnung:** $(170 + 1*5 + 4*10) * 3 = 645$
$645 * 0.045 \\text{ (Nach Bedarf)} = 29.025$

### 25. Hundenäpfe reinigen (Deepclean)

**Beschreibung:** Näpfe einweichen, schrubben und abspülen.
**Punkte pro Ausführung:** 40
**Gesamtpunkte (pro Monatlich):** 10
**Berechnung:** $(15 + 3*5 + 1*10) * 1 = 40$
$40 * 0.25 \\text{ (Monatlich)} = 10$

### 26. Hundekisten & Decken sortieren/reinigen

**Beschreibung:** Hundekisten im Schlafzimmer ausräumen, sortieren (Sommer/Winter), putzen und einräumen. Hundedecken reinigen.
**Punkte pro Ausführung:** 195
**Gesamtpunkte (pro 2x/Jahr):** 11.7
**Berechnung:** $(90 + 2*5 + 3*10) * 1.5 = 195$
$195 * 0.06 \\text{ (2x/Jahr)} = 11.7$

### 27. Standard-Wäsche (30°C)

**Beschreibung:** 30°C-Wäsche sortieren, Maschine beladen, starten und in den Waschtrockner geben. Patric über den Inhalt informieren.
**Punkte pro Ausführung:** 30
**Gesamtpunkte (pro Wöchentlich):** 30
**Berechnung:** $(5 + 1*5 + 1*10) * 1.5 = 30$
$30 * 1 \\text{ (Wöchentlich)} = 30$

### 28. Standard-Wäsche (Unterwäsche)

**Beschreibung:** Unterwäsche sortieren, Maschine beladen, starten und in den Waschtrockner geben. Patric über den Inhalt informieren.
**Punkte pro Ausführung:** 30
**Gesamtpunkte (pro Wöchentlich):** 30
**Berechnung:** $(5 + 1*5 + 1*10) * 1.5 = 30$
$30 * 1 \\text{ (Wöchentlich)} = 30$

### 29. Standard-Wäsche (Handtücher/Bettzeug)

**Beschreibung:** Handtücher/Bettzeug sortieren, Maschine beladen, starten und nach dem Waschen aufhängen. Patric über den Inhalt informieren.
**Punkte pro Ausführung:** 100
**Gesamtpunkte (pro Wöchentlich):** 100
**Berechnung:** $(10 + 2*5 + 3*10) * 2 = 100$
$100 * 1 \\text{ (Wöchentlich)} = 100$

### 30. Mt. Wäscherest & Spezialwäsche

**Beschreibung:** Den Mt. Wäscherest sortieren, Wäsche überall einsammeln (10 Min). Daraus eine extra Waschmaschine (z.B. Wolle, Sportsachen, Feinwäsche) waschen. Diese Wäschestücke rechtzeitig rausholen, aufhängen und wieder abhängen (20 Min). Patric über den Inhalt informieren.
**Punkte pro Ausführung:** 140
**Gesamtpunkte (pro Wöchentlich):** 140
**Berechnung:** $(30 + 2*5 + 3*10) * 2 = 140$
$140 * 1 \\text{ (Wöchentlich)} = 140$

### 31. Wäsche zusammenlegen & wegräumen (gesamte Wochenwäsche)

**Beschreibung:** Die gesamte gewaschene und getrocknete Wäsche der Woche zusammenlegen und in die jeweiligen Schränke/Schubladen räumen.
**Punkte pro Ausführung:** 65
**Gesamtpunkte (pro Wöchentlich):** 65
**Berechnung:** $(40 + 1*5 + 2*10) * 1 = 65$
$65 * 1 \\text{ (Wöchentlich)} = 65$

### 32. Bettwäsche wechseln (Gästezimmer)

**Beschreibung:** Bettwäsche im Gästezimmer abziehen, waschen, trocknen, neu beziehen. (Ggf. Aufhängen im Sommer)
**Punkte pro Ausführung:** 97.5
**Gesamtpunkte (pro Monatlich):** 24.375
**Berechnung:** $(30 + 2*5 + 2.5*10) * 1.5 = 97.5$
$97.5 * 0.25 \\text{ (Monatlich)} = 24.375$

### 33. Bettwäsche wechseln (Schlafzimmer)

**Beschreibung:** Bettwäsche im Schlafzimmer abziehen, waschen, trocknen, neu beziehen. (Ggf. Aufhängen im Sommer)
**Punkte pro Ausführung:** 97.5
**Gesamtpunkte (pro Alle 2 Wochen):** 48.75
**Berechnung:** $(30 + 2*5 + 2.5*10) * 1.5 = 97.5$
$97.5 * 0.5 \\text{ (Alle 2 Wochen)} = 48.75$

### 34. Winterkleidung waschen (Oodies)

**Beschreibung:** Oodies waschen und zum Trocknen aufhängen/legen.
**Punkte pro Ausführung:** 190
**Gesamtpunkte (pro Jährlich):** 5.7
**Berechnung:** $(60 + 1*5 + 3*10) * 2 = 190$
$190 * 0.03 \\text{ (Jährlich)} = 5.7$

### 35. Winterkleidung waschen & imprägnieren (Jacken)

**Beschreibung:** Winterjacken waschen, aufhängen/trocknen und imprägnieren.
**Punkte pro Ausführung:** 280
**Gesamtpunkte (pro Jährlich):** 8.4
**Berechnung:** $(90 + 2*5 + 4*10) * 2 = 280$
$280 * 0.03 \\text{ (Jährlich)} = 8.4$

### 36. Wintersachen wegräumen (Vakuumieren)

**Beschreibung:** Alle gewaschenen und getrockneten Wintersachen (Oodies, Jacken, Pullover etc.) vakuumieren und wegräumen.
**Punkte pro Ausführung:** 202.5
**Gesamtpunkte (pro Jährlich):** 6.075
**Berechnung:** $(90 + 3*5 + 3*10) * 1.5 = 202.5$
$202.5 * 0.03 \\text{ (Jährlich)} = 6.075$

### 37. Kinderkleidung managen (laufend)

**Beschreibung:** Laufend überprüfen, welche Kleidung den Kindern noch passt und was sie gerne anziehen, während sie zu Hause sind.
**Punkte pro Ausführung:** 55
**Gesamtpunkte (pro 12 Wochen/Jahr):** 12.65
**Berechnung:** $(10 + 1*5 + 4*10) * 1 = 55$
$55 * 0.23 \\text{ (12 Wochen/Jahr)} = 12.65$

### 38. Kinderkleidung Saisonwechsel (Planung & Einkauf)

**Beschreibung:** Vor Winter/Sommer umfassend überprüfen, ob genug passende Kleidung vorhanden ist ("Modeschau"). Fehlende Kleidung planen und einkaufen (Second Hand / Online).
**Punkte pro Ausführung:** 690
**Gesamtpunkte (pro 2x/Jahr):** 41.4
**Berechnung:** $(180 + 2*5 + 4*10) * 3 = 690$
$690 * 0.06 \\text{ (2x/Jahr)} = 41.4$

### 39. Wöchentlicher Kleinst-Einkauf

**Beschreibung:** Nach der Therapie einkaufen gehen (z.B. Toast) und mitbringen, was auf der Einkaufsliste steht (z.B. Duschgel, wenn es leer ist).
**Punkte pro Ausführung:** 67.5
**Gesamtpunkte (pro Wöchentlich):** 67.5
**Berechnung:** $(30 + 1*5 + 1*10) * 1.5 = 67.5$
$67.5 * 1 \\text{ (Wöchentlich)} = 67.5$

### 40. Großeinkauf Ferien-Vorbereitung: Essensplanung

**Beschreibung:** Planen, was die Familie (mit Kindern) in den Ferien essen möchte und wann. Erstellen einer detaillierten Einkaufsliste dafür.
**Punkte pro Ausführung:** 142.5
**Gesamtpunkte (pro Monatlich):** 35.625
**Berechnung:** $(60 + 1*5 + 3*10) * 1.5 = 142.5$
$142.5 * 0.25 \\text{ (Monatlich)} = 35.625$

### 41. Großeinkauf Ferien-Vorbereitung: Vorräte prüfen

**Beschreibung:** Vorräte (Küche, Bad/Drogerie) überprüfen, um sicherzustellen, dass für die Ferien genügend vorhanden ist und nichts unnötig gekauft wird.
**Punkte pro Ausführung:** 82.5
**Gesamtpunkte (pro Monatlich):** 20.625
**Berechnung:** $(30 + 1*5 + 2*10) * 1.5 = 82.5$
$82.5 * 0.25 \\text{ (Monatlich)} = 20.625$

### 42. Großeinkauf mit Verräumen

**Beschreibung:** Den großen Lebensmitteleinkauf für die Ferien erledigen und die Einkäufe anschließend verräumen. Dabei auch Drogerieprodukte auf Vorrat kaufen.
**Punkte pro Ausführung:** 262.5
**Gesamtpunkte (pro Monatlich):** 65.625
**Berechnung:** $(150 + 1*5 + 2*10) * 1.5 = 262.5$
$262.5 * 0.25 \\text{ (Monatlich)} = 65.625$

### 43. Schlafzimmer: Eigener Kram auf Patrics Schreibtisch wegräumen

**Beschreibung:** Eigene gesammelte Sachen, die sich auf Patrics Schreibtisch angesammelt haben, wegräumen und verräumen.
**Punkte pro Ausführung:** 50
**Gesamtpunkte (pro Wöchentlich):** 50
**Berechnung:** $(10 + 1*5 + 1*10) * 2 = 50$
$50 * 1 \\text{ (Wöchentlich)} = 50$

### 44. Schlafzimmer: Kleiderschrank sortieren

**Beschreibung:** Kleiderschrank (eigene Seite) ausmisten, sortieren (ggf. saisonal), zusammenlegen.
**Punkte pro Ausführung:** 217.5
**Gesamtpunkte (pro 2x/Jahr):** 13.05
**Berechnung:** $(120 + 1*5 + 2*10) * 1.5 = 217.5$
$217.5 * 0.06 \\text{ (2x/Jahr)} = 13.05$

### 45. Schlafzimmer: Kallax-Fachtisch aufräumen

**Beschreibung:** Das als Nachttisch genutzte Fach im Kallax-Regal einmal in der Woche aufräumen und säubern.
**Punkte pro Ausführung:** 25
**Gesamtpunkte (pro Wöchentlich):** 25
**Berechnung:** $(10 + 1*5 + 1*10) * 1 = 25$
$25 * 1 \\text{ (Wöchentlich)} = 25$

### 46. Schlafzimmer: Kallax-Nachbarfach aufräumen

**Beschreibung:** Das Fach neben dem Fachtisch im Kallax-Regal aufräumen und säubern.
**Punkte pro Ausführung:** 35
**Gesamtpunkte (pro Monatlich):** 8.75
**Berechnung:** $(20 + 1*5 + 1*10) * 1 = 35$
$35 * 0.25 \\text{ (Monatlich)} = 8.75$

### 47. Schlafzimmer: Kallax-Regal (Rest) aufräumen

**Beschreibung:** Die restlichen Fächer des großen Kallax-Regals gründlich aufräumen und säubern.
**Punkte pro Ausführung:** 115
**Gesamtpunkte (pro Quartalsweise):** 11.5
**Berechnung:** $(90 + 1*5 + 2*10) * 1 = 115$
$115 * 0.1 \\text{ (Quartalsweise)} = 11.5$

### 48. Schlafzimmer: Deepclean (Unter Bett etc.)

**Beschreibung:** Unter dem Bett alles raussammeln, putzen, Staubwischen (nicht-Kallax-Regale, Nachttische), Spinnweben entfernen.
**Punkte pro Ausführung:** 85
**Gesamtpunkte (pro Quartalsweise):** 8.5
**Berechnung:** $(60 + 1*5 + 2*10) * 1 = 85$
$85 * 0.1 \\text{ (Quartalsweise)} = 8.5$

### 49. Schlafzimmer: Unausgepackte Taschen/Boxen aufräumen

**Beschreibung:** Eine im Schlafzimmer stehende, noch nicht ausgepackte/sortierte Tasche oder Box pro Woche ausräumen und verräumen.
**Punkte pro Ausführung:** 70
**Gesamtpunkte (pro Wöchentlich):** 70
**Berechnung:** $(30 + 2*5 + 3*10) * 1 = 70$
$70 * 1 \\text{ (Wöchentlich)} = 70$

### 50. Große Spiegel & Glastüren putzen

**Beschreibung:** Große Spiegelschranktüren (Schlafzimmer, Gästezimmer) und alle Glastüren (z.B. Gästezimmer) gründlich putzen. Leiter benutzen.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Jährlich):** 2.4
**Berechnung:** $(60 + 2*5 + 1*10) * 1 = 80$
$80 * 0.03 \\text{ (Jährlich)} = 2.4$

### 51. Wohnzimmertisch aufräumen & putzen

**Beschreibung:** Wohnzimmertisch von angesammelten Gegenständen befreien und abwischen.
**Punkte pro Ausführung:** 37.5
**Gesamtpunkte (pro 3x/Woche):** 112.5
**Berechnung:** $(10 + 1*5 + 1*10) * 1.5 = 37.5$
$37.5 * 3 \\text{ (3x/Woche)} = 112.5$

### 52. Wohnzimmer/Flur: Ablagen & Boden-Krimskrams aufräumen

**Beschreibung:** Ablagen auf Regalbrettern und dem Schreibtisch (Wohnzimmer) aufräumen. Sämtliches Zeug, das sich auf dem Boden ansammelt (Taschen, Krimskrams im Flur), wegräumen.
**Punkte pro Ausführung:** 115
**Gesamtpunkte (pro Monatlich):** 28.75
**Berechnung:** $(90 + 1*5 + 2*10) * 1 = 115$
$115 * 0.25 \\text{ (Monatlich)} = 28.75$

### 53. Wohnzimmer Deepclean

**Beschreibung:** Regale gründlich aufräumen, Staubwischen, Spinnweben entfernen. Sofadecken waschen (Waschkarte verwenden). Sofa gründlich absaugen.
**Punkte pro Ausführung:** 85
**Gesamtpunkte (pro Quartalsweise):** 8.5
**Berechnung:** $(60 + 1*5 + 2*10) * 1 = 85$
$85 * 0.1 \\text{ (Quartalsweise)} = 8.5$

### 54. Flur: Staub, Spinnweben, Schuhschrank, Jacken

**Beschreibung:** Staubwischen und Spinnweben entfernen im Flur. Schuhschrank sortieren und saugen. Jacken richtig aufhängen.
**Punkte pro Ausführung:** 85
**Gesamtpunkte (pro Quartalsweise):** 8.5
**Berechnung:** $(60 + 1*5 + 2*10) * 1 = 85$
$85 * 0.1 \\text{ (Quartalsweise)} = 8.5$

### 55. Gästezimmer: Kruschd wegräumen

**Beschreibung:** Jede Woche herumliegenden "Kruschd" im Gästezimmer wegräumen.
**Punkte pro Ausführung:** 25
**Gesamtpunkte (pro Wöchentlich):** 25
**Berechnung:** $(10 + 1*5 + 1*10) * 1 = 25$
$25 * 1 \\text{ (Wöchentlich)} = 25$

### 56. Gästezimmer: Kleiderschrank Kinder sortieren

**Beschreibung:** Kleiderschrank der Kinder im Gästezimmer sortieren.
**Punkte pro Ausführung:** 85
**Gesamtpunkte (pro Quartalsweise):** 8.5
**Berechnung:** $(60 + 1*5 + 2*10) * 1 = 85$
$85 * 0.1 \\text{ (Quartalsweise)} = 8.5$

### 57. Gästezimmer: Auf Schränken aufräumen & putzen

**Beschreibung:** Auf Schränken im Gästezimmer (Ablagen) aufräumen und putzen.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Jährlich):** 2.4
**Berechnung:** $(60 + 2*5 + 1*10) * 1 = 80$
$80 * 0.03 \\text{ (Jährlich)} = 2.4$

### 58. Gesamte Wohnung saugen

**Beschreibung:** Alle Böden in der Wohnung saugen.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Wöchentlich):** 80
**Berechnung:** $(20 + 2*5 + 1*10) * 2 = 80$
$80 * 1 \\text{ (Wöchentlich)} = 80$

### 59. Gesamte Wohnung wischen (Parkett)

**Beschreibung:** Parkettböden in der gesamten Wohnung wischen.
**Punkte pro Ausführung:** 60
**Gesamtpunkte (pro 2x/Jahr):** 3.6
**Berechnung:** $(45 + 1*5 + 1*10) * 1 = 60$
$60 * 0.06 \\text{ (2x/Jahr)} = 3.6$

### 60. Fenster putzen

**Beschreibung:** Alle Fenster in der Wohnung putzen (inkl. Erlernen des neuen Geräts).
**Punkte pro Ausführung:** 220
**Gesamtpunkte (pro Jährlich):** 6.6
**Berechnung:** $(180 + 2*5 + 3*10) * 1 = 220$
$220 * 0.03 \\text{ (Jährlich)} = 6.6$

### 61. Unter Betten putzen (Gästezimmer)

**Beschreibung:** Unter dem Bett im Gästezimmer alles raussammeln, putzen und Staub wischen.
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Quartalsweise):** 4.5
**Berechnung:** $(30 + 1*5 + 1*10) * 1 = 45$
$45 * 0.1 \\text{ (Quartalsweise)} = 4.5$

### 62. Sofa wegschieben & dahinter putzen

**Beschreibung:** Sofa im Wohnzimmer wegschieben, darunter und die Wand dahinter putzen. (Kann mit Fensterputzen kombiniert werden, da es dann eh verschoben wird.)
**Punkte pro Ausführung:** 50
**Gesamtpunkte (pro Jährlich):** 1.5
**Berechnung:** $(30 + 2*5 + 1*10) * 1 = 50$
$50 * 0.03 \\text{ (Jährlich)} = 1.5$

### 63. Pfand sammeln & wegbringen (Terasse & Keller)

**Beschreibung:** Pfandflaschen auf der Terrasse und im Keller einsammeln, sortieren, einladen. Zum Automaten fahren, einlösen und zurück.
**Punkte pro Ausführung:** 105
**Gesamtpunkte (pro Quartalsweise):** 10.5
**Berechnung:** $(75 + 2*5 + 2*10) * 1 = 105$
$105 * 0.1 \\text{ (Quartalsweise)} = 10.5$

### 64. Terrasse Grundreinigung (jährlich)

**Beschreibung:** Terrasse komplett aufräumen, putzen (ggf. abfegen, schrubben), Ekeliges entfernen.
**Punkte pro Ausführung:** 232.5
**Gesamtpunkte (pro Jährlich):** 6.975
**Berechnung:** $(120 + 3*5 + 2*10) * 1.5 = 232.5$
$232.5 * 0.03 \\text{ (Jährlich)} = 6.975$

### 65. Terrasse Aufräumen (quartalsweise)

**Beschreibung:** Tische abwischen, Kruschd wegräumen, kurz fegen.
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Quartalsweise):** 4.5
**Berechnung:** $(30 + 1*5 + 1*10) * 1 = 45$
$45 * 0.1 \\text{ (Quartalsweise)} = 4.5$

### 66. Hecke außen schneiden (2x/Jahr)

**Beschreibung:** Hecke außen schneiden.
**Punkte pro Ausführung:** 112.5
**Gesamtpunkte (pro 2x/Jahr):** 6.75
**Berechnung:** $(60 + 1*5 + 1*10) * 1.5 = 112.5$
$112.5 * 0.06 \\text{ (2x/Jahr)} = 6.75$

### 67. Hecke innen / Gestrüpp schneiden (2x/Jahr)

**Beschreibung:** Hecke innen und Gestrüpp vor dem Fenster schneiden.
**Punkte pro Ausführung:** 120
**Gesamtpunkte (pro 2x/Jahr):** 7.2
**Berechnung:** $(60 + 2*5 + 1*10) * 1.5 = 120$
$120 * 0.06 \\text{ (2x/Jahr)} = 7.2$

### 68. Garage von Efeu befreien

**Beschreibung:** Efeu an der Garage entfernen.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Jährlich):** 2.4
**Berechnung:** $(60 + 2*5 + 1*10) * 1 = 80$
$80 * 0.03 \\text{ (Jährlich)} = 2.4$

### 69. Grünschnitt/Astwerk zum Häckselplatz fahren

**Beschreibung:** Geschnittenes Hecken-/Efeu-Zeug in den Hänger laden, zum Häckselplatz fahren und dort abladen. (Sie haben Hängerführerschein).
**Punkte pro Ausführung:** 127.5
**Gesamtpunkte (pro 2x/Jahr):** 7.65
**Berechnung:** $(60 + 1*5 + 2*10) * 1.5 = 127.5$
$127.5 * 0.06 \\text{ (2x/Jahr)} = 7.65$

### 70. Rasen mähen

**Beschreibung:** Rasen (ca. 80 qm) mähen.
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Wöchentlich):** 45
**Berechnung:** $(30 + 1*5 + 1*10) * 1 = 45$
$45 * 1 \\text{ (Wöchentlich)} = 45$

### 71. Obstbäume schneiden (3 Stück)

**Beschreibung:** 3 Obstbäume fachgerecht schneiden.
**Punkte pro Ausführung:** 330
**Gesamtpunkte (pro Jährlich):** 9.9
**Berechnung:** $(180 + 2*5 + 3*10) * 1.5 = 330$
$330 * 0.03 \\text{ (Jährlich)} = 9.9$

### 72. Äpfel aufsammeln

**Beschreibung:** Fallobst (Äpfel) regelmäßig aufsammeln.
**Punkte pro Ausführung:** 30
**Gesamtpunkte (pro Wöchentlich):** 30
**Berechnung:** $(15 + 1*5 + 1*10) * 1 = 30$
$30 * 1 \\text{ (Wöchentlich)} = 30$

### 73. Kompost umgraben

**Beschreibung:** Komposthaufen umgraben.
**Punkte pro Ausführung:** 70
**Gesamtpunkte (pro Jährlich):** 2.1
**Berechnung:** $(45 + 3*5 + 1*10) * 1 = 70$
$70 * 0.03 \\text{ (Jährlich)} = 2.1$

### 74. Unkraut jäten (Garten)

**Beschreibung:** Beete und Wege im Garten von Unkraut befreien.
**Punkte pro Ausführung:** 80
**Gesamtpunkte (pro Monatlich):** 20
**Berechnung:** $(60 + 2*5 + 1*10) * 1 = 80$
$80 * 0.25 \\text{ (Monatlich)} = 20$

### 75. Sitzecke Frühjahr fit machen

**Beschreibung:** Sitzecke im Garten reinigen, Möbel aufstellen/säubern, ggf. Kissen/Deko rausholen.
**Punkte pro Ausführung:** 127.5
**Gesamtpunkte (pro Jährlich):** 3.825
**Berechnung:** $(60 + 1*5 + 2*10) * 1.5 = 127.5$
$127.5 * 0.03 \\text{ (Jährlich)} = 3.825$

### 76. Sitzecke aufräumen (wöchentlich)

**Beschreibung:** Sitzecke von Tassen, Büchern, Kruschd befreien, kurz abwischen.
**Punkte pro Ausführung:** 25
**Gesamtpunkte (pro Wöchentlich):** 25
**Berechnung:** $(10 + 1*5 + 1*10) * 1 = 25$
$25 * 1 \\text{ (Wöchentlich)} = 25$

### 77. Pool Frühjahrsreinigung & Einlassung

**Beschreibung:** Pool grundreinigen und mit Wasser füllen. Filter etc. vorbereiten.
**Punkte pro Ausführung:** 442.5
**Gesamtpunkte (pro Jährlich):** 13.275
**Berechnung:** $(240 + 3*5 + 4*10) * 1.5 = 442.5$
$442.5 * 0.03 \\text{ (Jährlich)} = 13.275$

### 78. Pool Wintervorbereitung & Ablassen

**Beschreibung:** Pool winterfest machen, ablassen, abdecken.
**Punkte pro Ausführung:** 330
**Gesamtpunkte (pro Jährlich):** 9.9
**Berechnung:** $(180 + 2*5 + 3*10) * 1.5 = 330$
$330 * 0.03 \\text{ (Jährlich)} = 9.9$

### 79. Keller: Kartons ausräumen

**Beschreibung:** Einen Karton im Keller pro Monat ausräumen und den Inhalt sortieren/verräumen.
**Punkte pro Ausführung:** 155
**Gesamtpunkte (pro Monatlich):** 38.75
**Berechnung:** $(120 + 3*5 + 2*10) * 1 = 155$
$155 * 0.25 \\text{ (Monatlich)} = 38.75$

### 80. Keller/Garage/Lager: Grundordnung schaffen

**Beschreibung:** Diese Räume grundlegend aufräumen, sortieren, eine Struktur schaffen. (Kann in mehreren Etappen erfolgen.)
**Punkte pro Ausführung:** 175
**Gesamtpunkte (pro Monatlich):** 43.75
**Berechnung:** $(120 + 3*5 + 4*10) * 1 = 175$
$175 * 0.25 \\text{ (Monatlich)} = 43.75$

### 81. Partyraum aufräumen (bei Bedarf)

**Beschreibung:** Im Partyraum aufräumen, wenn er von Mietern genutzt wurde (außer Pfand).
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Jährlich):** 4.05
**Berechnung:** $(30 + 1*5 + 1*10) * 1 = 45$
$45 * 0.09 \\text{ (Nach Bedarf)} = 4.05$

### 82. Waschkeller aufräumen (quartalsweise)

**Beschreibung:** Waschmittel sortieren, auf der Waschmaschine putzen, Spinnweben entfernen etc.
**Punkte pro Ausführung:** 45
**Gesamtpunkte (pro Quartalsweise):** 4.5
**Berechnung:** $(30 + 1*5 + 1*10) * 1 = 45$
$45 * 0.1 \\text{ (Quartalsweise)} = 4.5$

### 83. Hobbyraum aufräumen

**Beschreibung:** Hobbyraum aufräumen und organisieren.
**Punkte pro Ausführung:** 75
**Gesamtpunkte (pro Monatlich):** 18.75
**Berechnung:** $(60 + 1*5 + 1*10) * 1 = 75$
$75 * 0.25 \\text{ (Monatlich)} = 18.75$

### 84. Kehrwoche Treppenhaus

**Beschreibung:** Treppenhaus fegen und wischen. Ggf. Mieter motivieren.
**Punkte pro Ausführung:** 120
**Gesamtpunkte (pro Monatlich):** 30
**Berechnung:** $(30 + 2*5 + 2*10) * 2 = 120$
$120 * 0.25 \\text{ (Monatlich)} = 30$

### 85. Laub in Kellerfenstern beseitigen

**Beschreibung:** Laub und Spinnweben aus den Kellerfensterschächten entfernen.
**Punkte pro Ausführung:** 55
**Gesamtpunkte (pro Jährlich):** 1.65
**Berechnung:** $(30 + 3*5 + 1*10) * 1 = 55$
$55 * 0.03 \\text{ (Jährlich)} = 1.65$

### 86. Vorgarten Rasen mähen

**Beschreibung:** Rasen im Vorgarten mähen.
**Punkte pro Ausführung:** 30
**Gesamtpunkte (pro Alle 2 Wochen):** 15
**Berechnung:** $(15 + 1*5 + 1*10) * 1 = 30$
$30 * 0.5 \\text{ (Alle 2 Wochen)} = 15$

### 87. Vorgarten Unkraut jäten

**Beschreibung:** Unkraut im Vorgarten jäten.
**Punkte pro Ausführung:** 50
**Gesamtpunkte (pro Monatlich):** 12.5
**Berechnung:** $(30 + 2*5 + 1*10) * 1 = 50$
$50 * 0.25 \\text{ (Monatlich)} = 12.5$

### 88. Schornsteinfeger organisieren

**Beschreibung:** Termin mit Schornsteinfeger vereinbaren und während des Termins anwesend sein.
**Punkte pro Ausführung:** 130
**Gesamtpunkte (pro Jährlich):** 3.9
**Berechnung:** $(30 + 1*5 + 3*10) * 2 = 130$
$130 * 0.03 \\text{ (Jährlich)} = 3.9$

### 89. Zählerstände ablesen & übermitteln

**Beschreibung:** Zählerstände (Strom, Wasser, Gas) ablesen und an Versorger übermitteln.
**Punkte pro Ausführung:** 60
**Gesamtpunkte (pro Quartalsweise):** 6
**Berechnung:** $(15 + 1*5 + 2*10) * 1.5 = 60$
$60 * 0.1 \\text{ (Quartalsweise)} = 6$

### 90. Mieter kümmern (Kommunikation & Probleme)

**Beschreibung:** Kommunikation mit Mietern, Probleme klären (z.B. Daniel-Problematik, Julians Wünsche), Anfragen sammeln, bewerten, priorisieren, ggf. umsetzen/delegieren.
**Punkte pro Ausführung:** 250
**Gesamtpunkte (pro Wöchentlich):** 250
**Berechnung:** $(60 + 3*5 + 5*10) * 2 = 250$
$250 * 1 \\text{ (Wöchentlich)} = 250$

### 91. Nebenkostenabrechnung erstellen

**Beschreibung:** Alle relevanten Daten sammeln, Abrechnung erstellen, an Mieter verschicken.
**Punkte pro Ausführung:** 750
**Gesamtpunkte (pro Jährlich):** 22.5
**Berechnung:** $(180 + 4*5 + 5*10) * 3 = 750$
$750 * 0.03 \\text{ (Jährlich)} = 22.5$

### 92. Steuererklärung erstellen

**Beschreibung:** Alle Unterlagen sammeln, Steuererklärung ausfüllen, Patric involvieren für seine Infos, einreichen.
**Punkte pro Ausführung:** 2025
**Gesamtpunkte (pro Jährlich):** 60.75
**Berechnung:** $(600 + 5*5 + 5*10) * 3 = 2025$
$2025 * 0.03 \\text{ (Jährlich)} = 60.75$

### 93. Mülltonnen rausstellen

**Beschreibung:** Die großen Mülltonnen (Restmüll, Biomüll, gelber Sack, Papier) an den Abholtagen an die Straße stellen.
**Punkte pro Ausführung:** 60
**Gesamtpunkte (pro Wöchentlich):** 60
**Berechnung:** $(5 + 1*5 + 3*10) * 1.5 = 60$
$60 * 1 \\text{ (Wöchentlich)} = 60$
        `;

        // Funktion zum Parsen des Markdown-Inhalts in ein Array von Aufgabenobjekten
        const parseTasks = (markdown) => {
            const parsedTasks = [];
            const taskBlocks = markdown.split('### ').slice(1);

            taskBlocks.forEach(block => {
                const lines = block.split('\n').filter(line => line.trim() !== '');

                if (lines.length === 0) return;

                const titleMatch = lines[0].match(/^(\d+)\.\s*(.*)/);
                if (!titleMatch) return;

                const id = parseInt(titleMatch[1]);
                const title = titleMatch[2].trim();

                let description = '';
                let pointsPerExecution = 0;
                let totalPointsWeeklyAvg = 0;
                let frequencyString = '';
                let calculation = '';

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (line.startsWith('**Beschreibung:**')) {
                        description = line.replace('**Beschreibung:**', '').trim();
                    } else if (line.startsWith('**Punkte pro Ausführung:**')) {
                        pointsPerExecution = parseFloat(line.replace('**Punkte pro Ausführung:**', '').trim());
                    } else if (line.startsWith('**Gesamtpunkte')) {
                        const totalPointsMatch = line.match(/\*\*Gesamtpunkte \(pro ([^:]+)\):\*\*\s*(.*)/);
                        if (totalPointsMatch) {
                            frequencyString = totalPointsMatch[1].trim();
                            totalPointsWeeklyAvg = parseFloat(totalPointsMatch[2].trim());
                        }
                    } else if (line.startsWith('**Berechnung:**')) {
                        calculation = line.replace('**Berechnung:**', '').trim().replace(/\\\\text/g, '\\text');
                    }
                }

                // Berechne frequencyDays basierend auf der Frequenzstring
                let frequencyDays = 0;
                if (frequencyString.includes('Woche')) {
                    if (frequencyString === 'Wöchentlich') {
                        frequencyDays = 7;
                    } else if (frequencyString === 'Alle 1-2 Wochen') {
                        frequencyDays = 10.5; // Durchschnitt von 1 und 2 Wochen
                    } else if (frequencyString === 'Alle 2 Wochen') {
                        frequencyDays = 14;
                    } else if (frequencyString.includes('x/Woche')) {
                        const num = parseFloat(frequencyString.split('x/Woche')[0]);
                        frequencyDays = 7 / num;
                    } else if (frequencyString === '12 Wochen/Jahr') {
                        frequencyDays = 365 / 12; // ca. 30.4 Tage
                    }
                } else if (frequencyString === 'Monatlich') {
                    frequencyDays = 30; // Durchschnittlicher Monat
                } else if (frequencyString === 'Quartalsweise') {
                    frequencyDays = 90; // Durchschnittliches Quartal
                } else if (frequencyString === 'Jährlich') {
                    frequencyDays = 365;
                } else if (frequencyString.includes('x/Jahr')) {
                    const num = parseFloat(frequencyString.split('x/Jahr')[0]);
                    frequencyDays = 365 / num;
                } else if (frequencyString === 'Alle 20 Tage') {
                    frequencyDays = 20;
                } else if (frequencyString === 'Nach Bedarf') {
                    frequencyDays = 365 * 10; // Sehr hohe Zahl, damit sie nicht automatisch fällig wird
                }

                parsedTasks.push({
                    id,
                    title,
                    description,
                    pointsPerExecution,
                    totalPointsWeeklyAvg,
                    frequencyString,
                    frequencyDays,
                    calculation
                });
            });
            return parsedTasks;
        };

        setTasks(parseTasks(markdownContent));

        // Lade den Abschlussstatus aus localStorage
        const savedCompletionStatus = JSON.parse(localStorage.getItem('taskCompletionStatus')) || {};
        setTaskCompletionStatus(savedCompletionStatus);

        // Überprüfe und setze den wöchentlichen Fortschritt zurück, wenn eine neue Woche begonnen hat
        const lastResetDate = localStorage.getItem('lastWeeklyResetDate');
        const today = new Date();
        const mondayOfThisWeek = new Date(today);
        mondayOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Setze auf Montag der aktuellen Woche
        mondayOfThisWeek.setHours(0, 0, 0, 0);

        if (!lastResetDate || new Date(lastResetDate).getTime() < mondayOfThisWeek.getTime()) {
            // Neue Woche oder erster Start, setze completedThisWeek zurück
            const newCompletionStatus = {};
            for (const taskId in savedCompletionStatus) {
                newCompletionStatus[taskId] = {
                    ...savedCompletionStatus[taskId],
                    completedThisWeek: false
                };
            }
            setTaskCompletionStatus(newCompletionStatus);
            localStorage.setItem('taskCompletionStatus', JSON.stringify(newCompletionStatus));
            localStorage.setItem('lastWeeklyResetDate', formatDate(today));
        }

    }, []); // Leeres Array bedeutet, dass der Effekt nur einmal beim Mounten ausgeführt wird

    // Speichere den Abschlussstatus bei jeder Änderung in localStorage
    useEffect(() => {
        localStorage.setItem('taskCompletionStatus', JSON.stringify(taskCompletionStatus));
    }, [taskCompletionStatus]);

    // Handler zum Umschalten des Abschlussstatus einer Aufgabe
    const handleTaskToggle = useCallback((taskId, isCompleted) => {
        setTaskCompletionStatus(prevStatus => {
            const newStatus = {
                ...prevStatus,
                [taskId]: {
                    lastCompleted: isCompleted ? formatDate(new Date()) : (prevStatus[taskId]?.lastCompleted || null),
                    completedThisWeek: isCompleted // Markiere als diese Woche erledigt
                }
            };
            return newStatus;
        });
    }, []);

    // Berechne die Gesamtpunkte, die pro Woche gesammelt werden sollten
    const totalTargetWeeklyPoints = tasks.reduce((sum, task) => sum + task.totalPointsWeeklyAvg, 0);

    // Berechne die aktuell gesammelten Punkte für diese Woche
    const currentWeeklyPoints = tasks.reduce((sum, task) => {
        const status = taskCompletionStatus[task.id];
        if (status && status.completedThisWeek) {
            return sum + task.pointsPerExecution;
        }
        return sum;
    }, 0);

    // Filter die Aufgaben basierend auf dem ausgewählten Filtertyp
    const filteredTasks = tasks.filter(task => {
        const status = taskCompletionStatus[task.id];
        const lastCompletedDate = status ? status.lastCompleted : null;
        const isCompletedThisWeek = status ? status.completedThisWeek : false;

        // Bestimme, ob eine Aufgabe fällig ist
        let isDue = false;
        if (task.frequencyString === "Nach Bedarf") {
            // "Nach Bedarf" Aufgaben sind immer verfügbar, wenn nicht diese Woche erledigt
            isDue = !isCompletedThisWeek;
        } else {
            // Andere Aufgaben sind fällig, wenn sie noch nicht diese Woche erledigt wurden
            // UND ihr Frequenzzeitraum abgelaufen ist
            if (!isCompletedThisWeek) {
                if (!lastCompletedDate) {
                    isDue = true; // Nie erledigt, also fällig
                } else {
                    const daysSinceLastCompletion = daysBetween(lastCompletedDate, new Date());
                    isDue = daysSinceLastCompletion >= task.frequencyDays;
                }
            }
        }

        if (filterType === 'due') {
            return isDue;
        }
        return true; // 'all' filter
    });

    // Fortschritt in Prozent
    const progressPercentage = totalTargetWeeklyPoints > 0 ? (currentWeeklyPoints / totalTargetWeeklyPoints) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-inter">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Haushalts- und Verwaltungsaufgaben</h1>
                <p className="text-xl text-gray-600">Deine digitalen Aufgabenkarten</p>
            </header>

            {/* Wochenübersicht und Fortschrittsbalken */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Wöchentlicher Fortschritt</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-700">Gesammelte Punkte diese Woche:</span>
                    <span className="text-xl font-bold text-blue-600">{currentWeeklyPoints.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-700">Zielpunkte pro Woche:</span>
                    <span className="text-xl font-bold text-green-600">{totalTargetWeeklyPoints.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-2">{progressPercentage.toFixed(1)}% abgeschlossen</p>

                <div className="flex justify-center mt-6 space-x-4">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            filterType === 'all'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Alle Aufgaben
                    </button>
                    <button
                        onClick={() => setFilterType('due')}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            filterType === 'due'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Fällige Aufgaben
                    </button>
                    <button
                        onClick={() => {
                            const confirmed = window.confirm("Möchtest du den wöchentlichen Fortschritt wirklich zurücksetzen? Dies setzt die 'Diese Woche erledigt'-Markierung für alle Aufgaben zurück.");
                            if (confirmed) {
                                const newStatus = {};
                                for (const taskId in taskCompletionStatus) {
                                    newStatus[taskId] = {
                                        ...taskCompletionStatus[taskId],
                                        completedThisWeek: false
                                    };
                                }
                                setTaskCompletionStatus(newStatus);
                                localStorage.setItem('lastWeeklyResetDate', formatDate(new Date())); // Setze das Reset-Datum auf heute
                                alert("Wöchentlicher Fortschritt wurde zurückgesetzt!");
                            }
                        }}
                        className="px-6 py-2 rounded-lg font-semibold bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors duration-200"
                    >
                        Wöchentlichen Fortschritt zurücksetzen
                    </button>
                </div>
            </div>

            {/* Aufgabenkarten-Raster */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            completionStatus={taskCompletionStatus[task.id]}
                            onToggleComplete={handleTaskToggle}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600 text-lg">
                        Keine Aufgaben gefunden, die deinen Kriterien entsprechen.
                    </p>
                )}
            </div>
        </div>
    );
};

// Komponente für eine einzelne Aufgabenkarte
const TaskCard = ({ task, completionStatus, onToggleComplete }) => {
    const isCompletedThisWeek = completionStatus ? completionStatus.completedThisWeek : false;
    const lastCompletedDate = completionStatus ? completionStatus.lastCompleted : null;

    // Bestimme, ob die Aufgabe fällig ist (für visuelle Hervorhebung)
    let isDue = false;
    if (task.frequencyString === "Nach Bedarf") {
        isDue = !isCompletedThisWeek; // "Nach Bedarf" ist fällig, wenn nicht diese Woche erledigt
    } else {
        if (!isCompletedThisWeek) { // Nur fällig, wenn nicht diese Woche erledigt
            if (!lastCompletedDate) {
                isDue = true; // Nie erledigt
            } else {
                const daysSinceLastCompletion = daysBetween(lastCompletedDate, new Date());
                isDue = daysSinceLastCompletion >= task.frequencyDays;
            }
        }
    }

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 hover:shadow-xl
            ${isDue && !isCompletedThisWeek ? 'border-2 border-red-500' : ''}
            ${isCompletedThisWeek ? 'opacity-70 border-2 border-green-500' : ''}
        `}>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {task.id}. {task.title}
                </h2>
                <p className="text-gray-700 mb-4 text-sm">{task.description}</p>
                <div className="space-y-1 text-sm">
                    <p className="text-gray-800">
                        <span className="font-semibold">Punkte pro Ausführung:</span> {task.pointsPerExecution}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-semibold">Gesamtpunkte (pro {task.frequencyString}):</span> {task.totalPointsWeeklyAvg}
                    </p>
                    <p className="text-gray-600 text-xs">
                        <span className="font-semibold">Berechnung:</span> ${task.calculation}$
                    </p>
                    {lastCompletedDate && (
                        <p className="text-gray-600 text-xs">
                            <span className="font-semibold">Zuletzt erledigt:</span> {lastCompletedDate}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <input
                    type="checkbox"
                    id={`task-${task.id}`}
                    checked={isCompletedThisWeek}
                    onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md focus:ring-blue-500"
                />
                <label htmlFor={`task-${task.id}`} className="ml-2 text-lg text-gray-800 cursor-pointer">
                    Erledigt (diese Woche)
                </label>
            </div>
        </div>
    );
};

export default App;

