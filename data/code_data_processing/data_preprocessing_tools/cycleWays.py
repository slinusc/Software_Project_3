import requests
import math


class BicycleWays:

    def __init__(self, city_name):
        self.city_name = city_name
        self.overpass_url = "http://overpass-api.de/api/interpreter"
        self.cycleways_data = self.fetch_cycleways()
        self.total_cycleway_length = self.calculate_total_length()

    def fetch_cycleways(self):
        overpass_query = f"""
        [out:json];
        area[name="{self.city_name}"]->.searchArea;
        (
        way["highway"="cycleway"](area.searchArea); //Radweg
        way["cycleway"~"yes|designated"](area.searchArea); //Radfahrstreifen
        way["bicycle_road"~"yes|designated"](area.searchArea); //Fahrradstraße
        way["bicycle"="lane"](area.searchArea); //Fahrradspur
        way[~"cycleway"~"lane"](area.searchArea); //Fahrradspur
        way["highway"="footway"]["bicycle"="yes"](area.searchArea); //Fußweg mit Radfahrerlaubnis
        );
        out geom;
        """
        response = requests.get(self.overpass_url, params={'data': overpass_query})
        return response.json()

    @staticmethod
    def calculate_distance(lat1, lon1, lat2, lon2):
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        km = 6371 * c
        return km

    def calculate_total_length(self):
        total_length = 0
        for way in self.cycleways_data['elements']:
            points = way['geometry']
            for i in range(len(points) - 1):
                total_length += self.calculate_distance(points[i]['lat'], points[i]['lon'],
                                                        points[i + 1]['lat'], points[i + 1]['lon'])
        return total_length


if __name__ == '__main__':
    bicycleWays = BicycleWays("Bern")
    print(bicycleWays.total_cycleway_length)