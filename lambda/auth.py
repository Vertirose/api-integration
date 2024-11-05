import json

def lambda_handler(event, context):
    headers = event.get('headers', {})
    api_data = headers.get('api_data')
    
    if api_data:
        return generate_policy('user', 'Allow', event['methodArn'])
    else:
        return generate_policy('user', 'Deny', event['methodArn'])


def generate_policy(principal_id, effect, resource):
    """Generate an IAM policy."""
    
    policy = {
        'principalId': principal_id,
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': resource
                }
            ]
        }
    }
    
    return policy
