# 🎫 Ticket Triage Dashboard — Case Study

## Project Summary

The **Ticket Triage Dashboard** is a full‑stack web application designed to reflect the **day‑to‑day workflows of a first‑line IT service desk**.

Rather than focusing on complex UI or large frameworks, the project emphasises:
- Clear data flow
- Practical operational features
- Maintainable, extensible architecture

---

## Problem

First‑line support teams need tools that provide **fast visibility** into:

- Incoming incidents
- Ticket priority and urgency
- Current ownership
- Overall workload

These tools must be:
- Simple to understand at a glance
- Responsive and reliable
- Easy to extend as processes mature

---

## Approach

The solution was built as a **small, clearly scoped full‑stack application**.

Key architectural choices:
- **React (Vite)** for a fast, minimal frontend
- **Node.js + Express** for a predictable REST API
- **JSON-backed storage** to keep focus on API behaviour and UI logic
- Strict **client/server separation**

This approach mirrors how internal tools are often developed in real environments.

---

## Core Workflows

### Ticket Lifecycle
- Tickets move through defined states (*New → In Progress → Resolved*)
- Status updates are handled inline with immediate visual feedback

### Assignment
- Agents can self‑assign tickets using a single action
- Ownership changes are persisted server‑side

### Operational Visibility
- A metrics panel summarises workload and priority in real time
- Metrics are served by a dedicated API endpoint

---

## Technical Highlights

- RESTful API design with query‑based filtering
- Optimistic UI updates with graceful rollback
- Decoupled frontend/backend architecture
- Incremental feature delivery with clean commit history

---

## Outcomes

- Implemented realistic service desk workflows end‑to‑end
- Demonstrated practical React state management
- Built a clean, extensible API layer
- Created a foundation suitable for authentication, databases, or reporting

---

## Future Enhancements

- Role‑based reassignment and escalation
- Ticket activity history / audit trail
- Database persistence (SQLite / PostgreSQL)
- Authentication and user management
- Reporting and SLA indicators

---

## Reflection

This project shows how a **simple, well‑structured system** can effectively model real operational needs.

It prioritises clarity, maintainability, and relevance to **IT support and junior engineering roles**, rather than unnecessary complexity.

---

## Author

**Gregory John Carberry**  
GitHub: https://github.com/GregoryCarberry  
LinkedIn: https://www.linkedin.com/in/gregory-carberry  
