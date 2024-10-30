import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('api_int')

def lambda_handler(event, context):
    http_method = event['httpMethod']

    if http_method == 'GET':
        return get_items_from_dynamodb()
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('method not allowed')
        }

def get_items_from_dynamodb():
    try:
        response = table.scan()
        items = response['Items']
        
        # Convert Decimal values to string
        for item in items:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = str(value)
        
        res = {
            'statusCode': 200,
            'body': json.dumps(items)
        }
        
        return res
    except Exception as e:
        error_res = {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }

        return error_res