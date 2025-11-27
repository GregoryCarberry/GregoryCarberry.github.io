# IaC VPC Baseline — Case Study

A secure, scalable AWS networking foundation built with Terraform.

## Overview
This project delivers a production-ready AWS Virtual Private Cloud (VPC) baseline, built with Infrastructure as Code using Terraform. It establishes a repeatable, secure, and extensible network foundation suitable for application workloads, labs, and cloud engineering demonstrations.

## Objectives
- Terraform-based reproducibility
- Public/private subnets
- NAT gateway (toggleable)
- Opinionated security groups
- SSM Session Manager bastion (no SSH)
- Modular, extensible design
- Well-Architected aligned

## Architecture Summary
- VPC
- Public subnets
- Private subnets
- IGW, NAT
- Route tables
- Strong SG defaults
- Optional VPC endpoints
- SSM-only bastion (no public IPs)

## Security Approach
- No exposed SSH
- IAM-controlled access
- SSM-only administration
- Avoids 0.0.0.0/0 defaults
- Optional strict‑mode rules

## Cost Notes
- NAT gateway toggle
- Endpoints optional
- Small instance types supported
- Local or S3 backend flexibility

## Use Cases
- App deployments (ECS/EKS/EC2)
- Labs and networking practice
- Zero‑trust entry patterns
- Portfolio demonstration

## Deployment
```
terraform init
terraform plan
terraform apply
```

## Learnings
- Secure networking without bastions
- Terraform modular design
- IAM + SSM real‑world patterns
- Cost‑aware VPC engineering

## Future Enhancements
- VPC Flow Logs + Athena
- Multi‑AZ NAT options
- Default endpoints
- ECS/EKS integration
- SVG diagram
