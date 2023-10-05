from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client['osm']

@app.route('/')
def index():
    return render_template('templates/index.html')

if __name__ == '__main__':
    app.run(debug=True)
