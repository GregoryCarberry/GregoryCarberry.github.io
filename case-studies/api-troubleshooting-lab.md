# API Troubleshooting Lab

**Updated:** May 2026  
**Category:** API / Support Engineering Lab  
**Environment:** Multi-repo Python lab using a FastAPI gateway and Flask backend

---

## Executive Overview

This project is a multi-service API troubleshooting lab built to replicate the kinds of issues that appear in real support and operations environments: authentication failures, malformed payloads, upstream dependency errors, timeouts, rate limiting, request tracing gaps, and the need to prove behaviour with evidence rather than assumptions.

Instead of building a simple happy-path API demo, I built a system designed to be investigated when things go wrong. The result is a small but realistic environment that demonstrates fault isolation across service boundaries, structured observability, repeatable failure analysis, Postman-based API testing, and pytest-backed validation.

The lab is split across three repositories:

- **Hub repository** for architecture, shared documentation, the canonical Postman collection, screenshots, and project entry point
- **Gateway service** for API key authentication, rate limiting, request forwarding, timeout handling, and edge-layer behaviour
- **Backend service** for XML validation, order handling, controlled failure simulation, and trace-aware responses

---

## Engineering Intent

This lab was designed to demonstrate the ability to:

- isolate failures across gateway and backend layers
- distinguish client-side, gateway-side, and backend-side error conditions
- reproduce common API issues deliberately instead of waiting for accidental breakage
- trace a single request end to end using shared correlation headers
- validate expected behaviour with automated tests
- document troubleshooting in a way that reflects support and operations work, not just coding

This matters because production support is rarely about writing a new endpoint from scratch. It is more often about identifying where a request failed, why it failed, and how to prove the diagnosis.

---

## Current Architecture

High-level flow:

```text
Client / Postman / curl
  ↓
FastAPI Gateway
  ↓
Flask Backend
  ↓
Response
```

### Service Responsibilities

**Gateway**

- API key authentication using `X-API-Key`
- rate limiting
- request ID generation and propagation
- proxying requests to the backend
- converting upstream failures into client-facing responses
- structured logging for request-level observability

**Backend**

- XML request parsing and validation
- in-memory order handling for repeatable testing
- controlled failure simulation via headers
- trace-aware responses
- structured logging tied to the same request ID

The split is deliberate. It creates a realistic boundary where failures can be introduced, observed, and isolated properly.

---

## Demo Evidence

The hub repository includes a canonical Postman collection and a selective screenshot set. These provide quick evidence that the lab runs locally and that the main behaviours have been exercised.

The screenshots are supporting evidence only. The source code, automated tests, service READMEs, and Postman collection remain the authoritative artefacts.

<div align="center">

<img src="/assets/images/api-troubleshooting-lab/postman/01-success-201.png"
     alt="Postman success path returning 201 Created through the gateway"
     width="900" />

</div>

The success path confirms the full request chain works through the gateway to the backend using the expected XML payload.

---

## Representative Failure Scenarios

### 1. Authentication Failure at the Edge

Requests without a valid API key are rejected before they ever reach the backend.

**Demonstrates:**

- recognising edge-layer rejection
- avoiding wasted debugging against the wrong service
- understanding where authentication belongs in a layered design

### 2. Malformed or Unsupported Client Input

Requests with invalid XML, missing fields, unsupported content types, or invalid values are rejected with clear status codes.

**Demonstrates:**

- interpreting 4xx responses correctly
- validating payload assumptions before changing server code
- separating transport success from application-level validity

### 3. Simulated Dependency Failure

The backend can intentionally return dependency-style failures, exceptions, or timeouts via `X-Failure-Mode`.

**Demonstrates:**

- controlled reproduction of service issues
- comparing gateway-visible symptoms with backend-originated causes
- validating resilience and upstream error handling

<div align="center">

<img src="/assets/images/api-troubleshooting-lab/postman/06-dependency-failure-503.png"
     alt="Postman simulated backend dependency failure returning 503 Service Unavailable"
     width="900" />

</div>

### 4. Timeout Handling

The gateway converts backend timeout behaviour into a clear client-facing `504 Gateway Timeout` response.

**Demonstrates:**

- gateway-level timeout handling
- clear separation between backend delay and client response
- predictable reproduction of a common production symptom

<div align="center">

<img src="/assets/images/api-troubleshooting-lab/postman/07-backend-timeout-504.png"
     alt="Postman simulated backend timeout returning 504 Gateway Timeout through the gateway"
     width="900" />

</div>

### 5. End-to-End Request Tracing

A request ID is created or forwarded at the gateway, passed to the backend, returned in headers, and written into both services' logs.

**Demonstrates:**

- correlating evidence across services
- tracing one transaction through the whole path
- reducing guesswork during diagnosis

---

## Observability and Validation

Two areas make this project stronger than a typical lab build.

### Structured Logging

Both services emit structured JSON logs instead of noisy default output. This makes request analysis faster and allows failures to be reviewed consistently.

### Automated Test Coverage

Both services include pytest-based tests covering:

- success paths
- authentication and validation failures
- injected backend failure modes
- tracing behaviour
- gateway-to-backend interaction

That means the project is not relying on manual checks alone. Expected behaviour is backed by repeatable tests.

<div align="center">

<img src="/assets/images/api-troubleshooting-lab/test-output/01-backend-test-pass.png"
     alt="Backend pytest output showing tests passing"
     width="900" />

</div>

<div align="center">

<img src="/assets/images/api-troubleshooting-lab/test-output/02-gateway-test-pass.png"
     alt="Gateway pytest output showing tests passing"
     width="900" />

</div>

---

## Postman Demo Surface

The hub repository includes the canonical Postman collection for the full client-facing flow.

It exercises scenarios including:

- valid request path
- missing or invalid API key
- wrong content type
- malformed XML
- missing required fields
- invalid quantity
- simulated dependency failure
- simulated timeout
- simulated internal exception
- rate limit exceeded

This provides a simple way to demonstrate the system under normal and failing conditions without needing to explain every request manually.

---

## Troubleshooting Workflow

A typical investigation in this lab follows a structured sequence:

1. Send the request through the gateway.
2. Inspect the returned status code and `X-Request-ID`.
3. Check gateway logs for authentication, rate limiting, routing, or upstream handling.
4. Check backend logs for payload validation or simulated service errors.
5. Confirm the failure domain and reproduce it with a controlled test case.

This mirrors the kind of disciplined process used in support, cloud operations, and service-focused engineering roles.

---

## Why This Project Matters

This project is directly relevant to the kind of work found in:

- technical support
- service desk
- cloud support
- junior platform / DevOps
- operations-focused engineering environments

The value is not just that the API works. The value is that the system is instrumented, test-backed, and deliberately designed to show how faults can be identified across layers.

That is the difference between a coding demo and a troubleshooting lab.

---

## Status

Current state:

- multi-service architecture working end to end
- request tracing implemented across both services
- structured logging in place
- controlled failure simulation working
- pytest coverage added across gateway and backend
- hub, gateway, and backend repositories aligned
- canonical Postman collection stored in the hub repository
- representative screenshots added for success, failure, timeout, rate limiting, service output, and test evidence
- project is portfolio-ready

Future improvements may include richer observability, more advanced dependency simulation, and deeper incident-style documentation, but the project is already in a strong state for demonstrating practical troubleshooting ability.
