import { useParams, Navigate } from 'react-router-dom'
import { symbols, codes } from '../../util/constants'
import './Country.css'

export const Country = () => {
    const params = useParams()

    return (
        <div id="Country">
            {(!codes.includes(params.code)) && (
                <Navigate to="/"/>
            )}
            <img src={"flags/" + params.code + ".png"}/>
        </div>
    )
}