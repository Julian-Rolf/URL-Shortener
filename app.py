from urllib.parse import non_hierarchical
from bson.objectid import ObjectId
from flask import Flask, request, abort, redirect
from flask_pymongo import PyMongo
import pymongo
import os

from pymongo.write_concern import WriteConcern

db_password = os.getenv('MONGODB_PASSWORD')

app = Flask(__name__)
app.config["MONGO_URI"] = f"mongodb+srv://admin:{db_password}@cluster0.lne4v.mongodb.net/URL-Shortener?retryWrites=true&w=majority/shortener"
client = PyMongo(app)
collection = client.db.main.with_options(
    write_concern=WriteConcern(w=2, wtimeout=6000))


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return 'Hello world'

    if request.method == 'POST':
        url = request.get_json()['url']
        id = collection.insert_one({"url": url}).inserted_id
        return f'http://127.0.0.1:5000/url/{id}'


@app.route('/url/<id>', methods=['GET'])
def getUrl(id):
    try:
        record = collection.find_one({"_id": id})
        return redirect(record["url"])
    except:
        abort(404)


if __name__ == '__main__':
    app.run(debug=True)
