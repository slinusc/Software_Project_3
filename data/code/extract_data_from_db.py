from pymongo import MongoClient
import json
import datetime as dt


def extract_data_db():
    client = MongoClient('localhost', 27017)
    db = client['data_base_OSM']
    collection = db['bicycle_amenities']
    daten = list(collection.find({}))
    with open(f'../data/amenities_{dt.datetime.now().date()}.json', 'w') as file:
        json.dump(daten, file, default=str)
    print("Data has been extracted!")


if __name__ == '__main__':
    extract_data_db()
