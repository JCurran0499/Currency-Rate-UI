import { CountryRow } from '../country-row/CountryRow'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './CurrencyRates.css'

export const CurrencyRates = () => {

    const [rates, handleRates] = useState({})
    const [rows, handleRows] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: 'https://x7d34ehwne.execute-api.us-east-1.amazonaws.com/rates'
        })
        .then((resp) => handleRates(resp.data))
    }, [])

    useEffect(() => {
        let rows_new = []

        let r, k
        for (let country in rates) {
            k = rows_new.length
            r = <CountryRow key={k} code={country} rate={rates[country]} change={1}/>
            rows_new = [...rows_new, r]
        }

        handleRows(rows_new)
    }, [rates])

    return (
        <div id="currency-rates">
            {rows}
        </div>
    )
}