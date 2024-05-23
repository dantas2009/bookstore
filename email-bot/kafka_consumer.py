import os
import time
from confluent_kafka import Consumer, KafkaException, KafkaError

def create_consumer():
    broker = os.getenv('KAFKA_BROKER')
    group_id = os.getenv('KAFKA_GROUP_ID')
    topics = os.getenv('KAFKA_TOPICS').split(',')

    conf = {
        'bootstrap.servers': broker,
        'group.id': group_id,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe(topics)
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
                message = msg.value().decode('utf-8')
                topic = msg.topic()
                process_message(message, topic)
        except KafkaException as e:
            print(f"Kafka error: {e}")
            consumer.close()
            consumer = create_consumer()
        except Exception as e:
            print(f"Unexpected error: {e}")
            break