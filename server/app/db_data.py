from flask import Blueprint, flash, request
from flask_cors import cross_origin
from .db import get_db

db_data= Blueprint('db_data', __name__)

@db_data.route("/currency_db/<currency>")
@cross_origin()
def get_currency_db(currency):
    database = get_db()
    kurs_sredni = database['kursy_srednie']
    dane = kurs_sredni.find({"code": currency})[0]
    data ={
        "code":dane["code"],
        "currency":dane["currency"],
        "rates": [
            {
                "mid":dane["mid"]
            }
        ]
    }
    return data

@db_data.route("/currencies_names_db")
@cross_origin()
def get_names_db():
    database = get_db()
    names = database['nazwy_walut'].find({})
    names_ls = []
    for name in names:
        names_ls.append(name["code"])
    return names_ls

@db_data.route("/currency_bid_db/<currency>")
@cross_origin()
def currency_bid_db(currency):
    database = get_db()
    dane = database["kursy_kup_sprzedaz"].find({"code": currency})[0]
    data ={
        "code":dane["code"],
        "currency":dane["currency"],
        "rates": [
            {
                "bid":dane["bid"],
                "ask":dane["ask"]
            }
        ]
    }
    return data

@db_data.route("/currencies_json_db")
@cross_origin()
def currencies_json_db():
    database = get_db()
    kurs_sredni = database['kursy_srednie']
    dane = kurs_sredni.find({})
    data = []
    for dana in dane:
        element = {
            "code":dana["code"],
            "currency":dana["currency"],
            "rates": [
                {
                    "mid":dana["mid"]
                }
            ]
        }
        data.append(element)

    return data

@db_data.route("/sign_newsletter", methods=(['POST']))
@cross_origin()
def sign_to_newsletter():
    if 'name' in request.json and 'email' in request.json:
        name = request.json['name']
        surname = request.json['surname']
        email = request.json['email']
    else:
        return {}, 201
    database = get_db()
    error = None

    if "@" not in email:
        error = 'Invalid email'
        return {}, 201

    if error is None:
        exists_test = database['newsletter'].find_one({"email": email})
        if exists_test is not None:
            error = f'Email {email} is already registrered'
        else:
            database['newsletter'].insert_one({'name': name,
                                    'surname': surname,
                                    'email': email})
            return {}, 200
    print(error)
    return {}, 202
