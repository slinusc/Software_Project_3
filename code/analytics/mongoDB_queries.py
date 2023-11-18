from pymongo import MongoClient
import requests
import json
import time

client = MongoClient("localhost", 27017)
db = client["data_base_OSM"]
amenities_collection = db["bicycle_amenities"]


def fetch_amenities_from_db(amenity_type):
    """
    Bezieht alle Einträge für einen bestimmten Amenity-Typ aus der Datenbank.
    :param amenity_type: Amenity-Typ, z.B. "bicycle_parking"
    :return: Liste mit allen Einträgen für den angegebenen Amenity-Typ
    """

    locations = db.bicycle_amenities.find({"node.amenity": {"$in": amenity_type}})
    results = [{
        "id": loc["node"]["id"],
        "lat": loc["node"]["lat"],
        "lon": loc["node"]["lon"],
        "name": loc["node"].get("name", ""),
        "amenity": loc["node"]["amenity"],
        "canton": loc["node"]["canton"]
    } for loc in locations]
    return results


def number_amenities_in_radius(lat, lon, radius=1000):
    """
    Findet die Anzahl der Amenities in einem bestimmten Radius.
    :param lat: Koordinaten des Users
    :param lon: Koordinaten des Users
    :param radius: in Metern (default 1000m)
    :return: Anzahl der Amenities in einem bestimmten Radius
    """

    pipeline = [
        {
            "$geoNear": {
                "near": {"type": "Point", "coordinates": [lon, lat]},
                "spherical": True,
                "maxDistance": radius,
                "distanceField": "distance",
            }
        },
        {
            "$group": {
                "_id": "$node.amenity",
                "count": {"$sum": 1}
            }
        }
    ]

    result = list(amenities_collection.aggregate(pipeline))
    return result


def find_k_nearest_amenities(lat, lon, amenity_type, k=5):
    """
    Findet die k nächsten Amenities für einen bestimmten Amenity-Typ mit der Entfernung zum User und der Adresse.
    :param lat: Koordinaten des Users
    :param lon: Koordinaten des Users
    :param amenity_type: Amenity-Typ, z.B. "bicycle_parking"
    :param k: anzahl der nächsten amenities, default 5
    :return:{"amenity": "bicycle_parking", "address": "Bahnhofquai, 8001", "coordinates": [8.5418991, 47.3767359], "distance": 36.4}
    """

    query = {
        "node.amenity": amenity_type,  # Filter nach dem Amenity-Typ
        "node.location": {
            "$nearSphere": {  # Filter nach der Entfernung zum Stadort des Users mit $nearSphere
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                }
            }
        }
    }

    amenities = list(amenities_collection.find(query).limit(k))
    result = []
    for amenity in amenities:
        # Berechnen der Entfernung
        amenity_coords = amenity["node"]["location"]["coordinates"]
        amenity["distance"] = calculate_distance_mapbox(lat, lon, amenity_coords[1], amenity_coords[0])

        # Adressinformationen abrufen (Beispiel mit OpenStreetMap Nominatim API)
        address = get_address_from_coords(amenity_coords[1], amenity_coords[0])

        # Nur Adresse und Koordinaten zur Ergebnisliste hinzufügen
        result.append({
            "amenity": amenity_type,
            "address": address,
            "coordinates": amenity_coords,
            "distance": amenity["distance"]
        })

    result_json = json.dumps(result)
    return result_json


def calculate_distance_mapbox(lat1, lon1, lat2, lon2):
    """
    Calculates distance for bicycles between two points using Mapbox API.
    :param lat1: Koordinaten des Users
    :param lon1: Koordinaten des Users
    :param lat2: Koordinaten von Amenity
    :param lon2: Koordinaten von Amenity
    :return: "distance": 36.4 (in meters)
    """

    try:
        MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw"
        url = f"https://api.mapbox.com/directions/v5/mapbox/cycling/{lon1},{lat1};{lon2},{lat2}?access_token={MAPBOX_ACCESS_TOKEN}"
        response = requests.get(url)
        data = json.loads(response.text)
        # Die Entfernung wird in Metern zurückgegeben
        distance = data['routes'][0]['distance']
        return distance
    except:
        return 0


def get_address_from_coords(lat, lon):
    """
    Bezieht die Adresse für eine bestimmte Koordinate mit der OpenStreetMap Nominatim API.
    :param lat: User-Koordinaten
    :param lon: User-Koordinaten
    :return: Adresse für Koordinaten der Amenities
    """

    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        # Extrahieren der gewünschten Felder aus der Antwort
        road = data.get("address", {}).get("road", "")
        house_number = data.get("address", {}).get("house_number", "")
        town = data.get("address", {}).get("town", "")
        postcode = data.get("address", {}).get("postcode", "")
        # Formatieren der Adresse
        if house_number:
            address = f"{road} {house_number}, {town}, {postcode}"
        else:
            address = f"{road}, {postcode}"
        return address.strip()
    return "Adresse nicht verfügbar"


def count_amenities_by_canton(amenity_type):
    """
    :param amenity_type: Amenity-Typ, z.B. "bicycle_parking"
    :return: [{'_id': 'BE', 'count': 2}, {'_id': 'ZH', 'count': 1}]
    """

    pipeline = [
        {
            "$match": {
                "node.amenity": amenity_type,
                "node.canton": {"$exists": True}  # Filter nach Einträgen mit Kanton
            }
        },
        {
            "$group": {
                "_id": "$node.canton",
                "count": {"$sum": 1}
            }
        }
    ]
    result = list(db.bicycle_amenities.aggregate(pipeline))
    return result


if __name__ == "__main__":
    start_time = time.time()
    nearest_amenities = find_k_nearest_amenities(47.3769, 8.5417, "bicycle_parking", 5)
    print(nearest_amenities)
    end_time = time.time()
    print(f"Time elapsed: {end_time - start_time} seconds")

    """nearest_amenities = number_amenities_in_radius(47.3769, 8.5417, radius=1000) # 1km, Zürich
    print(nearest_amenities)"""
