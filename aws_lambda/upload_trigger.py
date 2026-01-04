import json
import os
import uuid
import urllib3
from datetime import datetime, timezone

http = urllib3.PoolManager()

HOST = os.getenv("HOST")          # e.g. http://4.186.24.221:8080
DAG_ID = os.getenv("DAG_ID")      # etl_students_pipeline
USERNAME = os.getenv("AIRFLOW_USER")  # airflow
PASSWORD = os.getenv("AIRFLOW_PASSWORD")  # airflow


def get_jwt_token():
    resp = http.request(
        "POST",
        f"{HOST}/auth/token",
        headers={"Content-Type": "application/json"},
        body=json.dumps({
            "username": USERNAME,
            "password": PASSWORD,
            "grant_type": "password"
        }),
        timeout=10.0
    )

    if resp.status not in (200, 201):
        raise Exception(f"Auth Failed: {resp.data.decode()}")

    return json.loads(resp.data.decode())["access_token"]


def trigger_dag(token, file_id, bucket, key, size):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    resp = http.request(
        "POST",
        f"{HOST}/api/v2/dags/{DAG_ID}/dagRuns",
        headers=headers,
        body=json.dumps({
            "conf": {
                "file_id": file_id,
                "bucket": bucket,
                "key": key,
                "size": size
            },
            "logical_date": datetime.now(timezone.utc).isoformat()
        }),
        timeout=10.0
    )

    if resp.status not in (200, 201):
        raise Exception(f"DAG Trigger Failed: {resp.data.decode()}")

    return json.loads(resp.data.decode())["dag_run_id"]


def lambda_handler(event, context):
    # Read S3 Event
    record = event["Records"][0]
    bucket = record["s3"]["bucket"]["name"]
    key = record["s3"]["object"]["key"]
    size = record["s3"]["object"]["size"]

    file_id = str(uuid.uuid4())

    # Step 1 -> Get JWT Token
    token = get_jwt_token()

    # Step 2 -> Trigger DAG using token
    dag_run_id = trigger_dag(token, file_id, bucket, key, size)

    return {
        "statusCode": 200,
        "message": "Airflow DAG triggered successfully 🚀",
        "dag_run_id": dag_run_id,
        "file_id": file_id,
        "bucket": bucket,
        "key": key
    }
