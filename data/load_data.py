import os
import json
from pymongo import MongoClient


def extract_amenity(name_input_file, amenity_list, name_output_file):
    if name_output_file + '.json' in os.listdir():
        print("Filtered data already exists!")
    else:
        with open(name_input_file + ".json", 'r') as file:
            data = json.load(file)

        individual_nodes = []

        for node in data['nodes']:
            amenity = node.get('amenity')
            if amenity in amenity_list:
                individual_nodes.append({'node': node, 'amenity': amenity})

        with open(name_output_file + '.json', 'w') as output_file:
            json.dump(individual_nodes, output_file, indent=2)

        print("Filtered data has been written to 'amenity_filtered.json'")


def load_mongo_db(file_name, db_name, collection_name):
    try:
        client = MongoClient('localhost', 27017)
        db = client[db_name]
        collection = db[collection_name]

        # JSON-Daten aus einer Datei lesen
        with open(file_name + '.json', 'r') as file:
            data = json.load(file)

        if isinstance(data, list):
            collection.insert_many(data)
        else:
            collection.insert_one(data)
        print("Data has been loaded to MongoDB!")

    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == '__main__':
    amenities = ["bicycle_parking", "bicycle_rental", "bicycle_repair_station", "compressed_air", "dinking_water"]
    extract_amenity('osm-output', amenities, 'amenity_filtered')
    load_mongo_db('amenity_filtered', 'data_base_OSM', 'bicycle_amenities')
