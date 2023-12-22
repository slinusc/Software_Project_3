# CycleBuddy

## Beschreibung
CycleBuddy ist eine Web-Applikation, die speziell für Fahrradfahrer entwickelt wurde. Sie bietet verschiedene Fahrradrouten und für Radfahrer relevante Standorte, wie Fahrradwerkstätten, Fahrradparkplätze, Fahrradverleihstationen und Fahrradpumpen. Die Applikation ist für die Nutzung auf mobilen Endgeräten optimiert und bietet zudem ein Dashboard mit eine Reihe von Analysefunktionen, die speziell auf Fahrradfahrer ausgerichtet sind.

![image](https://github.com/slinusc/cycle_buddy_app/assets/94235012/f0e0bcbe-11d5-4922-a0c3-8075c1caf667)

### Nacht-Modus
Um zu verhindern, dass Radfahrer nachts durch einen grellen Bildschirm vom Verkehr abgelenkt werden, bietet die App eine Dark-Mode-Option an.

![image](https://github.com/slinusc/cycle_buddy_app/assets/94235012/7b73e8ed-23c7-4d8b-b966-69e8cc09c607)

## Erste Schritte
Folgen Sie diesen Schritten, um die CycleBuddy App lokal als Docker-Container zu starten:

1. **Docker Installation:** Stellen Sie sicher, dass Docker bzw. Docker Desktop auf Ihrem Gerät installiert ist. Falls Sie Docker noch nicht installiert haben, finden Sie Anleitungen auf der offiziellen Docker-Website (https://www.docker.com/products/docker-desktop).

2. **Befehlszeile öffnen:** Starten Sie die Befehlszeilenkonsole Ihres Computers.

3. **Navigieren zum App-Verzeichnis:** Verwenden Sie den Befehl `cd Pfad/zum/cycle_buddy_app`, wobei Sie `Pfad/zum` durch den tatsächlichen Pfad zum CycleBuddy App-Verzeichnis ersetzen.

4. **Bauen mit Docker Compose:** Führen Sie `docker-compose build` aus. Dieser Befehl erstellt und konfiguriert alle notwendigen Dienste, die für den Betrieb der App erforderlich sind.

5. **Starten der Applikation in einem Container:** Geben Sie `docker-compose up` ein, um die Applikation zu starten. Dieser Befehl initiiert alle Dienste, die in der `docker-compose.yml`-Datei definiert sind, und macht die App auf Ihrem lokalen Server (typischerweise `http://127.0.0.1:5000/`) verfügbar.

Nachdem Sie diese Schritte abgeschlossen haben, sollte die CycleBuddy Web-Applikation auf Ihrem lokalen Server laufen und über einen Webbrowser erreichbar sein. Überprüfen Sie die Konsole auf etwaige Fehlermeldungen, falls die App nicht wie erwartet startet.
