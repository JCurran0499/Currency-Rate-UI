import { DynamoDBClient, BatchGetItemCommand } from '@aws-sdk/client-dynamodb'

const dynamodb = new DynamoDBClient()

const formatTimestamp = (timestamp) => {
    return timestamp.toISOString().slice(0, 16) + "Z"
}

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

    const offset = Number(req.parameters?.offset || '24')

    const start = new Date()
    if (start.getMinutes() <= 5) {
        start.setHours(start.getHours() - 1)
    }

    start.setMinutes(0)
    start.setHours(start.getHours() - offset)
    
    const tableReq = new BatchGetItemCommand({
        RequestItems: {
            [process.env.TABLE_NAME]: {
                Keys: [
                    {
                        timestamp: {S: 'latest'},
                        base: {S: 'USD'}
                    },
                    {
                        timestamp: {S: formatTimestamp(start)},
                        base: {S: 'USD'}
                    }
                ]
            }
        }
    })

    const resp = await dynamodb.send(tableReq)
    resp.Responses[process.env.TABLE_NAME].sort((i1, _) => (i1.timestamp.S === 'latest') ? -1 : 1)
    
    let itemNow = resp.Responses[process.env.TABLE_NAME][0]
    let itemStart = resp.Responses[process.env.TABLE_NAME][1]

    return transformData(itemNow, itemStart)
}
