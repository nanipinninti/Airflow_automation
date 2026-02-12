from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "orders",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="order-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

print("Waiting for messages...")

for message in consumer:
    print(
        f"Partition: {message.partition}, "
        f"Offset: {message.offset}, "
        f"Value: {message.value}"
    )
