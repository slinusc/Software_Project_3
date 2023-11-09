import requests
from pymongo import MongoClient


def get_canton(lat, lon):
    response = requests.get(f'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18&addressdetails=1')
    data = response.json()
    return data['address']['state']


def add_kanton_to_db(db_name, collection_name):
    client = MongoClient('mongodb://localhost:27017/')
    db = client[db_name]
    collection = db[collection_name]
    counter = 0
    
    for doc in collection.find():

        lat = float(doc['node']['lat'])  # String to float
        lon = float(doc['node']['lon'])
        canton = get_canton(lat, lon)
        collection.update_one({'_id': doc['_id']}, {'$set': {'node.canton': canton}})
        print(f"{counter}, added canton '{canton}' to document with id '{doc['_id']}'")
        counter += 1
    
    print("Cantons have been added to the database!")
    
    
if __name__ == '__main__':
    add_kanton_to_db('data_base_OSM', 'bicycle_amenities')