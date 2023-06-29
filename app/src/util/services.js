import axios from 'axios'
import { api_gateway_endpoint } from '../util/constants'

export const makeRequest = (route) => {
    return axios({
        method: 'get',
        url: api_gateway_endpoint + route
    })
}

export const round = (num) => {
    return Math.round(num * 100) / 100
}
