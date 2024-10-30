import json
import boto3
from decimal import Decimal
import os

dynamodb = boto3.resource('dynamodb')
sns_client = boto3.client('sns')

table = dynamodb.Table('api_int')
sns_topic = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    return fetch_and_send_data()

def fetch_and_send_data():
    try:
        response = table.scan(
            Limit=20,
            ScanIndexForward=False
        )

        items = response.get('Items', [])
        if not items:
            print('data not found')
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'data not found'})
            }

        # Convert Decimal fields to strings for JSON compatibility
        for item in items:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = str(value)

        json_data = json.dumps(items)
        
        sns_publish = sns_client.publish(
            TopicArn=sns_topic,
            Message=json_data,
            Subject='Latest DynamoDB Entries'
        )

        print('successfully sent latest data entries', sns_publish)

        res = {
            'statusCode': 200,
            'body': json.dumps({'message': 'successfully sent latest data entries'})
        }

        return res

    except Exception as e:
        error_res =  {
            'statusCode': 500,
            'body': json.dumps({'error': 'failed to process data', 'details': str(e)})
        }

        return error_res
