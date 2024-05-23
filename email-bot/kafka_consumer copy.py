import os
import time
from confluent_kafka import Consumer, KafkaException, KafkaError

def consume_messages():
    broker = os.getenv('KAFKA_BROKER')
    group_id = os.getenv('KAFKA_GROUP_ID')
    topic = os.getenv('KAFKA_TOPIC')

    conf = {
        'bootstrap.servers': broker,
        'group.id': group_id,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe([topic])

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
                print(f"Received message: {msg.value().decode('utf-8')}")
    except KeyboardInterrupt:
        pass
    finally:
        consumer.close()

def create_consumer():
    broker = os.getenv('KAFKA_BROKER')
    group_id = os.getenv('KAFKA_GROUP_ID')
    topic = os.getenv('KAFKA_TOPIC')

    conf = {
        'bootstrap.servers': broker,
        'group.id': group_id,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe([topic])

    return consumer

def consume_messages(consumer, process_message):
    while True:
        try:
            msg = consumer.poll(timeout=1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print(f"End of partition reached {msg.topic()} [{msg.partition()}] at offset {msg.offset()}")
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                print(f"Received message: {msg.value().decode('utf-8')}")
                process_message(msg.value().decode('utf-8'))
        except KafkaException as e:
            print(f"Kafka error: {e}")
            time.sleep(5)  # Espera 5 segundos antes de tentar reconectar
        except Exception as e:
            print(f"Unexpected error: {e}")
            break