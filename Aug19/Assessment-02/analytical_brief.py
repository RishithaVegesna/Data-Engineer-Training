"""
Assessment-02 • Part-2: Analytical Brief

Role of DAGs in Monitoring and Auditing:

DAGs in Airflow help to arrange tasks step by step and make sure each one
runs in the correct order. For auditing pipelines, this is very useful
because it makes the process repeatable and traceable. Every time the DAG
runs, it records what happened, when it happened, and whether it passed or
failed. This gives teams confidence that the audit process is consistent
and also makes it easier to check logs later.

Airflow for Event-Driven Workflows:

Airflow is usually used for time-based schedules like daily or hourly jobs.
But it can also be adapted for event-driven cases. For example, a DAG can
be triggered when a new file is uploaded, when a message comes to a queue,
or when an API sends a signal. This makes Airflow flexible, because it can
work with both regular schedules and react to real-time events.

Airflow vs Cron Jobs:

Cron is a very old tool and good for simple schedules, but it has many
limits. It cannot handle task dependencies, has no retries, and does not
give a clear monitoring view. If something fails, you often have to check
server logs manually.

Airflow has some big advantages:

1. Clear task dependencies shown in the DAG.
2. Web UI to monitor tasks and see logs in one place.
3. Built-in retries and alerting on failure.

These make Airflow much stronger than cron for bigger workflows where
tracking and reliability matter.

Integration with Logging and Alerts:

Airflow can connect with external systems for logs and alerts. For example,
logs can be sent to tools like Elasticsearch, Splunk, or cloud logging.
Alerts can be sent through email, Slack, or other messaging tools. This way,
if an audit fails, the right team can get notified quickly and take action.

Conclusion:

In short, Airflow DAGs are very useful for monitoring and auditing pipelines.
They give structure, visibility, and reliability. Airflow is more powerful
than cron because it manages dependencies, shows logs in a central place,
and can retry failed tasks. With event-driven triggers and external logging
integrations, Airflow becomes a strong tool for both regular schedules and
real-time workflows in enterprises.
"""
