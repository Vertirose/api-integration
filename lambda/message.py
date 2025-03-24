import json
import boto3
import os
from decimal import Decimal
from operator import itemgetter

dynamodb = boto3.resource('dynamodb')
sns_client = boto3.client('sns')

sns_topic = os.environ.get('SNS_TOPIC_ARN')
dynamodb_table = os.environ.get('DYNAMODB_TABLE')
table = dynamodb.Table(dynamodb_table)

def lambda_handler(event, context):
    return fetch_and_send_data()

def fetch_and_send_data():
    try:
        response = table.scan(Limit=1000)  # Scan for up to 1000 items

        items = response.get('Items', [])
        if not items:
            print('Data not found.')
            return {
                'statusCode': 404,
                'body': json.dumps({'message': 'Data not found'})
            }

        # Convert Decimal fields to float for compatibility
        for item in items:
            for key, value in item.items():
                if isinstance(value, Decimal):
                    item[key] = float(value)

        # Sort the items by timestamp
        items_sorted = sorted(items, key=itemgetter('timestamp'), reverse=True)

        # Get the latest 20 items
        latest_items = items_sorted[:20]

        # Prepare the message
        json_data = json.dumps(latest_items, indent=4)

        # Send data to SNS
        sns_publish = sns_client.publish(
            TopicArn=sns_topic,
            Message=json_data,
            Subject='Latest DynamoDB Entries From IoT Device'
        )

        print('Successfully sent latest data entries', sns_publish)

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Successfully sent latest data entries'})
        }

    except Exception as e:
        error_res = {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to process data', 'details': str(e)})
        }
        return error_res
