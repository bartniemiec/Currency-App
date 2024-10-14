from flask import Flask
from flask_pymongo import PyMongo
import requests
from flask_cors import cross_origin
import ast
from pymongo import MongoClient

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/nbp"
client = MongoClient("localhost", 27017)
mongo = PyMongo(app).db

@app.route("/currency/<currency>")
@cross_origin()
def get_currency(currency):
    header = {'Accept': 'application/json'}
    url=f"http://api.nbp.pl/api/exchangerates/rates/a/{currency}/"
    response = requests.get(url, headers=header).content.decode('UTF-8')
    currency_price = ast.literal_eval(response)
    return currency_price

@app.route("/currency_db/<currency>")
@cross_origin()
def get_currency_db(currency):
    database = client['nbp']
    kurs_sredni = database['kursy_srednie']
    dane = kurs_sredni.find({"code": currency})
    for i in dane:
        print(i)
        value = i["mid"]
        name = i["currency"]
        code = i["code"]

    return f'Nazwa waluty: {name} Skrót: {code} Średnia wartość:{value}'

@app.route("/currencies_names")
@cross_origin()
def get_currencies_names():
    return

@app.route("/currencies_json")
@cross_origin()
def currencies_json():
    header = {'Accept': 'application/json'}
    url="http://api.nbp.pl/api/exchangerates/tables/a"
    currencies_json = requests.get(url, headers=header).content.decode('UTF-8')
    try:
        rates = ast.literal_eval(currencies_json)[0]['rates']
    except:
        rates = "Brak danych"
    return rates

@app.route("/currencies_json_db")
@cross_origin()
def currencies_json_db():
    #database = client['nbp']
    tableA = mongo['tableA']
    aa = tableA.find({"code": "USD"})
    print(aa)
    for i in aa:
        print(i)
    return str(i)

app.run(debug=True)