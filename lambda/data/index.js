import axios from 'axios'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

const ssm = new SSMClient()
const dynamodb = new DynamoDBClient()


const ssm_command = new GetParameterCommand({Name: "currency_exchange_api_access_key", WithDecryption: true})
const params = {
    'access_key': (await ssm.send(ssm_command)).Parameter.Value
}

const upload_data = async (json) => {
    const item = {
        timestamp: {S: new Date(json.timestamp * 1000).toISOString().slice(0, 16)},
        base: {S: json.base}
    }

    for (let symbol in json.rates) {
        item[symbol] = {N: json.rates[symbol].toString()}
    }
    const dynamodb_put_command = new PutItemCommand({
        'TableName': 'Exchange-Rates',
        'Item': item
    })
   dynamodb.send(dynamodb_put_command)
}

export const handler = (e) => {
    axios({
        baseURL: 'http://api.exchangeratesapi.io',
        url: '/v1/latest',
        method: 'get',
        params: params
    })
    .then((resp) => {
        upload_data(resp.data)
    })
}
