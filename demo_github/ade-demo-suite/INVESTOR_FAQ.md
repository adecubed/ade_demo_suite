# ADE Demo Suite — Investor FAQ (Local Demo)
This demo and its documentation are developed and maintained by **ADE Cubed Inc.**, a Delaware corporation.
## Is this demo the product?
No. This demo is a **vision demo**: it shows what using this kind of environment every day could feel like.
It is not a production-ready product.
What you see here is a **public-facing surface**:
- a small UI,
- a small FastAPI backend,
- deterministic stubs,
- scripted scenarios.
Behind this demo, there is already a **more advanced internal stack** (console, observer, planner/Forge, memory, DB) that is not exposed in this folder.
---
## Is the code here the real engine?
No. The real implementation lives in a separate, private codebase.
This folder contains:
- a demo UI (mini ADE console),
- a demo backend (FastAPI),
- in-memory stubs for Console, Observer, Forge, Memory,
- JSON scenarios and helper scripts.
The goal is to show:
- the **experience** (how it feels to use it),
- the **interfaces** (HTTP APIs, UI flows),
not the full internal implementation.
The internal stack:
- already includes a richer console (ADE DevConsole),
- a proactive Observer engine integrated with the console,
- a Plan Builder UI wired to a real Forge planner,
- a memory layer with recap and long-term state,
- a real data layer/DB used for observer events, memory items and AXIOM state.
This demo is a **safe, simplified mirror** of that stack.
---
## Can I use this demo in production?
No.
The demo is meant to:
- explore the idea,
- discuss use cases,
- collect feedback,
- align on what a first product version should look like.
It has not been designed, hardened or tested for production environments:
- no HA/scale guarantees,
- no security hardening,
- no SLOs or operational playbooks.
Think of it as a **movie set**: perfect to understand the story and the interfaces, not to run real workloads.
---
## Does this demo call external services or modify my system?
No.
- It runs in **DEMO_MODE=1**.
- All behavior is scripted and deterministic.
- No real services, containers or configuration files on your machine are modified.
- No external network calls are made.
Everything happens:
- inside this local folder,
- in memory,
- under your control.
The goal is to make it **safe to run on a laptop** without any risk to your existing environment.
---
## How does this demo connect to the real implementation?
Conceptually, the architecture is the same:
- **Console**: a command surface to talk to the system.
- **Observer**: watches events and suggests actions.
- **Forge / Planner**: builds and runs plans.
- **Memory**: stores and recalls decisions and context.
- **DB / Data layer**: persists events, state and memory items.
In this demo:
- the backend exposes a small, explicit API surface under `/api/*`,
- a loader is in place to wire engines (here it wires stubs),
- all engines are **deterministic stubs**,
- the “DB” is an in-memory store inside the demo process.
In the internal stack:
- the same ideas (Console/Observer/Planner/Memory/DB) are implemented with real engines,
- the console is richer (DevConsole ADE),
- the observer runs continuously and feeds a live UI widget,
- the planner (Forge) executes real plans against a local workspace,
- the memory layer and observer events are backed by a real DB and long-term state.
The path from this demo to the real implementation is:
- keep the **API surface and UX** stable,
- progressively swap stubs with hardened engines,
- keep the same safety model (explicit plans, human approval, no blind writes).
- A core invariant of both the demo and the real stack is that no plan is executed without explicit human approval.
---
## What is the path towards a product?
From this demo to a product, the path is **incremental** and concrete:
1. **Nail the use cases**
   - Prioritize a small set of high-value workflows:
     - incidents / on-call,
     - rollouts and migrations,
     - repetitive config changes and restarts.
   - Use the demo to align stakeholders on:
     - what “good” looks like,
     - what should be automated vs. what must stay human-in-the-loop.
2. **Harden the engines and integrations**
   - Replace stubs with real engines behind the same API surface:
     - Observer connected to real logs/events,
     - Planner/Forge executing real plans in a controlled workspace,
     - Memory backed by a persistent store.
   - Integrate with existing tools:
     - version control,
     - CI/CD,
     - observability stack,
     - identity and access control.
3. **Productize and operate**
   - Define SKUs / deployment models (local agent, team server, hybrid).
   - Add:
     - authentication and authorization,
     - audit logs,
     - configuration and policy management,
     - monitoring and SLOs.
   - Run pilots with selected teams to validate:
     - impact on time-to-recovery,
     - reduction of repetitive work,
     - user trust and adoption.
This demo is the **conversation starter**: it makes the vision tangible and gives a concrete base to discuss scope, integrations and investment.
---
## How mature is the internal stack today?
Internally, the stack is already beyond a simple prototype:
- **ADE Core**:
  - stable console,
  - command registry,
  - policy engine for safe writes,
  - long-term state and recap,
  - backing DB for AXIOM state and logs.
- **Observer**:
  - proactive engine v1 implemented,
  - background watcher service,
  - integrated with the real DevConsole (badge, side panel, filters),
  - events persisted in a DB.
- **Planner / Forge**:
  - plan builder UI in the DevConsole,
  - commands to run, verify and heal plans,
  - contracts and rules for safe plan execution.
- **Memory**:
  - structured memory layer,
  - recap logic to keep context within model limits,
  - integration with ADE sessions and DB-backed storage.
The demo you see here is a **simplified, self-contained environment** that mirrors these ideas without exposing internal code or infrastructure.
While these components are real and operational internally, they are still evolving and intentionally not exposed as a product yet.
---
## Is this folder a public GitHub repo?
Yes.
This folder is designed and written to be **public from day one**:
- it can live as a standalone GitHub repository,
- it contains only demo code, stubs and documentation,
- it does not expose any private implementation details.
As a public repo, it serves as:
- a **vision demo** for investors and partners,
- a **reference surface** for future integrations,
- a **safe playground** to discuss product direction without exposing internal code.
This repo is not about shipping software.
It is about making a system vision concrete enough to be evaluated, challenged, and refined.
---
© ADE Cubed Inc., a Delaware corporation.