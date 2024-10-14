from flask_pymongo import PyMongo
from flask import current_app, g

def init_app(app):
    init_db()

def init_db():
    g.db = PyMongo(current_app).db

def get_db():
    db = PyMongo(current_app).db
    g.db = db
    return db