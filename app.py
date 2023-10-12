from flask import Flask, render_template, request, jsonify, json
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['data_base_OSM']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/locations', methods=['POST'])
def get_locations():
    data = request.get_json()
    amenities = data.get('amenities')

    if not amenities:
        return jsonify({"error": "amenities parameter is required"}), 400

    locations = db.bicycle_amenities.find({"amenity": {"$in": amenities}})

    results = [{
        "id": loc["node"]["id"],
        "lat": loc["node"]["lat"],
        "lon": loc["node"]["lon"],
        "name": loc["node"].get("name", "")
    } for loc in locations]

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
