# API Troubleshooting Lab
*Break, observe, isolate, fix.*

## Overview
This project was built to show something more useful than a happy-path demo: the ability to diagnose why an API is failing.

The lab is split into two cleanly separated parts:
- a lightweight **gateway layer** that receives and routes requests
- a **Python backend** that serves the application logic

Instead of only proving that an API works, the lab is designed to prove that I can investigate it when it **doesn't** work. That makes it far more relevant to support, operations, junior cloud, and service desk roles where the real job is often fault isolation rather than greenfield development.

## Problem
A lot of portfolio APIs are too neat. They return the expected response, have a README, and stop there.

Real environments are messier:
- upstream services go down
- routes are misconfigured
- payloads are malformed
- the frontend sees a generic failure while the actual problem sits deeper in the stack
- engineers need a structured method to identify whether the fault is at the client, gateway, backend, or data/logic layer

This lab was created to model those kinds of failures in a controlled way.

## Objectives
- Build a small API system that is easy to understand but realistic enough to troubleshoot properly.
- Separate concerns so failures can be isolated to the correct layer.
- Create deliberate break/fix scenarios rather than relying on accidental bugs.
- Document the expected symptoms, likely causes, and validation steps.
- Demonstrate practical use of logs, HTTP status codes, request tracing, and API test tooling.

## Architecture
The project uses a simple layered design:

1. **Client / API tests** send requests to the gateway.
2. The **gateway** handles the edge-facing route and forwards traffic appropriately.
3. The **backend service** processes the request and returns JSON responses.
4. Logs and test output are used to confirm where a request failed and why.

This deliberately small architecture keeps the learning signal high. It is complex enough to demonstrate layered troubleshooting, but not bloated with unnecessary infrastructure.

## Key Troubleshooting Scenarios
The most valuable part of the lab is the ability to reproduce common failure modes and work through them methodically.

### 1) Backend unavailable
The gateway remains reachable, but requests fail because the upstream application is down or unreachable.

What this demonstrates:
- distinguishing edge availability from upstream health
- recognising gateway-generated errors vs backend-generated errors
- validating service reachability before changing code blindly

### 2) Misrouted or broken endpoint handling
A route can exist at one layer but not another, resulting in confusing 404 or proxy-style errors.

What this demonstrates:
- checking route definitions at both gateway and backend layers
- confirming whether a request is dying before or after forwarding
- understanding why two “404” responses may have completely different meanings

### 3) Invalid request and input handling
Malformed input is one of the easiest ways for APIs to fail in production.

What this demonstrates:
- validating request structure and payload assumptions
- interpreting 4xx responses correctly
- making error messages useful instead of vague

### 4) Log-led diagnosis
The lab encourages reading the evidence before making fixes.

What this demonstrates:
- comparing client-side symptoms with server-side logs
- narrowing scope quickly instead of guessing
- forming a repeatable troubleshooting workflow

## Technical Highlights
- Clear separation between gateway and backend responsibilities
- Python backend suited to readable, incremental debugging
- API test coverage to validate both working and failing paths
- Documentation written around **symptoms, diagnosis, and recovery**, not just setup
- Portfolio-friendly design that reflects operational thinking rather than just coding ability

## Why this matters
This project is directly relevant to the kinds of roles I am targeting.

In entry-level support, service desk, cloud support, and junior operations work, a large part of the value you add is being able to:
- observe a failure clearly
- ask the right diagnostic questions
- test the likely failure domain first
- communicate findings accurately
- avoid making the outage worse through random changes

That is the mindset this lab was built to demonstrate.

## Outcome
The result is a practical troubleshooting lab that shows I can work through API issues in a structured way, rather than relying on guesswork.

It demonstrates:
- layered fault isolation
- comfort with HTTP behaviour and API testing
- clearer operational reasoning
- a more realistic support-oriented approach to backend systems

## Next Steps
Planned improvements include:
- adding more intentional failure scenarios
- expanding test cases to cover additional edge conditions
- introducing richer observability or structured logging
- extending the lab with authentication or dependency-based failures
- linking the lab more tightly to incident-style runbooks and support workflows
