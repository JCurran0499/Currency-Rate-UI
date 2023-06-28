import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import './CountryRow.css'

export const CountryRow = (props) => {
    const img_src = "flags/" + props.code + ".png"
    const upTrend = props.change > 0

    return (
        <div id="country-row">
            <img className="info" src={img_src}/>
            <p className="info rate">{props.rate} &euro;</p>
            <p className={"info " + (upTrend ? "up" : "down")}>{props.change} %</p>
            {(upTrend) && 
                <AiOutlineArrowUp className="info up"/>
            }
            {(!upTrend) &&
                <AiOutlineArrowDown className="info down"/>
            }
        </div>
    )
}