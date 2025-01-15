import axios from 'axios'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const ssm = new SSMClient()
const dynamodb = new DynamoDBClient()


const ssm_command = new GetParameterCommand({Name: process.env.API_KEY, WithDecryption: true})
const params = {
    'app_id': (await ssm.send(ssm_command)).Parameter.Value,
    'base': 'USD'
}

const upload_data = async (json) => {
    const eventDate = new Date(json.timestamp * 1000)
    eventDate.setMinutes(0)
    const itemBase = {
        timestamp: {S: eventDate.toISOString().slice(0, 16) + "Z"},
        base: {S: json.base}
    }
    const itemLatest = {
        timestamp: {S: 'latest'},
        base: {S: json.base},
        ts: {S: eventDate.toISOString().slice(0, 16) + "Z"}
    }

    for (let symbol in json.rates) {
        itemBase[symbol] = itemLatest[symbol] = {N: json.rates[symbol].toString()}
    }

    console.log("Uploading exchange rates for " + itemBase.timestamp.S)
    await dynamodb.send(new PutItemCommand({
        'TableName': process.env.TABLE_NAME,
        'Item': itemBase
    }))
    await dynamodb.send(new PutItemCommand({
        'TableName': process.env.TABLE_NAME,
        'Item': itemLatest
    }))
    console.log("Successfully uploaded data")
}

// https://openexchangerates.org/account
export const handler = () => {
    axios({
        baseURL: 'https://openexchangerates.org',
        url: '/api/latest.json',
        method: 'get',
        params: params
    })
    .then((resp) => {
        upload_data(resp.data)
    })
}
