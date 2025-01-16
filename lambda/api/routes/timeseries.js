import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const dynamodb = new DynamoDBClient()
const BLOCK = 50

const formatTimestamp = (timestamp) => {
    return timestamp.toISOString().slice(0, 16) + "Z"
}

const getRecords = async (timestamps, code) => {
    console.info("Fetching timeseries records!")

    const resp = await dynamodb.send(new BatchGetItemCommand({
        RequestItems: {
            [process.env.TABLE_NAME]: {
                Keys: timestamps.map((ts) => {
                    return {
                        timestamp: {S: ts},
                        base: {S: 'USD'}
                    }
                }),
                ProjectionExpression: '#t, #b, ' + code,
                ExpressionAttributeNames: {
                    '#t': 'timestamp',
                    '#b': 'base'
                }
            }
        }
    }))

    return resp.Responses[process.env.TABLE_NAME].map(unmarshall).sort(
        (ts1, ts2) => ts1.timestamp.localeCompare(ts2.timestamp)
    )
}

export const timeseries = async (req) => {
    console.info("Fetching recent time series currency data...")

    const start = new Date(Date.parse(req.parameters.start))
    const end = new Date(Date.parse(req.parameters.end))
    const code = req.parameters.code
    const period = Number(req.parameters.period || '3')

    let timestamps = []
    while (start.getTime() <= end.getTime()) {
        timestamps.push(formatTimestamp(start))
        start.setHours(start.getHours() + period)
    }

    console.log(timestamps)

    const promises = []
    while (timestamps.length > BLOCK) {
        promises.push(
            getRecords(timestamps.slice(0, BLOCK), code)
        )
        timestamps = timestamps.slice(BLOCK)
    }
    promises.push(
        getRecords(timestamps, code)
    )

    return (await Promise.all(promises)).flat()
}
