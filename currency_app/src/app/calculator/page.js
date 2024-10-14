'use client';
import React, {useState, useEffect} from "react";
import CONSTANTS from "../properties"

const Alert = ({ message, onClose }) => (
    <div className="fixed top-0 right-0 mt-8 mr-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );

export default function Calculator() {
    const [availableCurrencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedCurrency2, setSelectedCurrency2] = useState("");
    const [message1, setMessage1] = useState("");
    const [message2, setMessage2] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
      requestCurrencies();
    }, []);

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

    const handleClick = () => {
        if (message1.trim() !== "") {
          if (!isNaN(message1)){
            const selectedCurrency1Info = availableCurrencies.find(currency => currency.code === selectedCurrency);
            const selectedCurrency2Info = availableCurrencies.find(currency => currency.code === selectedCurrency2);

            const exchangeRatePLN1 = selectedCurrency1Info?.mid || 1;
            const exchangeRatePLN2 = selectedCurrency2Info?.mid || 1;

            const amountInPLN = parseFloat(message1) * exchangeRatePLN1;

            const convertedValue = amountInPLN / exchangeRatePLN2;
            setMessage2(convertedValue.toFixed(2));

          }
          else{
            setAlertMessage("Please enter the numerical value!");
            setShowAlert(true);
          }
        }
      };

    useEffect(() => {
        if (showAlert) {
          const timeoutId = setTimeout(() => {
            setShowAlert(false);
          }, 5000);
    
          // Clear the timeout when the component unmounts or when showAlert changes
          return () => clearTimeout(timeoutId);
        }
      }, [showAlert]);

      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-200">
          <div className="bg-white p-8 rounded-md shadow-md text-center">
          <h1 className="text-3xl font-bold mb-6">Currency Calculator</h1>
            {/* Input 1 */}
            <div className="flex flex-col items-start mb-4 relative">
              <label htmlFor="your_price" className="block text-sm font-medium leading-6 text-gray-900">
                Price
              </label>

              <div className="relative mt-2 rounded-md shadow-sm flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>

                <input
                  type="text"
                  name="your_price"
                  id="your_price"
                  value={message1}
                  onChange={(event) => setMessage1(event.target.value)}
                  className="block w-full lg:w-64 rounded-md border-0 py-1.5 pl-7 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0.00"
                  style={{ width: 'calc(100% - 34px)' }}
                />

                <div className="mt-2 ml-2">
                  <label htmlFor="currency" className="sr-only">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={selectedCurrency}
                    onChange={(event) => setSelectedCurrency(event.target.value)}
                    className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  >
                    {Object.keys(availableCurrencies).map((currencyKey) => {
                      const currency = availableCurrencies[currencyKey];
                      return (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <button
                  disabled={!message1}
                  className="bg-blue-500 text-white font-bold py-1.5 px-4 border-b-4 border-blue-700 rounded ml-2"
                  onClick={handleClick}
                >
                  Convert
                </button>
              </div>
            </div>

            {/* Input 2 */}
            <div className="flex flex-col items-start mb-4 relative">
        <label htmlFor="converted_price" className="block text-sm font-medium leading-6 text-gray-900">
          Converted Price
        </label>
        <div className="flex items-center">
          <input
            type="text"
            name="converted_price"
            id="converted_price"
            value={message2}
            className="block w-full lg:w-64 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0.00"
            readOnly
            style={{ width: 'calc(100% - 144px)' }} // Set a fixed width
          />
          <select
            id="currency2"
            name="currency2"
            value={selectedCurrency2}
            onChange={(event) => setSelectedCurrency2(event.target.value)}
            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-2 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            style={{ width: 'calc(50% - 118px)', marginLeft: '6px' }}
          >
            {Object.keys(availableCurrencies).map((currencyKey) => {
              const currency = availableCurrencies[currencyKey];
              return (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              );
            })}
          </select>
        </div>
              {showAlert && <Alert message={alertMessage} />}
            </div>
          </div>
        </main>
      );
}