import { CountryRow } from '../country-row/CountryRow'
import { Header } from '../header/Header'
import { useState, useEffect } from 'react'
import { makeRequest, calculateChange } from '../../util/services'
import { symbols, codes } from '../../util/constants'
import './CurrencyRates.css'

export const CurrencyRates = () => {
    const [rates, handleRates] = useState({})
    const [rows, handleRows] = useState([])


    /* Waterfall Effect */
    /* Update rates > Update HTML rows */

    useEffect(() => {
        makeRequest('/latest')
            .then((resp) => handleRates(resp.data))
    }, [])

    useEffect(() => {
        if (rates.now !== undefined) {
            let rows_new = []

            let code1, code2, r, k
            for (let i = 0; i < codes.length; i += 2) {
                code1 = codes[i]
                code2 = codes[i + 1]
                k = rows_new.length
                r = <CountryRow 
                        key={k}
                        code={[code1, code2]}
                        country={[symbols[code1], symbols[code2]]}
                        rate={[1 / rates.now[code1], 1 / rates.now[code2]]}
                        change={[calculateChange(rates, code1), calculateChange(rates, code2)]}
                    />
                rows_new = [...rows_new, r]
            }

            handleRows(rows_new)
        }
    }, [rates])

    return (
        <div id="currency-rates">
            <Header/>
            {rows}
        </div>
    )
}