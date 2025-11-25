# WELL-ARCHITECTED STATIC SITE
*(Case Study — Gregory Carberry)*

## Overview
This project delivers a secure, scalable, and cost-efficient static website hosted on AWS. It was built as a hands-on exercise to apply the AWS Well-Architected Framework while demonstrating a complete, production-ready infrastructure using real services — S3, CloudFront, ACM, Route 53, WAF, and Terraform.

The goal wasn’t just to “get a site online”, but to do it properly: security-first, region-appropriate, automated, and designed for maintainability. It reflects the same principles used by real engineering teams, but scaled down to something practical for a personal portfolio.

---

## Architecture

The architecture follows a typical, secure AWS static hosting pattern:

### 1. Amazon S3 (eu-west-2) – Static website origin
- Stores HTML, CSS, JS, and assets.
- **Not publicly accessible** — locked behind CloudFront using **Origin Access Control (OAC)**.
- **Block Public Access** enabled.

### 2. Amazon CloudFront
- Global CDN distribution for low-latency delivery.
- Enforces HTTPS-only access.
- Adds security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, etc.).
- Behaviours configured for:
  - `/` and `/*` default origin.
  - Cache-control respecting static assets.

### 3. AWS Certificate Manager (us-east-1)
- Issues public TLS certificates.
- Required in **us-east-1** for CloudFront compatibility.

### 4. AWS WAF
- Protects the distribution with core managed rule sets.
- This is connected directly to CloudFront.

### 5. Amazon Route 53
- DNS for the primary domain.
- A/AAAA records pointing to the CloudFront distribution.
- Hosted zone also contains verification records for ACM.

### 6. Terraform (Infrastructure-as-Code)
- Full environment defined as reusable, modular Terraform code.
- Includes region-split providers (`eu-west-2` primary, `us-east-1` ACM).
- Uses `random_id` suffixing to avoid bucket naming collisions.
- Modules for:
  - S3 origin
  - CloudFront
  - WAF
  - ACM
  - Budgets





![Static Site Architecture](/assets/images/static-site-architecture.svg)


## Security Controls

### 1. Origin Access Control (OAC)
Ensures CloudFront is the *only* service allowed to read the bucket contents.
Bucket policy restricts access to the CloudFront distribution’s signed principal.

### 2. Security Headers
Enabled at CloudFront via a response headers policy:

- **Strict-Transport-Security**
- **Content-Security-Policy**
- **X-Frame-Options**
- **X-Content-Type-Options**
- **Referrer-Policy**
- **Permissions-Policy**

These significantly improve the site’s security posture and Lighthouse score.

### 3. Block Public Access
S3 BPA remains fully enabled throughout.

### 4. TLS 1.2+ enforced
No insecure protocols allowed.

### 5. security.txt and robots.txt
- `security.txt` provides a standard compliance channel for reporting issues.
- `robots.txt` prevents unnecessary crawling of irrelevant paths.

---

## Logging, Monitoring & Observability

### Implemented Successfully
- **CloudFront standard logs** (to S3)
- **WAF logs** (JSON-structured)
- **S3 access logs**
- **AWS Budgets** with email alerts for monthly cost thresholds

These ensure visibility into traffic patterns, potential attacks, and unexpected charges.

### Attempted (will revisit)

#### Athena + Glue for querying CloudFront logs
The initial attempt ran into schema alignment and partitioning issues — specifically:

- CloudFront log structure changed mid-deployment.
- Glue crawler misinterpreted column types.
- Partitioning required a more advanced layout in the S3 logging bucket.

This will be revisited in a later phase using:

- A dedicated log prefix structure.
- A custom Glue table schema.
- Partition projection (reducing crawler dependency).

This counts as a learning milestone rather than a failure.

---

## CI/CD Progress

A GitHub Actions pipeline was planned but not fully implemented yet.

### Completed
- Repo structure organised to support automation.
- Terraform validated on local builds.
- Structure ready for OIDC-based GitHub → AWS deployments.

### Planned Next
- Automatic deploy on push to `main`.
- Auto-invalidate CloudFront cache.
- Optional: preview environments on feature branches.

---

## Terraform Implementation

### Provider Setup
Two providers:
- `aws` in `eu-west-2` as default.
- `aws.us_east_1` (alias) for ACM.

This matches AWS requirements and avoids mis-region certificate issues.

### Modules

A modular folder structure:

```text
modules/
  ├─ s3/
  ├─ cloudfront/
  ├─ waf/
  ├─ acm/
  └─ budgets/
```

### Random ID Suffixing
Prevents S3 bucket naming collisions during teardown/redeploy cycles.

### State
Local state for now (suitable for a personal project) but structure allows migration to:

- S3 remote state.
- DynamoDB locking.

when needed.

---

## Alignment with the AWS Well-Architected Framework

### 1. Security
Strongest pillar for this project.

- OAC.
- WAF.
- BPAs.
- TLS enforcement.
- Security headers.
- security.txt.
- IAM-restricted Terraform.

### 2. Reliability

- Global CDN distribution.
- Regional redundancy for ACM.
- Deterministic Terraform deployments.
- CloudFront caching reduces origin dependence.

### 3. Performance Efficiency

- CloudFront edge caching.
- Compression + cache-control headers.
- CDN-optimised static delivery.

### 4. Operational Excellence

- IaC for repeatability.
- Clear modular architecture.
- Logging + observability.
- CI/CD pipeline planned.

### 5. Cost Optimisation

- Static hosting = pennies per month.
- WAF basic managed rules only.
- Budgets + alerts.
- No servers or Lambdas needed.

The entire architecture is built to be extremely cheap while still production-quality.

---

## Lessons Learned

- **S3 + CloudFront is simple, but doing it properly is not.**
  Security headers, OAC policies, WAF, and TLS setup matter.

- **Cross-region ACM is easy to forget** — but essential.

- **Athena/Glue requires stricter S3 partitioning discipline.**
  A good reminder that analytics setups need careful planning.

- **Terraform module boundaries are incredibly valuable**, especially when re-using patterns across multiple projects.

- **CloudFront is the real “brain” of the system**, not S3.

---

## Next Steps

- Add GitHub Actions-based CI/CD with OIDC.
- Improve log analytics with Athena partition projection.
- Expand security headers (e.g. CSP nonce or hashed script support).
- Add optional Lambda@Edge to handle redirects.
- Explore adding basic web analytics (privacy-friendly, serverless).

---

## Summary

This project takes a simple concept — a static website — and executes it using real AWS best practices. It shows capability across:

- Cloud architecture.
- Terraform IaC.
- Security engineering.
- AWS regional constraints.
- DNS + TLS.
- Observability.
- Cost-aware design.

It is as close to “production-ready” as a personal static site can be, and demonstrates the discipline expected of modern cloud engineers.
