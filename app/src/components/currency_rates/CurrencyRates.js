import { Country } from '../country/Country'
import { Header } from '../header/Header'
import { Menu } from '../menu/Menu'
import { useState, useEffect } from 'react'
import { formatData, calculateChange } from '../../util/services'
import { symbols, codes } from '../../util/constants'
import './CurrencyRates.css'

export const CurrencyRates = (props) => {
    const [rows, handleRows] = useState([])
    const [displayInBaseCurrency, handleDisplayInBaseCurrency] = useState(true)
    const [base, handleBase] = useState("USD")

    useEffect(() => {
        if (props.rates.now !== undefined) {
            const rates = formatData(props.rates, base, displayInBaseCurrency)
            let rows_new = []
            let code1, code2, r, k
            for (let i = 0; i < codes.length; i += 2) {
                code1 = codes[i]
                code2 = codes[i + 1]

                k = rows_new.length
                r = 
                <div key={k}>
                    <Country
                        className={"left " + code1}
                        img_src={"flags/" + code1 + ".png"}
                        code={code1}
                        country={symbols[code1]}
                        rate={rates.now[code1]}
                        change={calculateChange(rates, code1)}
                        includeSymbol={displayInBaseCurrency}
                        base={base}
                    />
                    <Country
                        className={"right " + code2}
                        img_src={"flags/" + code2 + ".png"}
                        code={code2}
                        country={symbols[code2]}
                        rate={rates.now[code2]}
                        change={calculateChange(rates, code2)}
                        includeSymbol={displayInBaseCurrency}
                        base={base}
                    />
                </div>
                rows_new = [...rows_new, r]
            }

            handleRows(rows_new)
        }
    }, [props.rates, base, displayInBaseCurrency])

    return (
        <div id="currency-rates">
            <Header/>
            <Menu
                toggle={() => handleDisplayInBaseCurrency(!displayInBaseCurrency)}
                select={(e) => handleBase(e.target.value)}
            />
            {rows}
        </div>
    )
}