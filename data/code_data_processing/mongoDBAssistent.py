import json
from pymongo import MongoClient
import datetime as dt


class MongoDBAssistent:
    def __init__(self, db_name, collection_name, db_uri="mongodb://localhost:27017/"):
        self.client = MongoClient(db_uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

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

    def pull_from_db(self, file_name):
        try:
            daten = list(self.collection.find({}))
            with open(f'{file_name}_{dt.datetime.now().date()}.json', 'w') as file:
                json.dump(daten, file, default=str)
            print("Data has been extracted!")
        except Exception as e:
            print(f"An error occurred while pulling data: {e}")


if __name__ == '__main__':
    mongoDB = MongoDBAssistent("data_base_OSM", "bike_ways")
    mongoDB2 = MongoDBAssistent("data_base_OSM", "bicycle_amenities")
    #mongoDB.drop_collection()
    mongoDB.load_in_db('../../data/raw_data/backup_2023-12-07')
    mongoDB2.load_in_db('../../data/raw_data/amenities_2023-11-20')
    #mongoDB.pull_from_db('../../data/raw_data/backup')
