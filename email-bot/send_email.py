import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def read_html_template():
    file_path = os.getenv('EMAIL_AUTH_CODE')
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()
    
def send_email(email_content):
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_DEFAULT_REGION')

    ses_client = boto3.client('ses',
                              aws_access_key_id=aws_access_key_id,
                              aws_secret_access_key=aws_secret_access_key,
                              region_name=aws_region)
    
    email_template = read_html_template()
    email_body = email_template.replace('{{ code }}', email_content['code'])

    email_subject = email_content['code'] + ' is your authentication code'
    
    response = ses_client.send_email(
        Destination={
            'ToAddresses': [email_content['email']]
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': 'UTF-8',
                    'Data': email_body
                }
            },
            'Subject': {
                'Charset': 'UTF-8',
                'Data': email_subject
            }
        },
        Source='BookStore <store@dantas2009.com>'
    )

    print("Message ID:", response['MessageId'])

