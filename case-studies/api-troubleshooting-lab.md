# API Troubleshooting Lab

**Updated:** Mar 2026  
**Category:** API / Support Engineering Lab  
**Environment:** Multi-repo Python lab (FastAPI gateway + Flask backend)

---

## Executive Overview

This project is a multi-service API troubleshooting lab built to replicate the kinds of issues that appear in real environments: authentication failures, malformed payloads, upstream dependency errors, timeouts, request tracing gaps, and the need to prove behaviour with tests rather than assumptions.

Instead of building a simple happy-path API demo, I built a system designed to be investigated when things go wrong. The result is a small but realistic environment that demonstrates fault isolation across service boundaries, structured observability, and repeatable failure analysis.

The lab is split across a hub repository plus two service repositories:

- **Hub repo** for architecture, shared documentation, and project entry point
- **Gateway service** for authentication, rate limiting, request forwarding, and edge handling
- **Backend service** for XML validation, order handling, and controlled failure simulation

---

## Engineering Intent

This lab was designed to demonstrate the ability to:

- Isolate failures across gateway and backend layers
- Distinguish client, edge, and upstream error conditions
- Reproduce common API issues deliberately instead of waiting for accidental breakage
- Trace a single request end-to-end using shared correlation headers
- Validate expected behaviour with automated tests
- Document troubleshooting in a way that reflects support and operations work, not just coding

This matters because production support is rarely about writing a new endpoint from scratch. It is more often about identifying where a request failed, why it failed, and how to prove the diagnosis.

---

## Current Architecture

High-Level Flow:

Client  
↓  
FastAPI Gateway  
↓  
Flask Backend  
↓  
Response

### Service Responsibilities

**Gateway**
- API key authentication via `X-API-Key`
- rate limiting
- request ID generation and propagation
- proxying requests to backend
- converting upstream failures into client-facing responses
- structured logging

**Backend**
- XML request parsing and validation
- in-memory order handling for repeatable testing
- controlled failure simulation via headers
- trace-aware responses
- structured logging tied to the same request ID

The split is deliberate. It creates a realistic boundary where failures can be introduced, observed, and isolated properly.

---

## Representative Failure Scenarios

### 1. Authentication Failure at the Edge
Requests without a valid API key are rejected before they ever reach the backend.

**Demonstrates:**  
- recognising edge-layer rejection  
- avoiding wasted debugging against the wrong service  
- understanding where authentication belongs in a layered design  

---

### 2. Malformed or Unsupported Client Input
Requests with invalid XML, missing fields, unsupported content types, or invalid values are rejected by the backend with clear status codes.

**Demonstrates:**  
- interpreting 4xx responses correctly  
- validating payload assumptions before changing server code  
- separating transport success from application-level validity  

---

### 3. Simulated Dependency Failure
The backend can intentionally return dependency-style failures, exceptions, or timeouts via `X-Failure-Mode`.

**Demonstrates:**  
- controlled reproduction of service issues  
- comparing gateway-visible symptoms with backend-originated causes  
- validating resilience and upstream error handling  

---

### 4. End-to-End Request Tracing
A request ID is created or forwarded at the gateway, passed to the backend, returned in headers, and written into both services' logs.

**Demonstrates:**  
- correlating evidence across services  
- tracing one transaction through the whole path  
- reducing guesswork during diagnosis  

---

## Observability & Validation

Two areas make this project stronger than a typical lab build:

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

---

## Demo Surface

The gateway repository includes a Postman collection built around the full client-facing flow.

It exercises scenarios including:

- valid request path
- missing / invalid API key
- wrong content type
- malformed XML
- missing fields
- invalid quantity
- simulated dependency failure
- simulated timeout
- simulated internal exception

This provides a simple way to demonstrate the system under normal and failing conditions without needing to explain every request manually.

---

## Troubleshooting Workflow

A typical investigation in this lab follows a structured sequence:

1. Send the request through the gateway  
2. Inspect the returned status code and `X-Request-ID`  
3. Check gateway logs for authentication, rate limiting, routing, or upstream handling  
4. Check backend logs for validation failure or simulated service error  
5. Confirm the failure domain and reproduce it with a controlled test case  

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
- Postman demo flow added to the gateway repo

Future improvements may include richer observability, more advanced dependency simulation, and deeper incident-style documentation, but the project is already in a strong portfolio-ready state.
