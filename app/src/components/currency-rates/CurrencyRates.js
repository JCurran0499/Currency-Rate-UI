import { CountryRow } from '../country-row/CountryRow'
import { useState, useEffect } from 'react'
import { makeRequest } from '../../util/services'
import './CurrencyRates.css'

export const CurrencyRates = () => {
    const [countries, handleCountries] = useState({})
    const [rates, handleRates] = useState({})
    const [rows, handleRows] = useState([])


    const calculateChange = (country_code) => {
        const now = 1 / rates.now[country_code]
        const start = 1 / rates.start[country_code]
        let change = now - start
        change = (change / start) * 100
        return change
    }

    /* Waterfall Effect */
    /* Update countries > Update rates > Update HTML rows */

    useEffect(() => {
        makeRequest('/symbols')
            .then((resp) => handleCountries(resp.data))
    }, [])

    useEffect(() => {
        makeRequest('/rates')
            .then((resp) => handleRates(resp.data))
    }, [countries])

    useEffect(() => {
        let rows_new = []

        let r, k
        for (let country_code in rates.now) {
            k = rows_new.length
            r = <CountryRow 
                    key={k} 
                    code={country_code}
                    country={countries[country_code]}
                    rate={1 / rates.now[country_code]}
                    change={calculateChange(country_code)}
                />
            rows_new = [...rows_new, r]
        }

        handleRows(rows_new)
    }, [rates])

    return (
        <div id="currency-rates">
            <div className="rates-block left">
                {rows.slice(0, rows.length / 2)}
            </div>
            <div className="rates-block right">
                {rows.slice(rows.length / 2, rows.length)}
            </div>
        </div>
    )
}