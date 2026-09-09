# ENGI – Karteikarten-App

ENGI ist eine moderne, browserbasierte Karteikarten-App zum Lernen und Wiederholen.\
Die Anwendung ermöglicht es, eigene Stapel (Decks) und Karteikarten zu erstellen und den persönlichen Lernfortschritt direkt im Browser zu verfolgen.

## Features

### Stapelverwaltung

* Neue Stapel erstellen
* Vorhandene Stapel anzeigen
* Anzahl der Karten pro Stapel anzeigen

### Kartenverwaltung

* Karteikarten mit Vorder- und Rückseite erstellen
* Karten einem bestimmten Stapel zuordnen
* Karten anzeigen, bearbeiten und löschen

### Lernmodus

* Karten eines Stapels nacheinander abfragen
* Antworten auswerten
* Lernfortschritt speichern

### Lokale Speicherung

* Speicherung der Daten über **IndexedDB**
* Keine Serververbindung erforderlich
* Daten bleiben lokal im verwendeten Browser gespeichert

### Dark/Light Mode

* Zwischen hellem und dunklem Design wechseln
* Einstellung wird über `localStorage` gespeichert

### Benutzeroberfläche

* Responsive Design
* Header und Footer
* Modal-Dialoge, z. B. für Löschbestätigungen
* Verschiedene Ansichten für Stapel, Karten und Lernmodus

## Technische Grundlagen

Das Projekt wurde mit folgenden Technologien umgesetzt:

* **HTML** – Struktur der Anwendung in `index.html`
* **CSS** – Gestaltung und Layout in `style.css`
* **JavaScript** – Logik und Interaktionen in `index.js`
* **IndexedDB** – lokale Speicherung von Stapeln und Karten
* **localStorage** – Speicherung der Darstellungsoptionen

### Projektstruktur

```text
ENGI/
├── index.html
├── style.css
├── index.js
└── README.md
```

### `index.html`

Enthält die grundlegende Struktur der Anwendung, unter anderem Navigation, Stapelübersicht, Kartenansicht und Lernbereich.

### `style.css`

Enthält das Styling der Anwendung, beispielsweise Layout, Farben, Buttons, Karteikarten und Modal-Dialoge.

### `index.js`

Enthält die Anwendungslogik, unter anderem:

* Steuerung des Dark/Light Mode
* Initialisierung und Zugriff auf IndexedDB
* Verwaltung der `decks`- und `cards`-Stores
* Erstellen, Laden, Aktualisieren und Löschen von Stapeln und Karten
* Steuerung des Lernmodus
* Wechsel zwischen den verschiedenen Ansichten

## Projektstatus

Das Projekt befindet sich derzeit noch in der Entwicklung.

Folgende Bereiche sind noch offen oder können weiter ausgebaut werden:

* [ ] Detailansichten für Statistik und Einstellungen
* [ ] Erweiterte Auswertung des Lernfortschritts
* [ ] Diagramme und Zeitverläufe
* [ ] Feintuning des Designs
* [ ] Erweiterte Fehlerbehandlung und Edge Cases
* [ ] Weitere Lernmodi
* [ ] Spaced-Repetition-Algorithmus

Die bestehende Struktur ist darauf ausgelegt, weitere Funktionen und Ansichten zukünftig ergänzen zu können.

## Installation und Start

Da ENGI aktuell vollständig clientseitig läuft, ist keine Installation oder Serverumgebung erforderlich.

1. Repository klonen oder als ZIP herunterladen.
2. Projektordner öffnen.
3. `index.html` in einem modernen Browser öffnen.
4. Einen neuen Stapel erstellen.
5. Karten hinzufügen.
6. Den Lernmodus starten.

**Hinweis:** Die Daten werden ausschließlich lokal im Browser über IndexedDB gespeichert. Aktuell gibt es keine Server- oder Cloud-Anbindung.

## Geplante Erweiterungen

Mögliche zukünftige Funktionen sind:

* Export und Import von Stapeln und Karten, z. B. als JSON
* Synchronisation über mehrere Geräte
* Backend/API zur zentralen Datenspeicherung
* Benutzerkonten und Login
* Tags für Karten, z. B. „leicht“, „schwer“ oder nach Themenbereichen
* Verschiedene Lernstrategien
* Spaced-Repetition-System
* Erweiterte Statistiken und Lernanalysen

## Lizenz

Aktuell ist für dieses Projekt keine Lizenz hinterlegt.
