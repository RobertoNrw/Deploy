# Diakonie Ruhr Geoanalyse — Changelog

## v8 (Mai 2026)
### Kritische Bugfixes
- **Verordner-Zahl**: War hardcoded `66`, jetzt dynamisch `ZUW.length` → zeigt korrekte Anzahl aller Verordner
- **Verordnungen**: War hardcoded `276`, jetzt dynamisch aus `ZUW.reduce((s,x)=>s+x.vo,0)`
- **Kundenzahl**: War hardcoded `1.810`, jetzt dynamisch aus `S.reduce((s,x)=>s+x.c,0)` berechnet
- **Pflege/Beratung-Split**: Dynamisch aus S-Array
- **map.invalidateSize()**: Wird jetzt bei allen Pane-Wechseln aufgerufen — behebt leere Kartendarstellung
- **Sozialraum-Metrikwechsel**: `sozM` Select-Handler war nicht implementiert, jetzt funktionsfähig
- **Zuweiser-Mbar-Titel**: Zeigt jetzt dynamische Zahlen

### Neue Features
- **Vivendi CSV-Import**: Modal mit Datei-Upload, Parser für Vivendi PD-Exportformat
- **Diamant CSV-Import**: Parser für Mitarbeiterdaten aus Diamant-Export
- **Datenstand-Badge**: Topbar zeigt `Datenstand: Mai 2026`
- **Schätzungs-Hinweis**: Sozialindex, Kaufkraft und Altersquotient als Schätzwerte markiert
- **Import-FAB**: Neuer Button für Daten-Import

### UX-Verbesserungen
- Zuweiser-Filteranzeige zeigt korrekte Anzahl je Filter
- Topbar-Pills reagieren auf tatsächliche Datenlage
- Konsistente Versionsanzeige v8

## v7 (April 2026)
- Visual Elevation Layer (Apple/California Design)
- Dark Mode Extended
- Präsentationsmodus
- AI-Drawer
- Isochrone mit Valhalla/ORS
