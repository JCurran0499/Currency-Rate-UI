import { latest }  from './routes/latest.js'
import { historical } from './routes/historical.js'
import HttpApi from './api.js'

const api = new HttpApi()

api.get("/latest", latest)
api.get("/historical", historical)

export const handler = async (event) => {
    return api.resolve(event)
}