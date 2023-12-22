# offizielles Python-Runtime als Basis-Image
FROM python:3.8

# Setzen des Arbeitsverzeichnisses im Container
WORKDIR /app

# Kopieren der Anwendungsdateien und Datenverarbeitungsskripte in das Container-Arbeitsverzeichnis
COPY ./code /app
COPY ./data /app/data

# Installieren der in requirements.txt aufgeführten Pakete
RUN pip install --no-cache-dir -r requirements.txt

# Freigeben des Ports, auf dem die Anwendung läuft
EXPOSE 5000

# Ausführen der Datenlade-Skripte und dann Starten der Flask-App
CMD python /app/code/pycode/mongoDB_assistent.py && python /app/app.py
