from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['osm']

@app.route('/')
def test():
    return "Hello"


if __name__ == '__main__':
    app.run(debug=True)
