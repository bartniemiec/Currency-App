'use client';
import React, {useState, useEffect} from "react";
import { Chart } from "chart.js";
import CONSTANTS from "../properties"

export default function Test() {

    const [price, setPrice] = useState("");
    const [currencies, setCurrencies] = useState([]);
    const [main_currency, setMainCurrency] = useState("PLN");
    const [main_currency_price, setMainCurrencyPrice] = useState("0.00");
    const [transfer_currency, setTransferCurrency] = useState("USD");
    const [transfer_currency_price, setTransferCurrencyPrice] = useState("0.00");

    //wykonuje funkcję tylko raz przy załadowaniu strony
    useEffect(() => {
        requestCurrencies();
        requestSinglePrice();
      }, []);

    //wykonuje za każdym razem jak zmieni się wartość zmiennej main_currency
    useEffect(() => {
        if (main_currency !== "PLN"){
            fetch(CONSTANTS.domain + "/currency/" + main_currency.toLowerCase())
            .then(response => response.json())
            .then(data => setMainCurrencyPrice(data.rates[0].mid))
        }
        else{
            setMainCurrencyPrice("1.00")
        }
        requestSinglePrice();
      }, [main_currency]);

    //wykonuje za każdym razem jak zmieni się wartość zmiennej transfer_currency
    useEffect(() => {
        fetch(CONSTANTS.domain + "/currency/" + transfer_currency.toLowerCase())
        .then(response => response.json())
        .then(data => setTransferCurrencyPrice(data.rates[0].mid))
        requestSinglePrice();
    }, [transfer_currency]);

    //tworzy wykres
    useEffect(() => {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [main_currency, transfer_currency],
                datasets: [{
                    data: [main_currency_price, transfer_currency_price],
                    label: "Cena w PLN",
                    borderColor: "rgb(109, 253, 181)",
                    backgroundColor: "rgb(109, 253, 181,0.5)",
                    borderWidth: 2
                }
                ]
            },
            options: {
                scales: {
                  y: {
                    beginAtZero: true,
                    min : 0
                  }
                },
                interaction: {
                    intersect: false
                }
            },
        });
    }, [transfer_currency_price, main_currency_price])

    const requestPrice = (currency_name) => {
        return fetch(CONSTANTS.domain + "/currency/" + currency_name.toLowerCase())
        .then(response => response.json())
        .then(data => {return data.rates[0].mid})
        .catch(error => {
            console.error('Błąd podczas pobierania danych:', error)
        });
    }
    const requestSinglePrice = async () => {
        let first_price = await requestPrice(main_currency)
            .then(result => {
                return result
            })
        let second_price = await requestPrice(transfer_currency)
            .then(result => {
                return result
            })
        setPrice((Number(first_price)/Number(second_price)).toFixed(4));
    }

    const requestCurrencies = () => {
        let request = new Request(CONSTANTS.domain + "/currencies_json")
        try{
            fetch(request)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setCurrencies(data)
                })
        } catch(e) {

        }
    }

    const handleMainCurrencyChange = (event) => {
        setMainCurrency(event.target.value);
      };

    const handleTransferCurrencyChange = (event) => {
        setTransferCurrency(event.target.value);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <button
            onClick={requestSinglePrice}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sprawdź
            </button>
            <select
            id="main_currency"
            value={main_currency}
            onChange={handleMainCurrencyChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                    {currency.code}
                </option>
                ))}
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <select id="currency_to_transfer"
            value={transfer_currency}
            onChange={handleTransferCurrencyChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                    {currency.code}
                </option>
                ))}
            </select>
        </div>
        {/* Bar chart */}
        <h1 className="w-[400px] mx-auto mt-10 text-xl font-semibold capitalize ">1 {main_currency} do {transfer_currency} wynosi {price}</h1>
            <div className="w-[1100px]">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit my-auto '>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
      </main>
            )
        }