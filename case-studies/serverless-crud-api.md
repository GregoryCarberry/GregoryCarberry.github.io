# Serverless CRUD API (API Gateway + Lambda + DynamoDB)

## Overview

This project demonstrates how to design and operate a production‑ready serverless CRUD API on AWS. It uses Amazon API Gateway, AWS Lambda and Amazon DynamoDB, secured by Amazon Cognito and fine‑grained IAM. The goal is to show recruiters and hiring managers that you understand modern backend patterns on AWS and can ship something that is secure, observable and maintainable – not just a “hello world” Lambda.

The implementation is kept intentionally small and focused: a simple `Item` resource with full create, read, update and delete operations.

---

## Problem and goals

**Problem:**  
Many teams need a lightweight JSON API for internal tools, prototypes or customer‑facing features. Standing up and maintaining traditional servers or containers can be overkill, and doing so without automation often leads to fragile environments.

**Goals for this project:**

1. Build a CRUD API using fully managed, pay‑per‑use services.
2. Use **Infrastructure as Code** so the environment can be recreated quickly and safely.
3. Implement **authentication and authorisation** using AWS‑native services.
4. Demonstrate safe **deployment strategies** such as canary releases via Lambda aliases.
5. Capture the design in an **OpenAPI** specification and keep it under version control.
6. Put strong emphasis on **operational concerns**: logging, metrics, and the ability to roll back quickly.

---

## Architecture

### Components

- **Amazon API Gateway**  
  Exposes a public HTTPS endpoint, performs request validation, integrates with Cognito for authentication, and routes methods to the correct Lambda functions.

- **AWS Lambda (Python)**  
  Stateless functions that implement business logic for each CRUD operation:
  - `create_item`
  - `get_item`
  - `update_item`
  - `delete_item`
  - `list_items`

- **Amazon DynamoDB**  
  A single `Items` table, keyed by `id` (partition key). Designed for simple lookups and updates by primary key.

- **Amazon Cognito**  
  User Pool handling sign‑up, sign‑in and token issuance. An API Gateway Cognito Authoriser ensures that only authenticated users can invoke the API. IAM policies can be extended later for fine‑grained access control (for example, item ownership).

- **Amazon CloudWatch**  
  Centralised logging and metrics for Lambda and API Gateway, used to monitor latency, error rates and throttling.

- **Terraform (IaC)**  
  Manages the lifecycle of all AWS resources. The target region is `eu-west-2` to align with UK‑centric workloads.

### Request flow

1. A client sends an HTTPS request to the API Gateway endpoint, including a Cognito‑issued JWT.
2. API Gateway:
   - Validates the JWT via the Cognito Authoriser.
   - Validates the incoming request against models / schemas (planned).
   - Routes the request to the correct Lambda function.
3. The Lambda handler validates input, interacts with DynamoDB, and returns a response.
4. API Gateway formats the response for the client.
5. Logs and metrics for each call are captured in CloudWatch and can be used for alarms or dashboards.

---

## Security and IAM

Security is handled in several layers:

1. **Cognito authentication**  
   Only authenticated users with valid tokens can call protected endpoints.

2. **Fine‑grained IAM (planned)**  
   - Lambda execution roles are locked down to the specific DynamoDB table and resources they need.
   - Future iterations may introduce attribute‑based access control (ABAC), where claims in the JWT (such as user id or group) are mapped to IAM conditions.

3. **Least privilege defaults**  
   Terraform will define tightly scoped IAM policies rather than broad wildcard permissions.

---

## Deployments and canary releases

One of the main aims of this project is to show understanding of safe deployment practices on serverless.

- Each Lambda function is versioned.
- Named **aliases** (for example `prod` and `canary`) point to specific versions.
- During a deployment:
  - A new version is published.
  - The `canary` alias is pointed at the new version with a small percentage of traffic (for example 10%).
  - Metrics and logs are monitored for errors and latency.
  - If everything looks healthy, the `prod` alias is updated to point to the new version and traffic is shifted fully.
  - If issues are detected, traffic is moved back to the previous version by updating alias weights.

This pattern allows safer experimentation and faster recovery compared to updating code in place.

---

## OpenAPI‑driven design

The API is designed “contract‑first” using an OpenAPI document stored in the repository:

- Documents available endpoints:
  - `POST /items`
  - `GET /items`
  - `GET /items/{id}`
  - `PUT /items/{id}`
  - `DELETE /items/{id}`
- Defines schemas for request and response bodies.
- Captures error formats (for example validation errors vs internal errors).
- Describes security via Cognito bearer tokens.

API Gateway can be configured to import this document, which reduces drift between implementation and documentation and enables easy sharing with other teams.

---

## Operational considerations

Even a small serverless workload benefits from proper operations thinking:

- **Logging**  
  Lambda handlers log structured events (for example operation name, item id, correlation id). This makes it easier to debug issues and trace a request end‑to‑end.

- **Metrics**  
  - CloudWatch metrics are used to monitor latency, errors and throttling.
  - Key metrics (for example 5xx error rate) can feed into CloudWatch alarms.

- **Cost awareness**  
  DynamoDB uses on‑demand capacity to scale automatically for small workloads. Lambda and API Gateway are pay‑per‑use, keeping the running cost extremely low when the API is idle.

---

## What this project demonstrates

From a hiring manager’s perspective, this project shows that you:

- Understand how to compose AWS managed services into a cohesive backend.
- Can think beyond “just code” and design for authentication, authorisation and least privilege.
- Know how to use Infrastructure as Code to create repeatable environments.
- Appreciate the importance of safe deployment strategies like canary releases and blue/green.
- Consider logging, metrics and cost from the beginning rather than as afterthoughts.

Even in its initial scaffolded form, the repository is set up to evolve into a realistic serverless microservice.

---

## Next steps and possible extensions

Future enhancements that would deepen the project include:

- Implementing the full Terraform stack (API Gateway, Lambda, DynamoDB, Cognito, IAM roles and policies).
- Adding real CRUD logic with validation and meaningful error responses.
- Creating a small front‑end (for example a single‑page app) that consumes the API.
- Integrating with GitHub Actions for CI, including:
  - Linting and unit tests on every push.
  - Automated packaging and deployment to a test environment.
- Adding alarms and dashboards in CloudWatch (or another tool) for visibility.
- Extending IAM to support per‑user access to items (for example “only allow users to manipulate their own items”).

These items give a clear roadmap for incremental improvements while keeping the project useful as a portfolio piece today.
