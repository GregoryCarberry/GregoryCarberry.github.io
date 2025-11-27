# Amazon Connect Call-Quality Monitor
*A monitoring pipeline for real-time service visibility and operational awareness*

## Overview
This project builds a lightweight, cost-efficient monitoring solution for Amazon Connect environments. The goal was to create a deployable system that surfaces call-quality insights — such as Average Handle Time (AHT), queue answer time, abandon rates and flow errors — without needing a full production contact centre behind it. The result is an automated metrics ingestion pipeline, anomaly-detection alarms, and a CloudWatch dashboard designed for service-desk style operational oversight.

The project mirrors the expectations of the **Amazon Connect Developer Specialist** badge: API-driven data retrieval, Lambda integration, IAM scoping, and observability patterns consistent with real-world Connect deployments.

## Objectives
- Build a **Terraform-managed pipeline** capable of monitoring Connect metrics on a scheduled basis.
- Support both **demo mode** (synthetic data) and **live mode** for real Connect instances.
- Produce a **clean, dependable dashboard** showing the KPIs service teams rely on.
- Add **anomaly-based alerting** so deviations in call performance trigger automated notifications.
- Keep all infrastructure cheap to run and easy to tear down, supporting daily iterations during development.

## Design & Approach

### Event-Driven Architecture
The monitor follows a simple but effective pipeline:

- **EventBridge** triggers a Lambda function every few minutes.
- The Lambda retrieves call performance metrics via `GetMetricDataV2` or generates synthetic values in demo mode.
- Metrics are normalised and pushed into **CloudWatch Custom Metrics**.
- A **CloudWatch Dashboard** provides real-time visualisation.
- **Anomaly detection alarms** alert on out-of-band behaviour (AHT spikes, queue waits, etc.).
- **SNS** handles notifications, making it suitable for service desk or operations teams.

This approach avoids heavy infrastructure and keeps the focus on Connect-specific insights.

## Key Implementation Details

### Infrastructure as Code
The entire project is fully managed via Terraform:

- Lambda function packaging (Python 3.12)
- EventBridge schedule
- IAM roles with least-privilege access
- CloudWatch metrics, dashboards, and alarms
- SNS topics and subscriptions
- Automated setup and teardown scripts

### Lambda Metrics Ingestor
The Lambda function acts as the heart of the system. It:

- fetches Connect metrics directly via API calls
- processes time windows for AHT, abandon rates, queue wait times
- publishes them to CloudWatch under a dedicated namespace
- supports “demo mode” for offline development

Demo mode ensures the dashboard and alarms remain functional even when no Connect instance exists.

### Monitoring & Alerting
The CloudWatch dashboard gives a focused view of:

- Average Handle Time
- Average Queue Answer Time
- Abandon Rate (%)
- Contacts in Queue
- Flow Error counts

Alarms use anomaly detection instead of static thresholds. This means the system learns normal patterns and alerts on deviations — much closer to how real contact centre monitoring works.

### Operational Convenience
Two small automation additions improve usability:

- **setup.sh / setup.ps1** to deploy the stack with environment overrides
- **cleanup.sh / cleanup.ps1** to tear everything down safely at the end of the day

This makes the project genuinely practical for repeated development cycles.

## Outcome
The project provides a clean, reliable foundation for monitoring Amazon Connect call performance — with or without a live instance. It demonstrates practical knowledge of Connect APIs, Lambda automation, CloudWatch observability and Terraform discipline. It also sets the stage for deeper Connect work, such as contact flow automation or data streaming into Athena.

## Next Steps
Future phases will extend the project into a fully-automated virtual contact centre:

- integrating a real Connect instance
- automating contact flows and queue assignments
- enabling data streaming and SQL-based analytics
- building dashboards around agent activity, queue depth and customer experience
- demonstrating practical use of the Connect APIs beyond metric retrieval
