import boto3
import json
from datetime import datetime, timedelta
from dateutil import tz

dynamodb = boto3.client('dynamodb')

date_format = "%Y-%m-%dT%H:%M"

def lambda_handler(event, context):
    if (event['rawPath'] == '/latest'):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': get_latest_rates()
        }
    
    elif (event['rawPath'] == '/historical'):
        s = event['queryStringParameters']['start']
        e = event['queryStringParameters']['end']
        code = event['queryStringParameters']['code']

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': get_historical_rates(s, e, code)
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


def get_historical_rates(s, e, code):
    start = datetime.strptime(s, date_format)
    end = datetime.strptime(e, date_format)

    ## Gather data
    keys = []
    while start <= end:
        keys.append({
            'timestamp': {'S': str(start)[:16].replace(' ', 'T')},
            'base': {'S': 'EUR'}
        })
        start = start + timedelta(hours=1)

    items = dynamodb.batch_get_item(
        RequestItems={
            'Exchange-Rates': {
                'Keys': keys,
                'AttributesToGet': ['timestamp', code]
            }
        }
    )['Responses']['Exchange-Rates']

    ## Convert to JSON
    data_unordered = dict()
    for item in items:
        data_unordered[item['timestamp']['S']] = dict()
        for country in item.keys():
            if country != 'timestamp' and country != 'base':
                data_unordered[item['timestamp']['S']][country] = float(item[country]['N'])


    ## Order data
    data = []
    for k in keys:
        timestamp = k['timestamp']['S']
        data.append({
            timestamp: data_unordered[timestamp]
        })

    return json.dumps(data)