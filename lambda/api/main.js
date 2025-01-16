import { latest }  from './routes/latest.js'
import { timeseries } from './routes/timeseries.js'
import { historical } from './routes/historical.js'
import HttpApi from './api.js'

const api = new HttpApi()

api.get("/latest", latest)
api.get("/timeseries", timeseries)
api.get("/historical", historical)

export const handler = async (event) => {
    return await api.resolve(event)
}