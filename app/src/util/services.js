import axios from 'axios'
import { api_gateway_endpoint } from '../util/constants'

export const makeRequest = (route) => {
    return axios({
        method: 'get',
        url: api_gateway_endpoint + route
    })
}

export const round = (num, degree) => {
    const factor = Math.pow(10, degree)
    return Math.round(num * factor) / factor
}

export const calculateChange = (rates, country_code) => {
    const now = 1 / rates.now[country_code]
    const start = 1 / rates.start[country_code]
    let change = now - start
    change = (change / start) * 100
    return change
}
