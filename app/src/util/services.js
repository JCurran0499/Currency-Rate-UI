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
