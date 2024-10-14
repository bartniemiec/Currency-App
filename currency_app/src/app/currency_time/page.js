'use client';
import React, {useState, useEffect} from "react";
import { Chart } from "chart.js";
import CONSTANTS from "../properties"

import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export default function Test() {

    const MIN_DATE = new Date("2002-01-02")
    const MAX_DATE = new Date()

    const [currencies, setCurrencies] = useState([]);
    const [main_currency, setMainCurrency] = useState("PLN");
    const [transfer_currency, setTransferCurrency] = useState("USD");

    const [start_date, setStartDate] = useState(new Date("2023-01-01"));
    const [end_date, setEndDate] = useState(new Date("2024-01-01"));
    const [chart_data, setChartData] = useState({labels: [], data: []});


    //wykonuje funkcję tylko raz przy załadowaniu strony
    useEffect(() => {
        requestCurrencies();
      }, []);

    // aktualizacja wykresu
    useEffect(() => {
      if (start_date && end_date && transfer_currency && main_currency){
        fetch(CONSTANTS.domain + "/currency/" + "usd" + "/" + dateToString(start_date) + "/" + dateToString(end_date)).then(res => res.json())
        .then(data_usd => {
            console.log("data_usd:", data_usd);
            const labels = data_usd.map(item => item.effectiveDate);

            const get_currency_data = (currency, start_date, end_date) => {
                if (currency === "PLN") return [];
                return fetch(CONSTANTS.domain + "/currency/" + currency.toLowerCase() + "/" + dateToString(start_date) + "/" + dateToString(end_date)).then(res => res.json())
                .catch(error => {console.error("Błąd podczas pobierania danych waluty: ", error); return null})
            };

            let promises = [];
            promises.push(get_currency_data(transfer_currency, start_date, end_date));
            promises.push(get_currency_data(main_currency, start_date, end_date));

            Promise.all(promises)

            .then(([data_transfer, data_main]) => {

                if (!data_transfer || !data_main){
                    console.error("")
                    return
                }
                const values = labels.map((label, index) => {
                    const transfer_rate = Number(data_transfer[index]?.mid || 1);
                    const main_rate = Number(data_main[index]?.mid || 1);
                    return transfer_rate/main_rate;
                });

                setChartData({labels, data: values});
            })
        })
        .catch(error => console.error("Błąd podczas pobierania danych: ", error));
      }
    },  [start_date, end_date, transfer_currency, main_currency]);

    //tworzy wykres
    useEffect(() => {
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chart_data.labels,
                datasets: [{
                    data: chart_data.data,
                    label: "Cena " + transfer_currency + " w " + main_currency,
                    borderColor: "rgb(109, 253, 181)",
                    backgroundColor: "rgb(109, 253, 181,0.5)",
                    borderWidth: 2,
                    pointRadius: 3

                }
                ]
            },
        });
        //alert(chart_data.data)
        return () => {myChart.destroy();};
    },[chart_data]);


    // tworzenie listy wszystkich walut
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

    const dateToString = (date) => {
        return date.toISOString().split('T')[0]
    }

    const handleMainCurrencyChange = (event) => {
        setMainCurrency(event.target.value);
      };

    const handleTransferCurrencyChange = (event) => {
        setTransferCurrency(event.target.value);
    }

    const validateDate = (date, min_date=MIN_DATE, max_date=MAX_DATE) => {
        if (date <= min_date) return min_date;
        if (date >= max_date) return max_date;
        return date;
    };


    const handlerStartDateChange = (date) => {
        let validatedDate = validateDate(date);
        setStartDate(validatedDate);

        let startDateAsDate = new Date(validatedDate)
        startDateAsDate.setFullYear(startDateAsDate.getFullYear() + 1)

        let validatedEndDate = validateDate(end_date, validatedDate, startDateAsDate)
        setEndDate(validatedEndDate);
    }


    const handlerEndDateChange = (date) => {
        let validatedDate = validateDate(date);
        setEndDate(validatedDate);

        let endDateAsDate = new Date(validatedDate)
        endDateAsDate.setFullYear(endDateAsDate.getFullYear() - 1)

        let validatedStartDate = validateDate(start_date, endDateAsDate, validatedDate)

        setStartDate(validatedStartDate);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="w-[750px] mx-auto mt-10 text-xl font-semibold">Podaj walutę, której chcesz sprawdzić historię w zależności od innej waluty:</h1>
        <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm lg:flex">
            <select id="currency_to_transfer"
            value={transfer_currency}
            style={{textAlign:'center'}}
            onChange={handleTransferCurrencyChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option key="PLN" value="PLN">PLN</option>
                {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                    {currency.code}
                </option>
                ))}
            </select>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <select id="main_currency"
            value={main_currency}
            style={{textAlign:'center'}}
            onChange={handleMainCurrencyChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option key="PLN" value="PLN">PLN</option>
                {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                    {currency.code}
                </option>
                ))}
            </select>
        </div>
        <div>
        <h1 className="500px mx-auto mt-10 text-xl font-semibold">Podaj widełki dat (maksymalny odstęp czasu - rok):</h1>
          <div style={{textAlign:'center'}}>
                <DatePicker dateFormat="dd.MM.yyyy" selected={start_date} onChange={handlerStartDateChange}/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <DatePicker dateFormat="dd.MM.yyyy" selected={end_date} onChange={handlerEndDateChange}/>
          </div>

        </div>
        <br/>
            <div className="w-[1100px] h-screen flex mx-auto">
                <div className='border border-gray-400 pt-0 rounded-xl  w-full h-fit shadow-xl'>
                    <canvas id='myChart'></canvas>
                </div>
            </div>
      </main>
            )
        }


//onBlur={handlerStartDateChange}
//onBlur={handlerEndDateChange}
//onChange={handlerStartDateChange}
//onChange={handlerEndDateChange}

//<input type = "date" value = {start_date} min={MIN_DATE} max={MAX_DATE} />
//<input type = "date" value = {end_date} min={MIN_DATE} max={MAX_DATE}/>

//<input type = "date" value = {start_date} min={MIN_DATE} max={MAX_DATE} onBlur={handlerStartDateBlur} onChange={handlerStartDateChange}/>
//<input type = "date" value = {end_date} min={MIN_DATE} max={MAX_DATE} onBlur={handlerEndDateBlur} onChange={handlerEndDateChange}/>
//<ReactDatePicker selected={start_date}/>
//<ReactDatePicker selected={end_date}/>

//onSelect={handlerStartDateChange}
//onSelect={handlerEndDateChange}
//onSelect={handlerEndDateChange}
