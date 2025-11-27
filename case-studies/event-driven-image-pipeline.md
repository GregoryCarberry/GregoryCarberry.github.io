# Event-Driven Image Pipeline  
An AWS-native pipeline for automated image processing, notifications, and operational visibility.

## Overview

This project showcases a lightweight but fully event-driven workflow built entirely on serverless AWS services.  
The pipeline automatically generates thumbnails when new images land in S3, emits structured events via EventBridge, processes them in Lambda, and notifies subscribers through SNS. The solution includes CloudWatch dashboards and alarms for full operational visibility.

This is the sort of pattern you would deploy in real environments where teams need zero-maintenance image handling with predictable running costs and simple extensibility.

## Architecture Summary

**Flow:**

1. Images uploaded to **Amazon S3**  
2. S3 emits events into **Amazon EventBridge**  
3. **AWS Lambda** generates thumbnails  
4. Processed image metadata triggers **Amazon SNS** notifications  
5. **CloudWatch Dashboards & Alarms** provide observability

This design removes the tight coupling of traditional S3->Lambda triggers and gives you a more scalable, auditable, centrally managed event bus.

## Why EventBridge Instead of Direct Triggers?

Direct S3 → Lambda notifications work fine for small projects, but EventBridge unlocks:

- Centralised event routing for future extensions  
- Consistent event structure across services  
- Ability to fan-out events cleanly  
- Better replay/testing capabilities  
- Lower operational friction when adding new consumers

In short, it makes the solution *future-proof* instead of “just enough.”

## Key Features

### Automated Thumbnailing  
Lambda converts source images (JPEG/PNG/etc.) to a consistent thumbnail format.  
Configuration supports size, aspect ratio and output folder prefixes.

### Event-Driven Processing  
EventBridge rules match S3 `PutObject` events and forward them to the thumbnail Lambda with zero coupling.

### Notifications via SNS  
After processing, an SNS topic pushes messages to email/SMS systems.  
A simple workflow, but very real-world — teams regularly plug this into ticketing systems or Slack bots.

### Observability  
You get:

- Lambda metrics (duration, concurrency, failures)
- S3 object-put counts
- SNS delivery metrics
- Custom metrics from Lambda (thumbnail success/error counts)
- Dashboards for runtime visibility
- Alarms on failure or prolonged latency

This gives the project proper operational maturity rather than being “just a demo.”

## Repository Contents

```
infrastructure/         # IaC (SAM/Terraform/CloudFormation)
lambda/thumbnail/       # Source code for thumbnail generation
sample-images/          # Images to use in testing the pipeline
scripts/                # Bash helper scripts (uploads, tests)
cloudwatch/             # Dashboards + Alarm definitions
architecture/           # High-level architecture diagrams
```

Everything is structured so that other engineers can clone the repo and deploy the stack with minimal friction.

## Deployment

Depending on your preferred tooling, the stack can be deployed using:

- AWS SAM  
- Terraform  
- or plain CloudFormation templates

The repo provides sample images and a small upload script to let anyone test the pipeline immediately after deployment.

## What This Project Demonstrates

- Competence with event-driven architecture  
- Effective use of AWS managed services  
- Good observability practices  
- Clean repo structure and deployment-ready templates  
- Practical serverless workflows used in real production systems  

## Future Enhancements

- Integrating a Step Functions workflow for multi-stage processing  
- Adding a DynamoDB metadata store  
- Publishing processed images to CloudFront  
- Using EventBridge Pipes for transformation and enrichment

**Author:** Gregory John Carberry  
**Project Type:** AWS Serverless / Event-Driven Architecture