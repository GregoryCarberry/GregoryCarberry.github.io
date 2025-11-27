# Containerised App on ECS Fargate
**ECR + ECS service with ALB, health checks, autoscaling, and multi-environment CI/CD**

---

## Overview

This project showcases the design and deployment of a fully containerised application running on **Amazon ECS Fargate**, backed by **Amazon ECR**, fronted by an **Application Load Balancer (ALB)**, and supported with **autoscaling, health checks, and multi-environment versioned deployments**.

The solution demonstrates modern AWS cloud-native patterns and mirrors how production workloads are deployed in real organisations—zero servers to manage, isolated networking, and GitHub-driven CI/CD for reliability and repeatability.

---

## Objectives

- Deploy a secure, scalable containerised application without managing EC2 instances.
- Use **AWS ECS Fargate** for serverless container hosting.
- Store container images in **Amazon ECR** with automated version tagging.
- Expose the service via an **Application Load Balancer** with health checks.
- Implement **autoscaling** based on CPU and memory thresholds.
- Support **multi-environment deployments** (dev/prod) with versioned task definitions.
- Implement CI/CD using **GitHub Actions**.

---

## Architecture Summary

- **Amazon ECR**: Private container registry for application images.
- **Amazon ECS (Fargate)**: Serverless compute for tasks and services.
- **Application Load Balancer**: Traffic routing, health checks, and HTTPS termination.
- **Auto Scaling**: Target-tracking policies for CPU & memory.
- **VPC with private subnets**: ECS tasks run in isolated subnets for improved security.
- **IAM Roles for Tasks**: Least privilege permissions for any AWS API calls.
- **GitHub Actions**: Build, test, push image to ECR, and deploy updated task definitions.

---

## Deployment Flow

1. **Push to `main` or `prod` branches** triggers CI/CD.
2. GitHub Actions:
   - Builds Docker image.
   - Tags image with commit SHA + `latest`.
   - Pushes to ECR.
   - Generates a new ECS task definition revision.
   - Updates the ECS service to deploy the new revision.
3. ECS performs a **rolling deployment** using healthy ALB targets.
4. Autoscaling adjusts task count based on demand.

This creates a reliable, repeatable deployment pipeline with no manual steps.

---

## Key Features

### **Zero-maintenance compute**
Fargate eliminates patching, scaling, or securing EC2 hosts.

### **Version-controlled deployments**
Each release generates a new task definition revision for easy rollback.

### **Production-ready health checks**
ALB health checks ensure bad deployments never receive traffic.

### **Scalable by design**
Target-tracking autoscaling handles demand automatically.

### **Secure VPC architecture**
Tasks run in private subnets with outbound-only internet access via NAT.

---

## Challenges & Solutions

### **1. Multi-environment isolation**
**Solution:** Separate task definitions, ECS services, and ECR tags for dev and prod. GitHub Actions deploys to the correct environment based on branch.

### **2. Rolling deployments without downtime**
**Solution:** Using ALB health check grace periods and minimum healthy percent settings for smooth transitions.

### **3. Managing task definition revisions**
**Solution:** CI automatically registers new revisions and updates the ECS service using the AWS CLI & ECS API.

---

## Future Enhancements

- Add WAF and Shield for expanded security.
- Integrate CloudWatch dashboards & log insights.
- Extend CI/CD to include automated tests.
- Add a staging environment with ephemeral preview deployments.

---

## Repository Contents

| Folder              | Description                                   |
| ------------------- | --------------------------------------------- |
| `/app`              | Source code for the containerised application |
| `/infrastructure`   | Terraform or IaC for ECS/ECR/ALB/VPC setup    |
| `.github/workflows` | GitHub Actions CI/CD pipelines                |
| `case-study.md`     | The write-up you’re reading                   |

---

## Conclusion

This project demonstrates a complete, production-grade containerised deployment pipeline on AWS—secure, scalable, and automated from commit to rollout. It highlights cloud-native design, DevOps practices, and serverless container orchestration using Amazon ECS Fargate.

