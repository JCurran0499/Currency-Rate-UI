import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { round } from '../../util/services'
import './CountryRow.css'

export const CountryRow = (props) => {
    const img_src = "flags/" + props.code + ".png"
    const upTrend = !(props.change < 0)

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
        <div id="country-row">
            <div className="info flag">
                <img src={img_src}/>
            </div>

            <div className="info code">
                <p>{props.code}</p>
            </div>

            <div className="info country">
                <p>{props.country}</p>
            </div>

            <div className="info rate">
                <p>{display(props.rate)} &euro;</p>
            </div>

            <div className={"info change " + (upTrend ? "up" : "down")}>
                <p>{display(props.change)} %</p>
            </div>

            <div className={"info arrow " + (upTrend ? "up" : "down")}>
                {(upTrend) && 
                    <AiOutlineArrowUp/>
                }
                {(!upTrend) &&
                    <AiOutlineArrowDown/>
                }
            </div>
        </div>
    )
}