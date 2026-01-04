from datetime import datetime
from airflow import DAG
from airflow.providers.standard.operators.python import PythonOperator


def hello():
    print("Hello Airflow 🚀")
    return "Nani Pinninti"


with DAG(
    dag_id="hello_airflow",
    start_date=datetime(2024, 1, 1),
    schedule=None,
    catchup=False,
    tags=["demo"],
) as dag:

    say_hello = PythonOperator(
        task_id="say_hello",
        python_callable=hello,
    )
