from pymongo import MongoClient
import requests
import json
import time


def number_amenities_in_radius(lat, lon, radius=1000):
    client = MongoClient("mongodb://localhost:27017/")
    db = client["data_base_OSM"]
    amenities_collection = db["bicycle_amenities"]

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
    client = MongoClient("mongodb://localhost:27017/")
    db = client["data_base_OSM"]
    amenities_collection = db["bicycle_amenities"]

    query = {
        "node.amenity": amenity_type,  # Filter nach dem Amenity-Typ
        "node.location": {
            "$nearSphere": {
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
    try:

        MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw"
        url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{lon1},{lat1};{lon2},{lat2}?access_token={MAPBOX_ACCESS_TOKEN}"
        response = requests.get(url)
        data = json.loads(response.text)
        # Die Entfernung wird in Metern zurückgegeben
        distance = data['routes'][0]['distance']
        return distance
    except:
        return 0


def get_address_from_coords(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get("display_name")  # oder ein spezifischeres Feld aus der Antwort
    return "Adresse nicht verfügbar"


if __name__ == "__main__":

    start_time = time.time()
    nearest_amenities = find_k_nearest_amenities(47.3769, 8.5417, "bicycle_parking", 5)
    print(nearest_amenities)
    end_time = time.time()
    print(f"Time elapsed: {end_time - start_time} seconds")
    """nearest_amenities = number_amenities_in_radius(47.3769, 8.5417, radius=1000) # 1km, Zürich
    print(nearest_amenities)"""

