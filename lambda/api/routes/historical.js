import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const dynamodb = new DynamoDBClient()
const BLOCK = 50

const formatDate = (date) => {
    return date.toISOString().slice(0, 10)
}

const getRecords = async (dates, code) => {
    console.info("Fetching historical records!")

    const resp = await dynamodb.send(new BatchGetItemCommand({
        RequestItems: {
            [process.env.HISTORY_TABLE_NAME]: {
                Keys: dates.map((ts) => {
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

    return resp.Responses[process.env.HISTORY_TABLE_NAME].map(unmarshall).sort(
        (ts1, ts2) => ts1.timestamp.localeCompare(ts2.timestamp)
    )
}

export const historical = async (req) => {
    console.info("Fetching historical currency data...")

    const start = new Date(Date.parse(req.parameters.start))
    const end = new Date(Date.parse(req.parameters.end))
    const code = req.parameters.code
    const period = Number(req.parameters.period || '1')

    let dates = []
    while (start.getTime() <= end.getTime()) {
        dates.push(formatDate(start))
        start.setDate(start.getDate() + period)
    }

    console.log(dates)

    const promises = []
    while (dates.length > BLOCK) {
        promises.push(
            getRecords(dates.slice(0, BLOCK), code)
        )
       dates = dates.slice(BLOCK)
    }
    promises.push(
        getRecords(dates, code)
    )

    return (await Promise.all(promises)).flat()
}
