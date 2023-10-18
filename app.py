from flask import Flask, render_template, request, jsonify
from flask_caching import Cache
from pymongo import MongoClient

# Flask app setup
app = Flask(__name__)
app.config['CACHE_TYPE'] = 'simple'
cache = Cache(app)

# MongoDB setup
client = MongoClient('localhost', 27017)
db = client['data_base_OSM']


# Routes
@app.route('/')
@cache.cached(timeout=300)
def index():
    return render_template('index.html')


@cache.memoize(300)  # Zwischenspeichern des Ergebnisses für 300 Sekunden (5 Minuten)
def fetch_amenities_from_db(amenities):
    locations = db.bicycle_amenities.find({"amenity": {"$in": amenities}})
    results = [{
        "id": loc["node"]["id"],
        "lat": loc["node"]["lat"],
        "lon": loc["node"]["lon"],
        "name": loc["node"].get("name", "")
    } for loc in locations]
    return results


@app.route('/locations', methods=['POST'])
def get_locations():
    data = request.get_json()
    amenities = data.get('amenities')

    if not amenities:
        return jsonify({"error": "amenities parameter is required"}), 400

    results = fetch_amenities_from_db(amenities)

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
