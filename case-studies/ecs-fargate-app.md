# Practical ECS Fargate Operational Readiness Lab
**Dockerised FastAPI app deployed to ECS Fargate with Terraform, ECR, ALB verification, CloudWatch logs, and a troubleshooting runbook**

---

## Overview

This project documents a completed AWS lab deployment focused on operational readiness rather than a full production platform. I containerised a small **FastAPI** application with **Docker**, pushed the image manually to **Amazon ECR**, and deployed it into a **Terraform-managed** development environment in **eu-west-2** using **Amazon ECS Fargate**.

The completed milestone proves the core deployment path works end to end: image in ECR, task launched on Fargate, service attached to an **Application Load Balancer**, public checks succeeding on `/health`, `/`, and `/version`, and supporting evidence captured in **CloudWatch Logs**. After validation, the running resources were destroyed to avoid unnecessary AWS charges, while the ECR repository and image were retained for future redeployment.

---

## What Was Built

- Python **FastAPI** application containerised with Docker
- Image manually pushed to **Amazon ECR**
- **Terraform-managed** dev environment in **eu-west-2**
- **ECS cluster**
- **Task definition**
- **Task execution role** and **task role**
- **CloudWatch log group**
- **Application Load Balancer**
- **Target group** and **HTTP listener**
- **ECS Fargate service** attached to the ALB target group

---

## Verification Completed

The milestone is backed by direct operational checks rather than design intent alone.

- Public verification succeeded through the ALB on `/health`, `/`, and `/version`
- The target group was confirmed **healthy**
- The ECS service was confirmed **ACTIVE** with:
  - `desiredCount: 1`
  - `runningCount: 1`
  - `pendingCount: 0`
- **CloudWatch Logs** showed repeated `/health` `200 OK` checks from the load balancer

This demonstrates that traffic reached the service correctly, the container stayed healthy, and the logging path was working as expected.

---

## Operational Focus

This is best described as a support-minded cloud operations project. The value is not in claiming a finished production platform, but in showing evidence of the work that usually matters during deployment and early-life support:

- container deployment to ECS Fargate
- infrastructure as code with Terraform
- ALB target registration and health checking
- ECS service state verification
- CloudWatch log inspection
- repeatable troubleshooting steps for common failure modes

---

## Troubleshooting Discipline

A runbook was added to cover the kinds of issues likely to appear during deployment or support:

- ALB `503` responses
- unhealthy targets
- ECS task failures
- image pull problems
- missing logs
- cost-control teardown steps

That runbook is an important part of the project outcome. It shows the environment was treated as something to operate and debug, not just provision once.

---

## What This Project Does Not Claim

To keep the case study technically honest, this milestone does **not** claim the following:

- autoscaling
- GitHub Actions CI/CD deployment
- multi-environment dev/prod pipeline
- custom VPC with private subnets and NAT architecture
- HTTPS with ACM
- a production-grade deployment pipeline

Those are reasonable future extensions, but they are not presented here as completed work.

---

## Outcome

This lab shows that I can take a containerised Python service, publish it to ECR, deploy it with Terraform onto ECS Fargate, validate it through an ALB, inspect CloudWatch logs, and document the troubleshooting path clearly. For recruiters and hiring managers, it is evidence of practical AWS container operations with a disciplined, support-oriented approach.
