import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { useState } from 'react'
import { Navigate } from "react-router-dom"
import { round } from '../../util/services'
import './CountryRow.css'

export const CountryRow = (props) => {
    const img_srcs = ["flags/" + props.code[0] + ".png", "flags/" + props.code[1] + ".png"]
    const upTrends = [!(props.change[0] < 0), !(props.change[1] < 0)]

    const display = (n) => {
        let d = 2
        let n_display = round(n, d)
        while (n_display === 0 && d < 8) {
            d += 1
            n_display = round(n, d)
        }

        return n_display
    }

    const Country = (props) => {
        const [redirect, handleRedirect] = useState(false)
        
        return (
            <div id="country" className={props.className}>
                {redirect && (
                    <Navigate to={"/" + props.code}/>
                )}
                <div className="info flag">
                    <button onClick={() => handleRedirect(true)}>
                        <img src={props.img_src}/>
                    </button>
                </div>

                <div className="info code">
                    <p>{props.code}</p>
                </div>

                <div className="info name">
                    <p>{props.country}</p>
                </div>

                <div className="info rate">
                    <p>{display(props.rate)} &euro;</p>
                </div>

                <div className={"info change " + (props.upTrends ? "up" : "down")}>
                    <p>{display(props.change)} %</p>
                </div>

                <div className={"info arrow " + (props.upTrends ? "up" : "down")}>
                    {(props.upTrends) && 
                        <AiOutlineArrowUp/>
                    }
                    {(!props.upTrends) &&
                        <AiOutlineArrowDown/>
                    }
                </div>
            </div>
        )
    }

    return (
        <div id="country-row">
            <Country 
                className={"left " + props.code[0]}
                img_src={img_srcs[0]}
                code={props.code[0]}
                country={props.country[0]}
                rate={props.rate[0]}
                change={props.change[0]}
                upTrends={upTrends[0]}
            />
            <Country 
                className={"right " + props.code[1]}
                img_src={img_srcs[1]}
                code={props.code[1]}
                country={props.country[1]}
                rate={props.rate[1]}
                change={props.change[1]}
                upTrends={upTrends[1]}
            />
        </div>
    )
}