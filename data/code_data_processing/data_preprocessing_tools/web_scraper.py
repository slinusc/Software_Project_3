import requests
from bs4 import BeautifulSoup
import json


class SwissCommuneScraper:
    def __init__(self):
        self.url = 'https://de.wikipedia.org/wiki/Liste_Schweizer_Gemeinden#B'
        self.data = []

    def fetch_data(self):
        response = requests.get(self.url)
        print(response.encoding)
        if not response.ok:
            print("Fehler beim Abrufen der Seite")
            return False

        soup = BeautifulSoup(response.text, 'html.parser')
        tables = soup.find_all('table')

        if not tables:
            print("Keine Tabellen gefunden")
            return False

        self._process_table(tables[0])
        return True

    def _process_table(self, table):
        for row in table.find_all('tr'):
            columns = row.find_all('td')
            if columns:
                einwohner = int(columns[3].text.replace("'", "").strip())
                kanton = columns[1].text.strip()[7:-3]  # remove "Kanton" and Kürzel
                if einwohner > 10000:
                    self.data.append({
                        'Gemeinde': columns[0].text.strip().replace("'", ""),
                        'Kanton': kanton,
                        'BFS-Nr.': int(columns[2].text.strip().replace("'", "")),
                        'Einwohner': einwohner,
                        'Fläche in km²': float(columns[4].text.replace(',', '.').replace("'", "").strip()),
                        'Einwohnerdichte (Einwohner pro km²)': float(
                            columns[5].text.replace(',', '.').replace("'", "").strip())
                    })

    def save_data(self, filename):
        with open(filename, 'w') as f:
            json.dump(self.data, f, ensure_ascii=False, indent=4)


if __name__ == '__main__':
    scraper = SwissCommuneScraper()
    if scraper.fetch_data():
        scraper.save_data('../../data/raw_data/grosse_gemeinden_data.json')
        print(f"Anzahl der Gemeinden mit mehr als 10.000 Einwohnern: {len(scraper.data)}")
    else:
        print("Daten konnten nicht abgerufen werden")
