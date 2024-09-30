import { useParams, Navigate } from 'react-router-dom'
import { symbols, codes } from '../../util/constants'
import { Line, LineChart, XAxis, YAxis } from 'recharts'
import './CountryPage.css'

export const CountryPage = () => {
    const params = useParams()

    const data = [
        {
          "name": "Page A",
          "pv": 2400,
        },
        {
          "name": "Page B",
          "pv": 1398,
        },
        {
          "name": "Page C",
          "pv": 9800,
        },
        {
          "name": "Page D",
          "pv": 3908,
        },
        {
          "name": "Page E",
          "pv": 4800,
        },
        {
          "name": "Page F",
          "pv": 3800,
        },
        {
          "name": "Page G",
          "pv": 4300
        }
    ]
      

    return (
        <div id="CountryPage">
            {(!codes.includes(params.code)) && (
                <Navigate to="/"/>
            )}
            <h1>{symbols[params.code]}</h1>
            <img src={"flags/" + params.code + ".png"} alt={params.code}/>

            <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={false} />
            </LineChart>
        </div>
    )
}