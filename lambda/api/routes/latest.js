import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'
import { adjustHours, formatTimestamp } from '../util/util.js'

const dynamodb = new DynamoDBClient()

const transformData = (itemNow, itemStart) => {
    const data = {
        now: {},
        start: {}
    }

    for (let code in itemNow) {
        if (!['timestamp', 'base', 'ts'].includes(code)) {
            data.now[code] = itemNow[code]['N']
            data.start[code] = itemStart[code]['N']
        }
    }

    return data
}

export const latest = async (req) => {
    console.info("Fetching latest currency data...")

    const offset = Number(req.parameters?.offset || '8')

    const start = new Date()
    if (start.getMinutes() <= 5) {
        start.setHours(start.getHours() - 1)
    }
    adjustHours(start, -1)

    start.setMinutes(0)
    start.setHours(start.getHours() - (offset * 3))
    
    const requestItems = {}
    requestItems[process.env.TABLE_NAME] = {
        Keys: [
            {
                'timestamp': {S: 'latest'},
                'base': {S: 'EUR'}
            },
            {
                'timestamp': {S: formatTimestamp(start)},
                'base': {S: 'EUR'}
            }
        ]
    }
    const tableReq = new BatchGetItemCommand({
        RequestItems: requestItems
    })

    const resp = await dynamodb.send(tableReq)
    let itemNow = resp.Responses[process.env.TABLE_NAME][0]
    let itemStart = resp.Responses[process.env.TABLE_NAME][1]

    return transformData(itemNow, itemStart)
}
