from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['osm']

@app.route('/data/<some_query_parameter>', methods=['GET'])
def get_data(some_query_parameter):
    # Je nach Anforderung Daten aus MongoDB abfragen
    data = db.my_collection.find({"some_field": some_query_parameter})

    # Die Daten aus MongoDB in ein geeignetes Format umwandeln
    data_list = list(data)

    # Daten als JSON an den Client senden
    return jsonify(data_list)


if __name__ == '__main__':
    app.run(debug=True)
