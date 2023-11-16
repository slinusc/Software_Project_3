from pymongo import MongoClient

def find_k_nearest_amenities(lat, lon, amenity_type, max_distance=5000, limit=5):
    client = MongoClient("mongodb://localhost:27017/")
    db = client["data_base_OSM"]
    amenities_collection = db["bicycle_amenities"]

    query = {
        "node.amenity": amenity_type,  # Filter nach dem Amenity-Typ
        "node.location": {
            "$nearSphere": { # Geospatial-Abfrage
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "$maxDistance": max_distance
            }
        }
    }

    return list(amenities_collection.find(query).limit(limit))


if __name__ == "__main__":

    # Beispiel: Suchen Sie die fünf nächstgelegenen Amenities zu einem gegebenen Standort
    nearest_amenities = find_k_nearest_amenities(47.3769, 8.5417, "bicycle_parking")  # Koordinaten für Berlin
    for amenity in nearest_amenities:
        print(amenity)
