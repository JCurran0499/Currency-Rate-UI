import boto3
import json
from datetime import datetime, timedelta
from dateutil import tz

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    if (event['rawPath'] == '/rates'):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': get_latest_rates()
        }
    
    elif (event['rawPath'] == '/symbols'):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': get_symbols()
        }
    
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({
                'message': 'invalid route'
            })
        }


# Helper Methods

def get_latest_rates():
    now = datetime.now(tz.UTC)
    if (now.minute == 0):
        now = now - timedelta(hours=1)

    now = now - timedelta(minutes=now.minute % 60)
    start = now - timedelta(days=1)

    items = dynamodb.batch_get_item(
        RequestItems={
            'Exchange-Rates': {
                'Keys': [
                    {
                        'timestamp': {'S': str(now)[:16].replace(' ', 'T')},
                        'base': {'S': 'EUR'}
                    },
                    {
                        'timestamp': {'S': str(start)[:16].replace(' ', 'T')},
                        'base': {'S': 'EUR'}
                    }
                ]
            }
        }
        )['Responses']['Exchange-Rates']
    data_now = items[0]
    data_start = items[1]

    if (data_start['timestamp']['S'] > data_now['timestamp']['S']):
        data_now, data_start = data_start, data_now
    
    data = {'now': dict(), 'start': dict()}
    for country in data_now.keys():
        if country != 'timestamp' and country != 'base':
            data['now'][country] = float(data_now[country]['N'])
            data['start'][country] = float(data_start[country]['N'])
        
    return json.dumps(data)
    

def get_symbols():
    data_raw = dynamodb.get_item(
        TableName='Exchange-Rate-Symbols',
        Key={
            'key': {'S': 'symbols'}
        }
    )['Item']

    data = dict()
    for country in data_raw.keys():
        if country != 'key':
            data[country] = data_raw[country]['S']

    return json.dumps(data)
