# Wunderwort · Vokabelspiel

Ein spielerischer Englisch-Vokabeltrainer mit dem Fantasiedrachen Lumi und einem Belohnungssystem.

## Spielen

`index.html` im Browser öffnen oder im Repository einen lokalen Server starten:

```sh
cd /workspace/Vokabelspiel
python3 -m http.server 8000 --bind 0.0.0.0
```

Anschließend den Server im Browser auf Port 8000 aufrufen. Keine Installation, Zugangsdaten oder Build-Schritte nötig. Die drei Anwendungsdateien lassen sich auf jedem statischen Webhosting veröffentlichen. Es wurde noch keine öffentliche Website eingerichtet.

## Spielablauf

- Zwei Schwierigkeitsgrade mit jeweils 15 Englisch-Vokabeln.
- Zehn zufällige Fragen pro Runde mit jeweils vier Antwortmöglichkeiten.
- Richtige Antworten bringen zehn Sterne; ein Leckerbissen für Lumi kostet zwanzig Sterne.
- Nach drei Leckerbissen erreicht Lumi ein neues Level.
- Sterne und Fortschritt bleiben im lokalen Browserspeicher erhalten. Bei gesperrtem Speicher funktioniert das Spiel für die aktuelle Sitzung.

Das Spiel benötigt keine externen Dienste. Optionale Google-Schriften haben lokale Ersatzschriften. Fortschritt wird nur auf dem jeweiligen Gerät und Browser gespeichert.
