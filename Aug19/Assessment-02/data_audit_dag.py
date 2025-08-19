from __future__ import annotations

import json
import logging
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.exceptions import AirflowFailException
from airflow.models import Variable

AUDIT_JSON_PATH = "/tmp/audit_result.json"


def data_pull(**kwargs):
    """
    Simulate reading from an external API/DB.
    Produces a small metrics payload and pushes via XCom.
    """
    logging.info("===== [DATA_PULL] Starting external read simulation =====")
    # Simulated payload you might have fetched from an API/DB
    payload = {
        "source": "dummy_api",
        "records": 5,
        "max_value": 73,  # example metric we will validate
        "pulled_at_utc": datetime.utcnow().isoformat(timespec="seconds"),
    }
    logging.info(f"[DATA_PULL] Retrieved payload: {payload}")
    kwargs["ti"].xcom_push(key="raw_metrics", value=payload)
    logging.info("===== [DATA_PULL] Completed =====")


def audit_validate_rule(**kwargs):
    """
    Validate a business rule against the pulled data.
    Rule: max_value must be <= threshold (Airflow Variable AUDIT_THRESHOLD, default 80)
    Writes the audit outcome to /tmp/audit_result.json.
    Fails cleanly by raising AirflowFailException when validation fails.
    """
    logging.info("===== [AUDIT_VALIDATE_RULE] Starting validation =====")
    ti = kwargs["ti"]
    metrics = ti.xcom_pull(key="raw_metrics", task_ids="data_pull")

    if not metrics:
        raise AirflowFailException("[AUDIT_VALIDATE_RULE] No metrics found from data_pull")

    threshold = int(Variable.get("AUDIT_THRESHOLD", default_var=80))
    max_value = int(metrics.get("max_value", -1))

    status = "PASS" if max_value <= threshold else "FAIL"
    reason = (
        f"max_value ({max_value}) <= threshold ({threshold})"
        if status == "PASS"
        else f"max_value ({max_value}) exceeded threshold ({threshold})"
    )

    audit_result = {
        "status": status,
        "reason": reason,
        "threshold": threshold,
        "metrics": metrics,
        "validated_at_utc": datetime.utcnow().isoformat(timespec="seconds"),
    }

    # Persist result to file as required
    with open(AUDIT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(audit_result, f, indent=2)

    logging.info(f"[AUDIT_VALIDATE_RULE] Wrote audit JSON to {AUDIT_JSON_PATH}")
    logging.info(f"[AUDIT_VALIDATE_RULE] Outcome -> {status}: {reason}")

    # Fail the task (and thus DAG) cleanly if validation fails
    if status == "FAIL":
        raise AirflowFailException(f"[AUDIT_VALIDATE_RULE] Validation failed: {reason}")

    logging.info("===== [AUDIT_VALIDATE_RULE] Completed successfully =====")


def final_status_update(**kwargs):
    """
    Reads the audit JSON and posts a final success message.
    Runs only if previous tasks succeeded (default trigger rule).
    """
    logging.info("===== [FINAL_STATUS_UPDATE] Posting final status =====")
    try:
        with open(AUDIT_JSON_PATH, "r", encoding="utf-8") as f:
            audit = json.load(f)
    except FileNotFoundError:
        raise AirflowFailException(
            "[FINAL_STATUS_UPDATE] audit_result.json is missing; upstream may have failed."
        )

    msg = f"[FINAL_STATUS_UPDATE] AUDIT {audit.get('status')} • {audit.get('reason')}"
    logging.info(msg)
    logging.info("===== [FINAL_STATUS_UPDATE] Completed =====")


default_args = {
    "owner": "rishitha",
    "email": ["alerts@example.com"],     # replace with your email if needed
    "email_on_failure": False,           # set True if you want real emails
    "retries": 2,
    "retry_delay": timedelta(minutes=2),
    "start_date": datetime(2025, 8, 1),
}

with DAG(
    dag_id="data_audit_dag",
    default_args=default_args,
    schedule_interval="@hourly",
    catchup=False,
    description="Scheduled data audit flow with validation and logging",
    tags=["audit", "example", "assignment"],
) as dag:

    # 1) Data Pull (PythonOperator)
    data_pull_task = PythonOperator(
        task_id="data_pull",
        python_callable=data_pull,
    )

    # 2) Audit Rule Validation (PythonOperator)
    audit_validate_task = PythonOperator(
        task_id="audit_validate_rule",
        python_callable=audit_validate_rule,
    )

    # 3) Logging Audit Results (BashOperator)
    # Prints the JSON and appends a timestamped line to a simple audit run log.
    log_audit_results_task = BashOperator(
        task_id="log_audit_results",
        bash_command=(
            "echo '===== [LOG_AUDIT_RESULTS] Audit JSON ====='\n"
            f"cat {AUDIT_JSON_PATH}\n"
            "echo '===== [LOG_AUDIT_RESULTS] Timestamp ====='\n"
            "echo \"Audit logged at: {{ ts }}\" >> /tmp/audit_runs.log\n"
            "echo 'Log file updated at /tmp/audit_runs.log'"
        ),
    )

    # 4) Final Status Update (PythonOperator)
    final_status_update_task = PythonOperator(
        task_id="final_status_update",
        python_callable=final_status_update,
    )

    # Chaining
    data_pull_task >> audit_validate_task >> log_audit_results_task >> final_status_update_task
