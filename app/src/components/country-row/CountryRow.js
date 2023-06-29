import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import './CountryRow.css'

export const CountryRow = (props) => {
    const img_src = "flags/" + props.code + ".png"
    const upTrend = !(props.change < 0)

    return (
        <div id="country-row">
            <div className="info flag">
                <img src={img_src}/>
            </div>

            <div className="info country">
                <p>{props.country}</p>
            </div>

            <div className="info rate">
                <p>{props.rate} &euro;</p>
            </div>

            <div className={"info change " + (upTrend ? "up" : "down")}>
                <p>{props.change} %</p>
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