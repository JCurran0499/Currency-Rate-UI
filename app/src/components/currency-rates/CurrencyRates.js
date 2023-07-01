import { CountryRow } from '../country-row/CountryRow'
import { Header } from '../header/Header'
import { useState, useEffect } from 'react'
import { makeRequest } from '../../util/services'
import './CurrencyRates.css'

export const CurrencyRates = () => {
    const [countries, handleCountries] = useState({})
    const [rates, handleRates] = useState({})
    const [rows, handleRows] = useState([])

    let symbols = []


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
        console.log('hello!')

        makeRequest('/rates')
            .then((resp) => handleRates(resp.data))
    }, [countries])

    useEffect(() => {
        for (let symbol in rates.now) {
            symbols = [...symbols, symbol]
        }
        console.log(symbols)

        let rows_new = []

        let code1, code2, r, k
        for (let i = 0; i < symbols.length; i += 2) {
            code1 = symbols[i]
            code2 = symbols[i + 1]
            k = rows_new.length
            r = <CountryRow 
                    key={k}
                    code={[code1, code2]}
                    country={[countries[code1], countries[code2]]}
                    rate={[1 / rates.now[code1], 1 / rates.now[code2]]}
                    change={[calculateChange(code1), calculateChange(code2)]}
                />
            rows_new = [...rows_new, r]
        }

        handleRows(rows_new)
    }, [rates])

    return (
        <div id="currency-rates">
            <Header/>
            {rows}
        </div>
    )
}