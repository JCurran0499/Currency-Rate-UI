import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const dynamodb = new DynamoDBClient()
const BLOCK = 50

export const historical = async (req) => {
    const start = new Date(Date.parse(req.parameters.start))
    const end = new Date(Date.parse(req.parameters.end))
    const code = req.parameters.code
    const period = req.parameters.period || 3

    while (![2, 5, 8, 11, 14, 17, 20, 23].includes(start.getHours()))
        start.setHours(start.getHours() + 1)

    let timestamps = []
    while (start.getTime() <= end.getTime()) {
        timestamps.push(start.toISOString().slice(0, 16) + "Z")
        start.setHours(start.getHours() + period)
    }

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

    const resp = (await Promise.all(promises)).flat()
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resp)
    }
}

const getRecords = async (timestamps, code) => {
    console.log("Fetching records!")
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
    return resp.Responses[process.env.TABLE_NAME].map(unmarshall)
}
