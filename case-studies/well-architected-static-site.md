# WELL-ARCHITECTED STATIC SITE

## Overview

I built this project to practise designing a production-ready static site on AWS using Infrastructure as Code.

Rather than simply hosting files in S3, the focus was on applying AWS Well-Architected principles from the start — prioritising security, reproducibility, regional correctness, and cost awareness.

The result is a fully reproducible static hosting architecture using S3, CloudFront, WAF, ACM, Route 53, and Terraform.

---

<div align="center">

<img src="../assets/images/static-site-architecture.svg"
     alt="Static Site Architecture on AWS (Route 53 → CloudFront + WAF → S3 with OAC; ACM in us-east-1)"
     width="900" />

</div>

---

## Architecture

The solution follows a secure, modern AWS static hosting pattern:

### 1. Amazon S3 (eu-west-2) – Private Origin
- Stores static assets (HTML, CSS, JS).
- Fully private bucket.
- Access restricted exclusively to CloudFront via Origin Access Control (OAC).
- Block Public Access enforced.

### 2. Amazon CloudFront
- Global CDN for low-latency delivery.
- HTTPS-only access enforced.
- TLS 1.2+ required.
- Security headers applied via Response Headers Policy:
  - Strict-Transport-Security
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- Behaviour rules configured for root and asset paths.
- Optimised caching for static delivery.

### 3. AWS Certificate Manager (us-east-1)
- Public TLS certificate provisioned in us-east-1 (CloudFront requirement).
- DNS validation via Route 53.

### 4. AWS WAF
- Attached directly to CloudFront.
- AWS Managed Rule Sets enabled for baseline protection.

### 5. Amazon Route 53
- Hosted zone for primary domain.
- A/AAAA alias records pointing to CloudFront.
- ACM validation records maintained within the same zone.

### 6. Terraform (Infrastructure as Code)
- Full environment defined in modular Terraform.
- Split providers:
  - eu-west-2 (primary resources)
  - us-east-1 (ACM alias provider)
- Random ID suffixing ensures idempotent redeployments without S3 naming conflicts.
- Modular structure:

```
modules/
  ├─ s3/
  ├─ cloudfront/
  ├─ waf/
  ├─ acm/
  └─ budgets/
```

---

## Security Controls

### Origin Access Control (OAC)
Restricts S3 access to the CloudFront distribution only. Bucket policy scoped to the distribution’s signed principal.

### Block Public Access
S3 BPA remains fully enabled at all times.

### TLS Enforcement
Only modern TLS versions permitted. No insecure protocols supported.

### Security Headers
Applied at CloudFront to improve browser-side security posture and Lighthouse scoring.

### security.txt & robots.txt
- security.txt provides a standard vulnerability disclosure channel.
- robots.txt limits unnecessary crawler behaviour.

---

## Logging, Monitoring & Cost Controls

### Implemented
- CloudFront standard logs (S3)
- WAF logs (JSON structured)
- S3 access logs
- AWS Budgets with email alerts

These provide visibility into traffic patterns, threat activity, and cost anomalies.

### Analytics (Planned Enhancement)
Athena + Glue integration identified schema and partitioning challenges during initial implementation. Future iteration will use:
- Dedicated log prefix structure
- Explicit Glue schema definitions
- Partition projection to reduce crawler dependency

---

## CI/CD Roadmap

### Phase 1 (Complete)
- Repository structured for automation
- Terraform validated locally
- OIDC trust design prepared for GitHub → AWS deployment

### Phase 2 (Next)
- GitHub Actions deployment on push to main
- Automated CloudFront cache invalidation
- Optional preview environments for feature branches

---

## Terraform Design Decisions

- Modular architecture for reuse and clarity
- Region-split providers to satisfy CloudFront/ACM constraints
- Deterministic infrastructure deployments
- Local state (migration-ready for S3 remote state + DynamoDB locking if required)

---

## Alignment with AWS Well-Architected Framework

### Security (Primary Design Focus)
- OAC
- WAF
- Block Public Access
- TLS enforcement
- Security headers
- IAM-restricted Terraform execution

### Reliability
- Global CDN distribution
- Reduced origin dependency via caching
- Deterministic IaC deployments

### Performance Efficiency
- Edge caching
- Compression and cache-control tuning
- CDN-optimised static delivery

### Operational Excellence
- Infrastructure as Code
- Modular architecture
- Centralised logging
- CI/CD pipeline design

### Cost Optimisation
- Serverless static architecture
- Minimal WAF rule set
- Budget alerts configured
- No compute services required

Designed to maintain production-grade security and resilience while keeping operational costs negligible.

---

## Lessons Learned

- Secure S3 + CloudFront configuration requires deliberate policy design.
- Cross-region ACM provisioning is essential for CloudFront.
- Log analytics requires disciplined S3 partition strategy.
- Terraform module boundaries significantly improve reuse and clarity.
- CloudFront acts as the control layer of the architecture, not S3.

---

## Summary

This project reflects how I approach cloud infrastructure:

- Security-first design
- Infrastructure defined entirely in code
- Awareness of regional constraints
- Observability and cost controls built in
- Clean modular architecture for reuse

It’s intentionally small in scope, but built with production discipline and aligned to modern cloud engineering standards.
