from flask import Flask
from .requests_apis import requests_apis
from .db_data import db_data
from .db import init_app

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/nbp"

    with app.app_context():
        init_app(app)

    app.register_blueprint(db_data)
    app.register_blueprint(requests_apis)



    return app
