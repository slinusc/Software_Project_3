from flask import Flask, render_template, request, jsonify
from flask_caching import Cache

# Import der Funktionen aus dem pycode-Modul
from pycode.mongoDB_queries import number_amenities_in_radius, find_k_nearest_amenities, count_amenities_by_canton, \
    fetch_amenities_from_db, get_bike_ways_for_all_gemeinden

# Flask app setup
app = Flask(__name__)
app.config['CACHE_TYPE'] = 'simple'
cache = Cache(app)


# Routes
@cache.cached(timeout=300)
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/locations', methods=['POST'])
def get_locations():
    data = request.get_json()
    amenities = data.get('amenities')

    if not amenities:
        return jsonify({"error": "amenities parameter is required"}), 400

    results = fetch_amenities_from_db(amenities)
    return jsonify(results)


@app.route('/amenities_per_canton', methods=['POST'])
def get_amenities_per_canton():
    data = request.get_json()
    amenity_type = data.get('amenity_type')

    if not amenity_type:
        return jsonify({"error": "amenity_type parameter is required"}), 400

    results = count_amenities_by_canton(amenity_type)
    return jsonify(results)


@app.route('/nearest_amenities', methods=['POST'])
def get_nearest_amenities():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    amenity_type = data.get('amenity_type')
    k = data.get('k', 5)

    if not lat or not lon or not amenity_type:
        return jsonify({"error": "lat, lon and amenity_type parameters are required"}), 400

    results = find_k_nearest_amenities(lat, lon, amenity_type, k)
    return jsonify(results)


@app.route('/number_amenities_in_radius', methods=['POST'])
def get_number_amenities_in_radius():
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    radius = data.get('radius', 1000)

    if not lat or not lon:
        return jsonify({"error": "lat and lon parameters are required"}), 400

    results = number_amenities_in_radius(lat, lon, radius)
    return jsonify(results)

@app.route('/bike_ways', methods=['POST'])
def get_bike_ways():
    results = get_bike_ways_for_all_gemeinden()
    return jsonify(results)


@app.route('/clear_cache', methods=['GET'])
def clear_cache():
    cache.clear()
    return "Cache has been cleared!", 200


if __name__ == '__main__':
    app.run(debug=True)