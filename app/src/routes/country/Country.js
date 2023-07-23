import { useParams, Navigate } from 'react-router-dom'
import { symbols, codes } from '../../util/constants'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import './Country.css'

export const Country = () => {
    const params = useParams()

    const data = [
        {
          "name": "Page A",
          "uv": 4000,
          "pv": 2400,
          "amt": 0
        },
        {
          "name": "Page B",
          "uv": 3000,
          "pv": 1398,
          "amt": 0
        },
        {
          "name": "Page C",
          "uv": 2000,
          "pv": 9800,
          "amt": 0
        },
        {
          "name": "Page D",
          "uv": 2780,
          "pv": 3908,
          "amt": 0
        },
        {
          "name": "Page E",
          "uv": 1890,
          "pv": 4800,
          "amt": 0
        },
        {
          "name": "Page F",
          "uv": 2390,
          "pv": 3800,
          "amt": 0
        },
        {
          "name": "Page G",
          "uv": 3490,
          "pv": 4300,
          "amt": 0
        }
    ]
      

    return (
        <div id="Country">
            {(!codes.includes(params.code)) && (
                <Navigate to="/"/>
            )}
            <h1>{symbols[params.code]}</h1>
            <img src={"flags/" + params.code + ".png"}/>

            <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" dot={false} />
            </LineChart>
        </div>
    )
}