from kafka import KafkaProducer
import json
import time

# Connect to Kafka
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

for i in range(5):
    data = {
        "order_id": i,
        "city": "Hyderabad",
        "item": "Pizza"
    }

    producer.send("orders", value=data)
    print(f"Sent: {data}")
    time.sleep(1)

producer.flush()
producer.close()
