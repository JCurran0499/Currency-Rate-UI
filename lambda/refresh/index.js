import axios from 'axios'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import { DynamoDBClient, PutItemCommand, BatchGetItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb'

const ssm = new SSMClient()
const dynamodb = new DynamoDBClient()

const ssm_command = new GetParameterCommand({Name: process.env.API_KEY, WithDecryption: true})
const params = {
    'app_id': (await ssm.send(ssm_command)).Parameter.Value,
    'base': 'USD'
}

const delete_data = async (times) => {
    let keys = []
    for (let i = 0; i < times.length; i++) {
        keys.push({
            timestamp: {S: times[i]},
            base: {S: "USD"}
        })
    }
    let resp = await dynamodb.send(new BatchGetItemCommand({
        RequestItems: {
            [process.env.TABLE_NAME]: {
                Keys: keys,
                ProjectionExpression: "#ts",
                ExpressionAttributeNames: {
                    "#ts": "timestamp"
                }
            }
        }
    }))
    let items = resp.Responses[process.env.TABLE_NAME]
    
    let deletions = []
    for (let i = 0; i < items.length; i++) {
        deletions.push(dynamodb.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                timestamp: items[i].timestamp,
                base: {S: "USD"}
            }
        })))
    }
    await Promise.all(deletions)
    console.log(items.length.toString() + " deletions")
}


const upload_data = async (date, json) => {
    const item = {
        timestamp: {S: date},
        base: {S: json.base}
    }
    for (let symbol in json.rates) {
        item[symbol] = {N: json.rates[symbol].toString()}
    }
    await dynamodb.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: item
    }))
}


export const handler = async () => {
    let d = new Date()
    d.setDate(d.getDate() - 180)
    let date = d.toISOString().slice(0, 10)

    let times = []
    for (let i = 0; i < 24; i++) {
        times.push(`${date}T${(i > 9) ? i.toString() : ("0" + i.toString())}:00Z`)
    }

    await delete_data(times)
    await axios({
        baseURL: 'https://openexchangerates.org',
        url: '/api/historical/' + date + '.json',
        method: 'get',
        params: params
    })
    .then((resp) => {
        upload_data(date, resp.data)
    })
    console.log("Success! Uploaded " + date)
}
