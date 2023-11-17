from pymongo import MongoClient


def count_amenities_by_canton(amenity_type):
    # Verbindung zur MongoDB herstellen (passe die Verbindungsdaten entsprechend an)
    client = MongoClient("mongodb://localhost:27017/")
    db = client["data_base_OSM"]

    # MongoDB-Abfrage

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

    # Test
    result = count_amenities_by_canton("bicycle_parking")
    print(result)
    # [{'_id': 'BE', 'count': 2}, {'_id': 'ZH', 'count': 1}]
