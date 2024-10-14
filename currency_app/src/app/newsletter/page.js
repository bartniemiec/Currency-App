'use client';
import React, {useState} from "react";
import CONSTANTS from "../properties"

export default function Form() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [status, setStatus] = useState('')

    const handleEmail = (event) => {
        setEmail(event.target.value);
      };

    const handleName = (event) => {
    setName(event.target.value);
    };

    const handleSurname = (event) => {
    setSurname(event.target.value);
    };

    const handleResponse = (response) => {
        switch (response.status){
            case 200:
                setStatus("Thanks for joining our newsletter!")
                break;
            case 201:
                setStatus("Name or email missing");
                break;
            case 202:
                setStatus("This email is already signed to our newsletter.");
                break;
            default:
                setStatus("Error code: " + response.status);
        }
    }

    const handleSubmit = () => {
        let data =
        {
            name : name,
            surname : surname,
            email : email
        }

        let request = new Request(CONSTANTS.domain + "/sign_newsletter", {
            method: 'post',
            mode: 'cors',
            redirect: 'follow',
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(data)
        })

            try
            {
                fetch(request)
                    .then(function(response) {
                        handleResponse(response)
                    })
            }
            catch(e)
            {

            }

    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="md:flex md:items-center">
        <form className="w-full max-w-sm">
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Name
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    id="inline-full-name"
                    type="text"
                    placeholder="Your name"
                    onChange={handleName}/>
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Surname
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="text"
                    placeholder="Your surname"
                    onChange={handleSurname}/>
                </div>
            </div>
            <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                        Email
                    </label>
                </div>
                <div className="md:w-2/3">
                    <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type="email"
                    placeholder="email@domain.com"
                    onChange={handleEmail}/>
                </div>
            </div>
            {status && (
                <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <span className="text-sm">{status}</span>
            </div>
            )}
            <div className="md:flex md:items-center">
                <div className="md:w-1/3"></div>
                <div className="md:w-2/3">
                <button
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={handleSubmit}>
                    Sign Up to Newsletter
                </button>
                </div>
            </div>
            </form>
        </div>
        <div className="md:flex md:items-center">
            <a href="http://localhost:3000">
                <h2 className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                Back to main page
                </h2>
            </a>
        </div>
      </main>
            )
}