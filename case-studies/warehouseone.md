# WarehouseOne  
*A full-stack internal ordering system for warehouse/store operations*

## Architecture Diagram

![WarehouseOne Architecture](assets/images/warehouseone-architecture.svg)

---

## Overview
WarehouseOne is a complete internal ordering and stock-movement platform designed for a multi-store warehouse/retail environment. It was built to demonstrate real-world engineering skills across application design, API development, database modelling, DevOps discipline, and containerised deployments.

The system supports store-level order placement, warehouse picking and packing workflows, RBAC-based permissions, and end-to-end traceability of stock movements — all implemented using **Flask**, **PostgreSQL**, and **Docker Compose**.

Unlike a simple CRUD demo, this project mirrors the sort of operational tooling an actual warehouse team would depend on: predictable flows, clean interfaces, durable data models, and the ability to extend the system into scanning/IoT later.

---

## Goals

- Build a realistic internal business application, not a toy demo.
- Model real warehouse processes (ordering → picking → packing → dispatch).
- Implement **role-based access control (RBAC)** for warehouse staff and store users.
- Use **PostgreSQL** for durable, relational data with proper foreign keys and constraints.
- Run the full application stack using **Docker Compose** for local reproducibility.
- Prepare the system for future migration to ECS, Kubernetes, or serverless.
- Document the design clearly enough that other engineers can understand and deploy it.

---

## Architecture

### Application Layer — Flask

- Python Flask application with a clear blueprint/blue‑green module structure.
- Separate modules for:
  - Authentication & session management  
  - Store ordering flows  
  - Warehouse picking & packing  
  - Admin operations  
  - Item, stock, and user management  
- Strict separation of routes, services, and data access.
- Template-driven frontend using Jinja2, with room to evolve into an API-first UI later.

### Database Layer — PostgreSQL

A relational schema designed around warehouse operations:

- **Users** (with role mappings)  
- **Stores**  
- **Products**  
- **Stock Levels** (store-level and warehouse-level)  
- **Orders**  
- **Order Items**  
- **Picking Tasks**  
- **Dispatch Records**  

Constraints, foreign keys, and indexing ensure predictable behaviour and data integrity — for example, orders cannot be created for non-existent stores, and orphaned order items are prevented by cascading rules.

### Containerisation — Docker Compose

The entire system runs locally with:

- `web` → Flask application container  
- `db` → PostgreSQL container  
- Optional reverse-proxy container (e.g. Nginx) for production-style routing  
- Environment variables managed via `.env` for clean separation of secrets and configs  

This structure allows anyone to clone → run → test without manual database setup.

---

## Key Features

### 1. Multi-Store Ordering

- Each store logs into its own account.
- Store users can:
  - Browse available products
  - Submit new orders to the warehouse
  - Track order status (pending → picking → packed → dispatched)

This reflects how multiple retail branches submit replenishment orders into a central distribution centre.

### 2. Warehouse Operations

Dedicated warehouse roles can:

- View incoming store orders in a prioritised list
- Claim orders for picking (preventing duplicate work)
- Mark individual line items as picked
- Finalise packing for completed orders
- Generate dispatch entries once orders are ready to leave the warehouse

The workflow is opinionated and simple on purpose: it favours consistency over edge-case complexity.

### 3. Role-Based Access Control (RBAC)

Three core roles are implemented:

- **Store User** — can create and view orders for their own store.
- **Warehouse Staff** — responsible for picking, packing, and dispatch operations.
- **Admin** — full CRUD for products, users, stores, and operational overrides.

Flask session handling plus role-aware decorators ensure routes are protected and cross-role access is blocked.

### 4. Operational Logging & Traceability

Every stage of the workflow is captured:

- Which user picked which order  
- Timestamps for status changes  
- Line-level stock movements in and out of the warehouse  

This provides the audit trail that warehouse and finance teams typically need for reconciliation and incident review.

### 5. Production-Ready Structure

Even in its current form, the system is prepared for:

- Running behind a production WSGI server (Gunicorn/Uvicorn-style process management)
- Externalised configuration via environment variables or secrets managers
- Movement into a container orchestration environment (ECS/EKS/Kubernetes)
- CI/CD integration to build, test, and deploy updates automatically

The codebase is deliberately structured with separation of concerns to make that evolution easier.

---

## Why This Project Matters

WarehouseOne is deliberately **bigger than a tutorial** — it demonstrates:

- End-to-end ownership of a full-stack application.
- Data modelling skills for operational systems where integrity actually matters.
- Multi-step workflow design and user-experience thinking for internal tools.
- Containerisation and environment automation using Docker Compose.
- Clean, structured Python development targeting real operational use cases.

It’s the type of internal application real organisations rely on daily, just scoped to portfolio scale.

---

## Challenges & Solutions

### Ensuring workflow safety (no duplicate picking)

A core requirement was preventing multiple staff from picking the same order.

**Solution:**  
An order-claim mechanism ensures that once a picker takes ownership of an order, it transitions into a state that hides it from other workers’ queues. This avoids double-picks while keeping the UI simple.

### Getting RBAC right without bloating the codebase

Permissions can easily become scattered and hard to reason about.

**Solution:**  
Lightweight decorators and a centralised role mapping keep permission logic in one place. Routes stay readable, and roles can be extended later without rewriting every view.

### Maintaining data integrity

Warehouse data ages badly if it’s not properly constrained.

**Solution:**  
PostgreSQL constraints, foreign keys, and indexes are used heavily. For example, stock adjustments always go through well-defined tables instead of ad‑hoc column updates, making historical analysis and reporting more reliable.

### Designing for future extension

The system needed to be flexible enough to absorb barcode scanning, IoT, or external APIs later.

**Solution:**  
Business logic is grouped into domain-oriented services (orders, stock, users). This means new interfaces (such as handheld scanners or a React frontend) can talk to the same underlying services without re‑implementing rules.

---

## Lessons Learned

- Operational apps benefit massively from strict workflow boundaries; being opinionated keeps behaviour predictable.
- PostgreSQL’s constraint system is worth leaning on — it catches entire classes of bugs before they reach the application layer.
- Docker Compose is ideal for local development and demos but should be treated as a stepping stone to orchestrated deployments.
- “Simple” internal tools quickly reveal the value of clear structure, naming, and modularity; shortcuts show up fast when workflows evolve.

---

## Next Steps

- Add a documented REST or JSON API layer for external systems and future UI changes.
- Implement barcode/QR scanning (browser-based or dedicated handhelds) for picking confirmation.
- Build a reporting dashboard for order throughput, per-store demand, and pick/pack performance.
- Introduce S3 or similar storage for invoices, dispatch notes, and proof-of-delivery documents.
- Migrate the stack into AWS (ECS Fargate + RDS + ALB) using Terraform, aligning it with other portfolio projects.

---

## Summary

WarehouseOne is a practical, realistic internal ordering platform built to mirror real warehouse operations. It demonstrates capability across:

- Backend engineering with Flask  
- Relational database design on PostgreSQL  
- Multi-step workflow and UX design for internal users  
- Containerisation and local environment automation  
- RBAC implementation and audit-friendly logging  

It sits naturally alongside other projects in this portfolio — such as serverless APIs, ECS Fargate workloads, and the Well-Architected Static Site — and shows the ability to design and deliver a complete business application from scratch.
