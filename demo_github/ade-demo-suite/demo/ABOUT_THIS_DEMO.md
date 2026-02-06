# ABOUT THIS DEMO — ADE Demo Suite (Local)
This folder is a **local, self-contained vision demo** of an environment that helps you work with code, tools and configuration in a more structured way.
It is not a full product. It is a small, scripted playground that shows how a console, an observer, a planner and a memory can work together.
---
## 1. What you are seeing
The demo combines four simple building blocks:
- **Console** — a central place to run commands and see structured output.
- **Observer** — a component that watches for repetitive patterns and surfaces suggestions.
- **Forge** — a planner that returns small, human-readable plans.
- **Memory** — a store for notes and decisions that can be recalled later.
In this local version:
- everything runs in **DEMO_MODE=1**,
- all behavior is driven by **stubs** and **JSON scenarios**,
- no real services or production files are touched.
You can think of it as a “movie set” that shows how things could work, without exposing the real machinery behind the scenes.
---
## 2. How it works (high level)
At a high level:
- The **backend** (FastAPI) exposes a small set of HTTP endpoints under `/api/*`.
- The **UI** (Vite + React) talks to these endpoints and renders:
  - Console, Observer, Forge and Memory tabs,
  - a Guided Demo overlay for the Observer scenario.
- The **scenarios** under `demo/scenarios/` describe scripted stories:
  - an observer noticing a repetitive pattern around a configuration file,
  - a small plan that stabilizes a configuration,
  - a memory that recalls a past decision.
- The **runner** (`demo/demo_runner.py`) replays these stories by sending HTTP requests to the backend.
Everything is local to this folder. If you later decide to publish it as a GitHub repo, the structure is already compatible.
---
## 3. What this demo is NOT
This demo is intentionally limited:
- It is **not** a production-ready product.
- It is **not** the real engine code.
- It is **not** a performance or scalability benchmark.
The real implementation lives in a separate, private codebase. Here you only see:
- a small backend,
- a small UI,
- deterministic stubs,
- scripted scenarios.
The focus is on the **experience** and the **interfaces**, not on internal algorithms or infrastructure.
---
## 4. Who this demo is for
This demo is meant to be understandable by:
- people who work with code and infrastructure,
- people who design products and workflows,
- people who are curious about how automation and observation can help.
You do not need to read or write code to follow the main story. The Guided Demo explains what is happening in plain language.
---
## 5. How to explore
If you have a few minutes:
1. Follow the main `README.md` in this folder:
   - run `scripts/run-demo.sh` or `scripts/run-demo.ps1`,
   - open the UI in your browser.
2. Click **“Run Guided Demo”** in the UI:
   - read the overlay,
   - watch the Observer tab.
3. Optionally, run:
   ```bash
   python demo/demo_runner.py --scenario observer
   ```
   and see how events and suggestions appear.
If you want more detail:
- read `README_guided_demo_observer.md` for a full walkthrough of the Observer scenario,
- inspect `demo/scenarios/*.json` to see how the stories are encoded,
- look at `backend/stubs/*.py` to understand how the stubs behave.
---
## 6. Next steps
From here, you can:
- adapt the scenarios to your own context,
- refine the UI,
- decide if and when to publish this folder as a public GitHub repo.
This demo is a **starting point**: a concrete, replayable story about how a console, an observer, a planner and a memory could support everyday work, without exposing any sensitive implementation details.