import http from 'http'
import querystring from 'querystring'
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'

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
  path: '/v1/symbols?' + params_string,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
}

const upload_data = (json) => {
    const items = { key: {S: 'symbols'} }
    for (let symbol in json.symbols) {
        items[symbol] = {S: json.symbols[symbol]}
    }
    
    const dynamodb_command = new PutItemCommand({
        'TableName': 'Exchange-Rate-Symbols',
        'Item': items
    })

    dynamodb.send(dynamodb_command)
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
