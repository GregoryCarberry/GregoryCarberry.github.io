# 🎫 Ticket Triage Dashboard — Case Study

## Project Summary

The **Ticket Triage Dashboard** is a full‑stack web application designed to mirror the **core workflows of a first‑line IT service desk**.  
It focuses on how tickets are **received, prioritised, and tracked**, rather than on complex UI features or heavy frameworks.

The project was built to demonstrate:
- Practical use of **React** for data‑driven UIs
- Clear separation between frontend and backend concerns
- A clean, predictable **RESTful API**
- Realistic support‑desk concepts relevant to junior IT and support roles

---

## Problem Statement

In many IT support environments, first‑line teams rely on dashboards that provide **fast visibility** into:

- Incoming incidents
- Ticket priority and urgency
- Current ticket status
- Workload distribution

These tools must be:
- Simple to understand at a glance
- Reliable and predictable
- Easy to extend as processes mature

The goal of this project was to recreate that **core triage experience** in a lightweight, easy‑to‑review codebase.

---

## Approach

The solution was designed as a **small, clearly scoped full‑stack application**, avoiding unnecessary complexity.

### Architectural Choices

- **React (Vite)** for a fast, modern frontend with minimal boilerplate
- **Node.js + Express** for a simple REST API
- **JSON file storage** to keep focus on API contracts and UI logic
- Explicit **client/server separation** to reflect real‑world deployments

This approach keeps the project:
- Easy to reason about
- Fast to run locally
- Suitable as a foundation for future enhancements

---

## Application Flow

1. The React frontend loads and requests ticket data from the API
2. The REST API responds with structured ticket objects
3. Tickets are rendered in a tabular view
4. Priority and status are visually emphasised to support quick triage decisions

```
Client (React)
   ↓ fetch()
REST API (Express)
   ↓
Ticket Data (JSON)
```

---

## Key Features

### Ticket Visibility
- Clear table layout showing:
  - Ticket ID
  - Short description
  - Priority
  - Status

### Status Awareness
- Colour‑coded status badges allow agents to:
  - Quickly identify new or unresolved tickets
  - Distinguish active work from completed tasks

### Clean API Consumption
- All ticket data is retrieved via a REST endpoint
- Frontend logic is decoupled from data storage

---

## Technical Stack

| Area | Technology |
|---|---|
| Frontend | React, JavaScript, Vite |
| Backend | Node.js, Express |
| API | REST |
| Data Store | JSON (file‑based) |
| Version Control | Git, GitHub |

---

## Design Decisions & Trade‑offs

- **No database**  
  Chosen deliberately to reduce setup complexity and keep the focus on API usage.

- **No authentication**  
  Authentication was intentionally excluded to keep scope tight and avoid distracting from core triage logic.

- **Minimal styling**  
  UI design prioritises clarity and readability over visual polish.

These trade‑offs reflect real internal tools, where speed, clarity, and reliability are often more important than aesthetics.

---

## Outcomes

This project demonstrates:
- Practical understanding of **service desk workflows**
- Ability to build and consume a **RESTful API**
- Competence with **React hooks and component structure**
- Clean project organisation suitable for collaboration

It provides a solid foundation that could be extended into a more complete ticketing system if required.

---

## Future Enhancements

Planned or potential improvements include:

- Creating and updating tickets (`POST` / `PATCH` endpoints)
- Ticket filtering and search
- SLA and ageing indicators
- Authentication and role‑based access
- Database persistence (e.g. SQLite or PostgreSQL)
- Basic reporting and metrics

---

## Reflection

This project was intentionally scoped to reflect **real‑world first‑line support scenarios**, rather than building a feature‑heavy demo.

It shows how a simple, well‑structured system can:
- Solve a clear operational problem
- Remain easy to maintain and extend
- Communicate technical competence without unnecessary complexity

---

## Author

**Gregory John Carberry**  
GitHub: https://github.com/GregoryCarberry  
LinkedIn: https://www.linkedin.com/in/gregory-carberry  
