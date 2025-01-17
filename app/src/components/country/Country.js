import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { round } from '../../util/services'
import './Country.css'

export const Country = (props) => {
    const [redirect, handleRedirect] = useState(false)
    const [positiveTrend, handlePositiveTrend] = useState(false)

    const baseSymbols = {
        USD: <p> $</p>,
        EUR: <p> &euro;</p>,
        GBP: <p> &pound;</p>,
        JPY: <p> &yen;</p>,
        CNY: <p> &#20803;</p>
    }

    useEffect(() => {
        if (props.includeSymbol || props.change === 0) {
            handlePositiveTrend(!(props.change < 0))
        }
        else {
            handlePositiveTrend(props.change < 0)
        }
    }, [props.includeSymbol, props.change])

    const display = (n) => {
        let d = 2
        let n_display = round(n, d)
        while (n_display === 0 && d < 8) {
            d += 1
            n_display = round(n, d)
        }

        return n_display
    }
    
    return (
        <div id="country" className={props.className}>
            {redirect && (
                <Navigate to={"/" + props.code}/>
            )}
            <div className="info flag">
                <button onClick={() => handleRedirect(true)}>
                    <img src={props.img_src} alt={props.country}/>
                </button>
            </div>

            <div className="info code">
                <p>{props.code}</p>
            </div>

            <div className="info name">
                <p>{props.country}</p>
            </div>

            <div className="info rate">
                <p>{display(props.rate)}</p>
                {props.includeSymbol && baseSymbols[props.base]}
            </div>

            <div className={"info change " + (positiveTrend ? "up" : "down")}>
                <p>{display(props.change)} %</p>
            </div>

            <div className={"info arrow " + (positiveTrend ? "up" : "down")}>
                {(!(props.change < 0)) && 
                    <AiOutlineArrowUp/>
                }
                {(props.change < 0) &&
                    <AiOutlineArrowDown/>
                }
            </div>
        </div>
    )
}