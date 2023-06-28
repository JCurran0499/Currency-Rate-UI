import boto3
import json

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    data_raw = dynamodb.get_item(
        TableName='Exchange-Rates',
        Key={
            'timestamp': {'S': '2023-06-28T02:00'},
            'base': {'S': 'EUR'}
            }
        )['Item']
    
    data = dict()
    for country in data_raw.keys():
        if country != 'timestamp' and country != 'base':
            data[country] = float(data_raw[country]['N'])
    print(data)
        
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(data)
    }
