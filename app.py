from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['osm']

@app.route('/json/aa')
def test():
    return "{'node_id': 123}"

if __name__ == '__main__':
    app.run(debug=True)
