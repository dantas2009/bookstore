import json
from kafka_consumer import create_consumer, consume_messages
from send_email import send_auth_code_email, send_example_email

def process_message(message, topic):
    try:
        email_content = json.loads(message)
        if topic == 'auth-code':
            send_auth_code_email(email_content)
        elif topic == 'exemple_topic':
            send_example_email(email_content)
        else:
            print(f"Unknown topic: {topic}")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    consumer = create_consumer()
    try:
        consume_messages(consumer, process_message)
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

if __name__ == "__main__":
    main()