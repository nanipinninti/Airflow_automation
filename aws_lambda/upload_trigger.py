import json
import os
import uuid
import urllib3
import psycopg2
from datetime import datetime, timezone

http = urllib3.PoolManager()

HOST = os.getenv("HOST")
DAG_ID = os.getenv("DAG_ID")
USERNAME = os.getenv("AIRFLOW_USER")
PASSWORD = os.getenv("AIRFLOW_PASSWORD")

DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_PORT =  os.getenv("DB_PORT")

def get_jwt_token():
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
        })
        timeout=10.0
    )

    if resp.status not in (200, 201):
        raise Exception(f"DAG Trigger Failed: {resp.data.decode()}")

    return json.loads(resp.data.decode())["dag_run_id"]


def create_file_record(bucket, key, size):
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        port=int(DB_PORT)
    )
    conn.autocommit = True

    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO files_master (
                    client_id,
                    filename,
                    bucket,
                    path,
                    source,
                    size_bytes,
                    status_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                1,
                key.split("/")[-1],
                bucket,
                key,
                "S3",
                size,
                1
            ))

            file_id = cur.fetchone()[0]
            return str(file_id)

    finally:
        conn.close()

def lambda_handler(event, context):
    record = event["Records"][0]
    bucket = record["s3"]["bucket"]["name"]
    key = record["s3"]["object"]["key"]
    size = record["s3"]["object"]["size"]

    # ✅ Step 1 -> Insert file metadata in DB
    file_id = create_file_record(bucket, key, size)

    # ✅ Step 2 -> Get JWT Token
    token = get_jwt_token()

    # ✅ Step 3 -> Trigger DAG
    dag_run_id = trigger_dag(token, file_id, bucket, key, size)

    return {
        "statusCode": 200,
        "message": "File stored in DB & DAG triggered 🚀",
        "dag_run_id": dag_run_id,
        "file_id": file_id
    }