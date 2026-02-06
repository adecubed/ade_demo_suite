# ADE Demo Suite — Pitch
Built by **ADE Cubed Inc.**, a Delaware corporation.
---
## 1. The problem
Modern development and operations teams are overwhelmed by:
- constant context switching,
- repetitive manual work,
- fragile, undocumented workflows,
- a growing surface of tools, dashboards and scripts.
Knowledge lives:
- in people’s heads,
- in scattered docs,
- in chat logs that nobody revisits.
When something breaks or needs to change:
- the same sequences of actions are repeated over and over,
- the “why” behind decisions is quickly lost,
- onboarding new people is slow and error-prone.
---
## 2. The vision
ADE (Arkhon Development Environment) is a **companion environment** that sits next to your existing tools and helps you:
- **See** what is happening (Observer),
- **Decide** what to do next (Forge / Planner),
- **Execute** safely (Console),
- **Remember** why things were done (Memory).
The goal is not to replace your stack, but to:
- reduce noise,
- surface patterns,
- make repetitive flows safer and more automatable,
- keep a durable memory of decisions and context.
This demo shows what that experience could feel like in a **safe, scripted environment**.
ADE is not a chatbot and not an IDE replacement.
It is a control layer that sits above tools, plans actions, and keeps humans in the loop.
---
## 3. What the demo shows
The ADE Demo Suite is a **movie set** for this vision:
- **Console**
  - runs ADE-style commands,
  - shows structured output and history.
- **Observer**
  - watches a scripted sequence around `config.yaml` and restarts,
  - recognizes a repetitive pattern,
  - proposes an “Automate Restart” suggestion.
- **Forge**
  - builds and runs small demo plans,
  - returns structured plan status and steps.
- **Chat + Approval Loop**
  - the assistant proposes actions as structured plans,
  - the user can approve or reject the whole plan or single steps,
  - execution only happens after explicit approval,
  - decisions (approve/reject) are stored in Memory.
- **Memory**
  - stores and retrieves notes,
  - demonstrates how decisions can be recalled later.
Everything is:
- local,
- deterministic,
- backed by stubs and JSON scenarios.
Behind this demo, ADE Cubed Inc. already operates a more advanced internal stack with:
- a real DevConsole,
- a proactive Observer engine,
- a Forge planner executing real plans,
- a DB-backed memory and event store.
The demo is the **public, shareable surface** of that work.
---
## 4. How it works (high level)
- A **FastAPI backend** exposes HTTP endpoints under `/api/*`:
  - `/api/console/*`
  - `/api/observer/*`
  - `/api/forge/*`
  - `/api/memory/*`
- A **Vite + React UI**:
  - calls these endpoints,
  - renders a mini ADE console with tabs,
  - includes a Guided Demo overlay for the Observer scenario.
- **Stubs and scenarios**:
  - engines are implemented as deterministic stubs,
  - scenarios are defined as JSON files and replayed by a runner script,
  - no real services, files or external APIs are touched.
The architecture mirrors the internal ADE stack, but with:
- in-memory storage instead of the real DB,
- scripted events instead of live telemetry,
- a narrow, safe surface suitable for a public GitHub repo.
---
## 5. Who should care
- **Product leaders**
  - to see how an “AI-native” development environment could feel,
  - to reason about which workflows to target first.
- **Engineering / Infra leaders**
  - to imagine how an Observer + Planner could sit next to existing tools,
  - to discuss integration points (logs, CI/CD, incident tooling).
- **AI / Automation leaders**
  - to explore a concrete, opinionated surface for LLM-powered workflows,
  - to evaluate safety models (plans, approvals, memory, policies).
---
## 6. From demo to product
The path from this demo to a product is incremental:
1. **Validate use cases**
   - incidents, rollouts, migrations, repetitive config changes.
2. **Swap stubs with real engines**
   - Observer connected to real signals,
   - Forge executing real plans in controlled workspaces,
   - Memory backed by a persistent store and policies.
3. **Integrate and harden**
   - connect to version control, CI/CD, observability, identity,
   - add auth, audit, configuration, monitoring, SLOs.
4. **Pilot and iterate**
   - run with selected teams,
   - measure impact on time-to-recovery and repetitive work,
   - refine UX and safety boundaries.
ADE Cubed Inc. is building this path starting from a working internal stack and using this demo as the **shared reference point** for investors, partners and early adopters.
---
© ADE Cubed Inc., a Delaware corporation.