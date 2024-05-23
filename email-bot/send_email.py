import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def send_email(email_body, email_subject, email_to_address):
    aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
    aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
    aws_region = os.getenv('AWS_DEFAULT_REGION')

    ses_client = boto3.client('ses',
                              aws_access_key_id=aws_access_key_id,
                              aws_secret_access_key=aws_secret_access_key,
                              region_name=aws_region)
    
    response = ses_client.send_email(
        Destination={
            'ToAddresses': [email_to_address]
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

def read_html_template(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()
    
def send_auth_code_email(content):
    email_template = read_html_template('emails/auth_code_template.html')
    email_body = email_template.replace('{{ code }}', content['code'])
    email_subject = f"{content['code']} your authentication code"
    email_to_address = content['email']

    send_email(email_body, email_subject, email_to_address)

def send_example_email(content):
    email_template = read_html_template('emails/example_template.html')
    email_body = email_template.replace('{{ example }}', content['example'])
    email_subject = "example"
    email_to_address = content['email']

    send_email(email_body, email_subject, email_to_address)