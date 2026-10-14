# Wunderwort · Vokabelspiel

Ein spielerischer Englisch-Vokabeltrainer mit dem Babyhasen Lumi und einem Belohnungssystem.

## Spielen

`index.html` im Browser öffnen oder im Repository einen lokalen Server starten:

```sh
cd /workspace/Vokabelspiel
python3 -m http.server 8000 --bind 0.0.0.0
```

Anschließend den Server im Browser auf Port 8000 aufrufen. Keine Installation, Zugangsdaten oder Build-Schritte nötig. Die drei Anwendungsdateien lassen sich auf jedem statischen Webhosting veröffentlichen. Die veröffentlichte GitHub-Pages-Version liegt im Branch `gh-pages`: https://wildeswunderherz-cpu.github.io/Vokabelspiel/. Aktualisierungen werden nach dem Push durch GitHub Pages bereitgestellt.

## Spielablauf

- Zwei Schwierigkeitsgrade mit jeweils 15 Englisch-Vokabeln.
- Bis zu zehn zufällige Fragen pro Runde mit bis zu vier unterschiedlichen Antwortmöglichkeiten.
- Richtige Antworten bringen zehn Sterne; ein Leckerbissen für Lumi kostet zwanzig Sterne.
- Nach drei Leckerbissen erreicht Lumi ein neues Level.
- Unter „Meine Vokabeln“ eigene Wortpaare hinzufügen, bearbeiten und löschen; jede Sprache ist möglich.
- Eigene Listen separat spielen (mindestens zwei unterschiedliche Übersetzungen). Listenänderungen starten eine laufende eigene Runde neu.
- Wortlisten als JSON sichern und wieder laden; beim Import werden neue Vokabeln ergänzt und vorhandene beibehalten. Maximal 500 Wörter, maximal 120 Zeichen je Feld.
- Sterne und Fortschritt bleiben im lokalen Browserspeicher erhalten. Bei gesperrtem Speicher funktioniert das Spiel für die aktuelle Sitzung.

Das Spiel benötigt keine externen Dienste. Optionale Google-Schriften haben lokale Ersatzschriften. Fortschritt und eigene Vokabeln werden nur auf dem jeweiligen Gerät und Browser gespeichert, nicht auf GitHub. Beim Zurücksetzen des Spielstands bleiben eigene Vokabeln erhalten. Es gibt ausschließlich Vokabelaufgaben, keine Grammatikaufgaben.
