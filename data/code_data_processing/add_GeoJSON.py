from pymongo import MongoClient


def add_location_to_documents():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["data_base_OSM"]
    collection = db["bicycle_amenities"]

    for document in collection.find():
        lat = float(document['node']['lat'])
        lon = float(document['node']['lon'])

        # Erstellen des GeoJSON-Objekts
        location = {
            "type": "Point",
            "coordinates": [lon, lat]  # Längen- und Breitengrad
        }

        # Aktualisieren des Dokuments in der Datenbank
        collection.update_one(
            {"_id": document['_id']},
            {"$set": {"node.location": location}}
        )

    print("Location field added to all documents.")


if __name__ == "__main__":
    add_location_to_documents()
