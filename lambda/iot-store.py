import json
import boto3
import uuid
import os
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
dynamodb_table = os.environ('DYNAMODB_TABLE')
table = dynamodb.Table(dynamodb_table)

def lambda_handler(event, context):
    store_data(event)

def store_data(payload):
    try:
        payload['temperature'] = Decimal(str(payload['temperature']))
        payload['humidity'] = Decimal(str(payload['humidity']))
        payload['gas_concentration'] = Decimal(str(payload['gas_concentration']))
        payload['fire_intensity'] = Decimal(str(payload['fire_intensity']))

        store = table.put_item(Item=payload)
        print('successfully stored data', store)

        res = {
            'statusCode': 201,
            'body': json.dumps({'message': 'successfully stored data'})
        }
        
        return res
    except Exception as e:
        error_res = {
            'statusCode': 500,
            'body': json.dumps({'unsuccessful storing data': str(e)})
        }

        return error_res