import json
from confluent_kafka import KafkaException, KafkaError
from kafka_consumer import create_consumer
from send_email import send_email

def process_message(message):
    try:
        email_content = json.loads(message)
        send_email(email_content)
    except json.JSONDecodeError as e:
        print(f"Error json: {e}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    consumer = create_consumer()
    try:
        while True:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print(f"End of partition reached {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                message = msg.value().decode('utf-8')
                process_message(message)
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()




if __name__ == "__main__":
    main()
