import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai'
import { round } from '../../util/services'
import './CountryRow.css'

export const CountryRow = (props) => {
    const img_srcs = ["flags/" + props.code[0] + ".png", "flags/" + props.code[1] + ".png"]
    const upTrends = [!(props.change[0] < 0), !(props.change[0] < 0)]

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
            <div className="country left">
                <div className="info flag">
                    <button>
                        <img src={img_srcs[0]}/>
                    </button>
                </div>

                <div className="info code">
                    <p>{props.code[0]}</p>
                </div>

                <div className="info name">
                    <p>{props.country[0]}</p>
                </div>

                <div className="info rate">
                    <p>{display(props.rate[0])} &euro;</p>
                </div>

                <div className={"info change " + (upTrends[0] ? "up" : "down")}>
                    <p>{display(props.change[0])} %</p>
                </div>

                <div className={"info arrow " + (upTrends[0] ? "up" : "down")}>
                    {(upTrends[0]) && 
                        <AiOutlineArrowUp/>
                    }
                    {(!upTrends[0]) &&
                        <AiOutlineArrowDown/>
                    }
                </div>
            </div>
            <div className="country right">
                <div className="info flag">
                    <button>
                        <img src={img_srcs[1]}/>
                    </button>
                </div>

                <div className="info code">
                    <p>{props.code[1]}</p>
                </div>

                <div className="info name">
                    <p>{props.country[1]}</p>
                </div>

                <div className="info rate">
                    <p>{display(props.rate[1])} &euro;</p>
                </div>

                <div className={"info change " + (upTrends[1] ? "up" : "down")}>
                    <p>{display(props.change[1])} %</p>
                </div>

                <div className={"info arrow " + (upTrends[1] ? "up" : "down")}>
                    {(upTrends[1]) && 
                        <AiOutlineArrowUp/>
                    }
                    {(!upTrends[1]) &&
                        <AiOutlineArrowDown/>
                    }
                </div>
            </div>
        </div>
    )
}