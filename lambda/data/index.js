import http from 'http'
import querystring from 'querystring'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import { DynamoDBClient, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb'

const ssm = new SSMClient()
const dynamodb = new DynamoDBClient()


const ssm_command = new GetParameterCommand({Name: "currency_exchange_api_access_key", WithDecryption: true})
const params = {
    'access_key': (await ssm.send(ssm_command)).Parameter.Value
}
const params_string = querystring.stringify(params)

const options = {
  hostname: 'api.exchangeratesapi.io',
  port: '80',
  path: '/v1/latest?' + params_string,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}

const upload_data = async (json) => {
    const dynamodb_get_command = new GetItemCommand({
        'TableName': 'Exchange-Rate-Symbols',
        'Key': {
            'key': { S: 'symbols' }
        }
    })
    const symbols = (await dynamodb.send(dynamodb_get_command)).Item

    const items = {
        timestamp: {S: new Date(json.timestamp * 1000).toISOString().slice(0, 16)},
        base: {S: json.base},
    }
    for (let symbol in symbols) {
        if (symbol !== 'key') {
            items[symbol] = {N: json.rates[symbol].toString()}
        }
    }
    const dynamodb_put_command = new PutItemCommand({
        'TableName': 'Exchange-Rates',
        'Item': items
    })
   dynamodb.send(dynamodb_put_command)
}

export const handler = (e) => {
    let data_json
    const request = http.request(options, (resp) => {
        let data = []

        resp.setEncoding('utf8');

        resp.on('data', (chunk) => {
            data.push(chunk)
        })

        resp.on('end', () => {
            data_json = JSON.parse(data)
            upload_data(data_json)
        })
    })
    request.end()
}
