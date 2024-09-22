import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

const dynamodb = new DynamoDBClient()

export const latest = async (req) => {
    console.info("Fetching latest currency data..." + req)
    
    const tableReq = new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            'timestamp': {S: 'latest'},
            'base': {S: 'EUR'}
        }
    })

    const resp = await dynamodb.send(tableReq)
    const item = unmarshall(resp.Item)

    console.log("Done! " + req)

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item),
        id: req
    }
}
