import json
from kafka_consumer import create_consumer, consume_messages
from send_email import send_email

def process_message(message):
    try:
        email_content = json.loads(message)
        send_email(email_content)
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
