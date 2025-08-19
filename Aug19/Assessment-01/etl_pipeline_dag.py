from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from datetime import datetime
import logging

# Extraction function
def extract(**context):
    logging.info("===== Starting Extraction Step =====")
    data = "customer_id=101, amount=250"
    logging.info(f"Extracted data: {data}")
    context['ti'].xcom_push(key='raw_data', value=data)
    logging.info("===== Extraction Completed =====")

# Transformation function
def transform(**context):
    logging.info("===== Starting Transformation Step =====")
    raw_data = context['ti'].xcom_pull(key='raw_data', task_ids='extract_task')
    transformed_data = raw_data.upper()
    logging.info(f"Transformed data: {transformed_data}")
    context['ti'].xcom_push(key='clean_data', value=transformed_data)
    logging.info("===== Transformation Completed =====")

# Load function
def load(**context):
    logging.info("===== Starting Load Step =====")
    clean_data = context['ti'].xcom_pull(key='clean_data', task_ids='transform_task')
    logging.info(f"Loading data into warehouse: {clean_data}")
    logging.info("===== Load Completed Successfully =====")

default_args = {
    "owner": "rishitha",
    "start_date": datetime(2025, 8, 1),
    "retries": 1
}

with DAG(
    dag_id="multi_step_etl_pipeline",
    default_args=default_args,
    schedule_interval=None,   # manual trigger only
    catchup=False,
    description="ETL pipeline using Python and Bash operators"
) as dag:

    extract_task = PythonOperator(
        task_id="extract_task",
        python_callable=extract
    )

    transform_task = PythonOperator(
        task_id="transform_task",
        python_callable=transform
    )

    load_task = BashOperator(
        task_id="load_task",
        bash_command="echo 'Data successfully loaded!'"
    )

    # Task dependencies
    extract_task >> transform_task >> load_task


