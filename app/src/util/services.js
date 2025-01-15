import axios from 'axios'
import { api_gateway_endpoint, codes } from '../util/constants'

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

export const formatData = (rates, base, invert) => {
    const newRates = {
        now: {},
        start: {}
    }
    codes.forEach((code) => {
        newRates.now[code] = (invert) ? (rates.now[base] / rates.now[code]) : (rates.now[code] / rates.now[base])
        newRates.start[code] = (invert) ? (rates.start[base] / rates.start[code]) : (rates.start[code] / rates.start[base])
    })

    return newRates
}

export const calculateChange = (rates, country_code) => {
    const now = rates.now[country_code]
    const start = rates.start[country_code]
    let change = now - start
    change = (change / start) * 100
    return change
}
