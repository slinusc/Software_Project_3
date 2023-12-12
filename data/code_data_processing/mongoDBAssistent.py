import json
from pymongo import MongoClient
import datetime as dt


class MongoDBAssistent:
    def __init__(self, db_name, collection_name,
                 db_uri="mongodb://mongo:27017/"):  # docker: mongo:27017, lokal: localhost:27017
        self.client = MongoClient(db_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]
        self.collection_name = collection_name

    def collection_is_empty(self):
        """Überprüft, ob die Sammlung leer ist."""
        return self.collection.count_documents({}) == 0

    def drop_collection(self):
        try:
            self.collection.drop()
            print("Collection has been dropped!")
        except Exception as e:
            print(f"An error occurred while dropping the collection: {e}")

    def load_in_db(self, file_name):
        try:
            with open(file_name + '.json', 'r') as file:
                data = json.load(file)

            if isinstance(data, list):
                self.collection.insert_many(data)
            else:
                self.collection.insert_one(data)
            print("Data has been loaded to MongoDB!")
        except Exception as e:
            print(f"An error occurred while loading data: {e}")

    def create_2dsphere_index(self):
        if self.collection_name == "bicycle_amenities":
            try:
                self.collection.create_index([("node.location", "2dsphere")])
                print("2dsphere index created on node.location in collection", self.collection_name)
            except Exception as e:
                print(f"An error occurred while creating the 2dsphere index: {e}")
        else:
            print("nur für bicycle_amenities möglich")

    def pull_from_db(self, file_name):
        try:
            daten = list(self.collection.find({}))
            with open(f'{file_name}_{dt.datetime.now().date()}.json', 'w') as file:
                json.dump(daten, file, default=str)
            print("Data has been extracted!")
        except Exception as e:
            print(f"An error occurred while pulling data: {e}")


if __name__ == '__main__':
    bike_ways = MongoDBAssistent("data_base_OSM", "bike_ways")
    amenities = MongoDBAssistent("data_base_OSM", "bicycle_amenities")
    try:
        if bike_ways.collection_is_empty():  # überprüft, ob die Collection leer ist
            bike_ways.load_in_db('data/raw_data/bicycle_backup_2023-12-12_renamed')  # nur für docker
        if amenities.collection_is_empty():  # überprüft, ob die Collection leer ist
            amenities.load_in_db('data/raw_data/2023-12-12_cleaned_amenity_file')  # nur für docker
            amenities.create_2dsphere_index()
    except Exception as e:
        print(f"An error occurred while running the mongoDBAssistent script: {e}")

    # bike_ways.load_in_db('../raw_data/bicycle_backup_2023-12-12_renamed') # lokal
    # amenities.load_in_db('../raw_data/2023-12-12_cleaned_amenity_file') # lokal
    # mongoDB.pull_from_db('../../data/raw_data/backup')
