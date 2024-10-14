import requests
from pymongo import MongoClient


client = MongoClient("localhost", 27017)
client.drop_database("nbp")
db = client.nbp
collection_zloto = db.zloto
collection_rate = db.rate
collection_kursy_srednie = db.kursy_srednie
collection_kursy_kup_sprzedaz = db.kursy_kup_sprzedaz
collection_currencies_names = db.nazwy_walut


urls = {

    'tables':   'http://api.nbp.pl/api/exchangerates/tables/{table}/',
    'tables_date_start_end': "http://api.nbp.pl/api/exchangerates/tables/{table}/{startDate}/{endDate}/",
    'rates':    'http://api.nbp.pl/api/exchangerates/rates/{table}/{code}',
    'cenyzlota': 'http://api.nbp.pl/api/cenyzlota/',
    'cenyzlota_date_start_end': 'http://api.nbp.pl/api/cenyzlota/{startDate}/{endDate}'

}

def getCenazlota():
    r = requests.get(urls['cenyzlota']).json()
    return r#r[0]['data'], r[0]['cena']

def getRates(table, code):
    r = requests.get(urls['rates'].format(table=table, code=code)).json()
    return r#r['rates'][0]['effectiveDate'], r['rates'][0]['mid']

def getTables(table):
    r = requests.get(urls['tables'].format(table=table)).json()
    return r

def getNames():
    names =[{"code":"THB"}, {"code":"USD"}, {"code":"AUD"}, {"code":"HKD"}, {"code":"CAD"}, {"code":"NZD"}, {"code":"SGD"},
            {"code":"EUR"}, {"code":"HUF"}, {"code":"CHF"}, {"code":"GBP"}, {"code":"UAH"}, {"code":"JPY"}, {"code":"CZK"},
            {"code":"DKK"}, {"code":"ISK"}, {"code":"NOK"}, {"code":"SEK"}, {"code":"RON"}, {"code":"BGN"}, {"code":"TRY"},
            {"code":"ILS"}, {"code":"CLP"}, {"code":"PHP"}, {"code":"MXN"}, {"code":"ZAR"}, {"code":"BRL"}, {"code":"MYR"},
            {"code":"IDR"}, {"code":"INR"}, {"code":"KRW"}, {"code":"CNY"}, {"code":"XDR"}]
    return names

def getTablesDateStartEnd(table, startDate, endDate):
    r = requests.get(urls['tables_date_start_end'].format(table=table, startDate=startDate, endDate=endDate)).json()
    return r

def getCenazlotaDateStartEnd(startDate, endDate):
    r = requests.get(urls['cenyzlota_date_start_end'].format(startDate=startDate, endDate=endDate)).json()
    return r


tableA = getTables('A')
tableB = getTables('B')

result1 = collection_kursy_srednie.insert_many(tableA[0]['rates'])
result2 = collection_kursy_srednie.insert_many(tableB[0]['rates'])

kursy_kup_sprzedaz = getTables('C')
result3 = collection_kursy_kup_sprzedaz.insert_many(kursy_kup_sprzedaz[0]['rates'])

cena_zlota = getCenazlota()
result = collection_zloto.insert_one(cena_zlota[0])

nazwy = getNames()
result4 = collection_currencies_names.insert_many(nazwy)



