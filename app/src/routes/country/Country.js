import { useParams } from "react-router-dom";
import './Country.css'

export const Country = () => {
    const params = useParams()

    return (
        <div id="Country">
            <img src={"flags/" + params.code + ".png"}/>
        </div>
    )
}