from pymongo import MongoClient
import json


def extract_data_db():
    client = MongoClient('localhost', 27017)
    db = client['data_base_OSM']
    collection = db['bicycle_amenities']
    daten = list(collection.find({}))
    with open('ameniteis_incl_canton.json', 'w') as file:
        json.dump(daten, file, default=str)


if __name__ == '__main__':
    extract_data_db()
