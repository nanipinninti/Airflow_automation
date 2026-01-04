from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from datetime import datetime
import csv, io, uuid, os
import psycopg2


DAG_ID = "etl_students_pipeline"


# -------------------------------------
# DB Connection
# -------------------------------------
def get_pg_conn():
    return psycopg2.connect(
        host=os.getenv("ETL_DB_HOST"),
        port=int(os.getenv("ETL_DB_PORT", "5433")),
        database=os.getenv("ETL_DB_NAME"),
        user=os.getenv("ETL_DB_USER"),
        password=os.getenv("ETL_DB_PASSWORD")
    )


# -------------------------------------
# Task 1 - Register + File Run
# -------------------------------------
def register_file_and_run(**context):
    conf = context["dag_run"].conf
    file_id = conf["file_id"]
    bucket = conf["bucket"]
    key = conf["key"]
    size = conf.get("size", None)
    airflow_run_id = context["run_id"]

    filename = key.split("/")[-1]
    run_id = str(uuid.uuid4())
    context["ti"].xcom_push(key="run_id", value=run_id)

    conn = get_pg_conn()
    cur = conn.cursor()

    # UPSERT into files_master
    cur.execute("""
        INSERT INTO files_master (id, filename, bucket, path, size_bytes, status)
        VALUES (%s,%s,%s,%s,%s,'PROCESSING')
        ON CONFLICT (id)
        DO UPDATE SET status='PROCESSING', error_message=NULL;
    """, (file_id, filename, bucket, key, size))

    # Insert into file_runs
    cur.execute("""
        INSERT INTO file_runs (id, file_id, airflow_run_id, status)
        VALUES (%s,%s,%s,'RUNNING');
    """, (run_id, file_id, airflow_run_id))

    conn.commit()
    cur.close()
    conn.close()

    print("Registered successfully")


# -------------------------------------
# Task 2 - Download S3 file
# -------------------------------------
def fetch_file(**context):
    conf = context["dag_run"].conf
    bucket = conf["bucket"]
    key = conf["key"]

    hook = S3Hook("aws_default")
    obj = hook.get_key(key=key, bucket_name=bucket)

    if obj is None:
        raise Exception("File not found in S3")

    temp_path = f"/tmp/{uuid.uuid4()}.csv"
    obj.download_file(temp_path)

    context["ti"].xcom_push(key="file_path", value=temp_path)

    print(f"File downloaded to {temp_path}")


# -------------------------------------
# Task 3 - Validate CSV
# -------------------------------------
def validate_file(**context):
    ti = context["ti"]

    path = ti.xcom_pull(
        task_ids="fetch_file_from_s3",
        key="file_path"
    )

    if not path:
        raise Exception("No file path received from fetch task")

    if not os.path.exists(path):
        raise Exception(f"File missing in /tmp: {path}")

    with open(path, "r") as f:
        content = f.read()

    if not content.strip():
        raise Exception("File is empty")

    reader = csv.reader(io.StringIO(content))
    headers = next(reader)

    expected = ["name", "age", "class"]
    if [h.lower() for h in headers] != expected:
        raise Exception(f"Invalid header. Expected {expected}, got {headers}")

    print("Validation successful")

# -------------------------------------
# Task 4 - Parse + Insert
# -------------------------------------
def parse_and_insert(**context):
    ti = context["ti"]

    path = ti.xcom_pull(
        task_ids="fetch_file_from_s3",
        key="file_path"
    )

    if not path:
        raise Exception("No file path received from fetch task")

    if not os.path.exists(path):
        raise Exception(f"File missing in /tmp: {path}")

    with open(path, "r") as f:
        reader = csv.DictReader(f)
        rows = [(r["name"], int(r["age"]), int(r["class"])) for r in reader]

    if len(rows) == 0:
        raise Exception("CSV has no rows")

    conn = get_pg_conn()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            name VARCHAR(20),
            age INT,
            class INT
        );
    """)

    # Using executemany for efficient bulk insert
    # The trigger is now statement-level (FOR EACH STATEMENT), so it fires once
    # regardless of how many rows are inserted, making this efficient
    cur.executemany(
        "INSERT INTO students (name, age, class) VALUES (%s, %s, %s)",
        rows
    )

    conn.commit()
    cur.close()
    conn.close()

    print(f"Inserted {len(rows)} records")

# -------------------------------------
# Task 5 - Success Update
# -------------------------------------
def mark_success(**context):
    conf = context["dag_run"].conf
    file_id = conf["file_id"]
    run_id = context["ti"].xcom_pull(key="run_id")

    conn = get_pg_conn()
    cur = conn.cursor()

    cur.execute("""
        UPDATE files_master
        SET status='SUCCESS', error_message=NULL
        WHERE id=%s;
    """, (file_id,))

    cur.execute("""
        UPDATE file_runs
        SET status='SUCCESS', completed_at=NOW(), error_message=NULL
        WHERE id=%s;
    """, (run_id,))

    conn.commit()
    cur.close()
    conn.close()

    print("SUCCESS updated")


# -------------------------------------
# Failure Handler
# -------------------------------------
def mark_failed(context):
    error = str(context["exception"])

    try:
        conf = context["dag_run"].conf
        file_id = conf.get("file_id")
    except:
        file_id = None

    try:
        run_id = context["ti"].xcom_pull(key="run_id")
    except:
        run_id = None

    conn = get_pg_conn()
    cur = conn.cursor()

    if file_id:
        cur.execute("""
            UPDATE files_master
            SET status='FAILED', error_message=%s
            WHERE id=%s;
        """, (error, file_id))

    if run_id:
        cur.execute("""
            UPDATE file_runs
            SET status='FAILED', completed_at=NOW(), error_message=%s
            WHERE id=%s;
        """, (error, run_id))

    conn.commit()
    cur.close()
    conn.close()

    print("FAILED updated")


# -------------------------------------
# DAG
# -------------------------------------
with DAG(
    dag_id=DAG_ID,
    start_date=datetime(2024,1,1),
    schedule=None,
    catchup=False,
    on_failure_callback=mark_failed,
):

    t1 = PythonOperator(task_id="register_file_and_run", python_callable=register_file_and_run)
    t2 = PythonOperator(task_id="fetch_file_from_s3", python_callable=fetch_file)
    t3 = PythonOperator(task_id="validate_file", python_callable=validate_file)
    t4 = PythonOperator(task_id="parse_and_insert_postgres", python_callable=parse_and_insert)
    t5 = PythonOperator(task_id="mark_success", python_callable=mark_success)

    t1 >> t2 >> t3 >> t4 >> t5
