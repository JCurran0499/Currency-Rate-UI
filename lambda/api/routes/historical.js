import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { adjustHours, formatTimestamp } from '../util/util.js'

const dynamodb = new DynamoDBClient()
const BLOCK = 50

const getRecords = async (timestamps, code) => {
    console.info("Fetching records!")

    const request = {
        RequestItems: {}
    }
    request.RequestItems[process.env.TABLE_NAME] = {
        Keys: timestamps.map((ts) => {
            return {
                timestamp: {S: ts},
                base: {S: 'EUR'}
            }
        }),
        ProjectionExpression: '#t, #b, ' + code,
        ExpressionAttributeNames: {
            '#t': 'timestamp',
            '#b': 'base'
        }
    }

    const resp = await dynamodb.send(new BatchGetItemCommand(request))
    return resp.Responses[process.env.TABLE_NAME].map(unmarshall).sort((ts1, ts2) => ts1.timestamp.localeCompare(ts2.timestamp))
}

export const historical = async (req) => {
    console.info("Fetching historical currency data...")

    const start = new Date(Date.parse(req.parameters.start))
    const end = new Date(Date.parse(req.parameters.end))
    const code = req.parameters.code
    const period = Number(req.parameters.period || '1')

    adjustHours(start, 1)

    let timestamps = []
    while (start.getTime() <= end.getTime()) {
        timestamps.push(formatTimestamp(start))
        start.setHours(start.getHours() + (period * 3))
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
