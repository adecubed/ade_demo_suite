# ADE Demo Suite — Architecture (Local Demo)
This document describes the high-level architecture of the ADE Demo Suite as implemented in this local folder.
The goal is to explain how the pieces fit together, without exposing internal implementation details of the real system.
---
## 1. Overview
The demo is built around four pillars:
- **Console**
- **Observer**
- **Forge**
- **Memory**
Each pillar is represented in:
- the **backend** (FastAPI endpoints + stubs),
- the **UI** (React tabs and components),
- the **scenarios** (JSON stories and a runner script).
Everything runs locally, in **DEMO_MODE=1**, with deterministic behavior.
---
## 2. Backend
The backend lives under `backend/` and is a FastAPI application.
### 2.1. Entry point
- `backend/main.py`:
  - creates the FastAPI app,
  - mounts routers for:
    - `/api/console`
    - `/api/observer`
    - `/api/forge`
    - `/api/memory`
  - configures CORS for the local UI.
The backend listens on `ADE_DEMO_PORT` (default `8001`), as configured by the run scripts.
### 2.2. Schemas
Under `backend/schemas/` you will find Pydantic models that define the JSON contracts used by the endpoints, for example:
- **Console**
  - command payloads and result shapes,
  - history events.
- **Forge**
  - plan specifications,
  - plan status with steps,
  - heal requests and results.
- **Observer**
  - observation events,
  - suggestions.
- **Memory**
  - put/query requests,
  - memory items with timestamps.
These schemas are intentionally simple and self-contained.
### 2.3. Endpoints
Under `backend/endpoints/`:
- `console.py`
  - `POST /api/console/exec`
  - `GET /api/console/history`
- `forge.py`
  - `POST /api/forge/plan/new`
  - `POST /api/forge/plan/run`
  - (optionally) verify/heal endpoints for completeness.
- `observer.py`
  - `POST /api/observer/analyze`
  - `GET /api/observer/events`
  - `GET /api/observer/suggest`
- `memory.py`
  - `POST /api/memory/put`
  - `POST /api/memory/query`
  - `GET /api/memory/list` (for inspection)
Each endpoint delegates to a stub implementation that returns deterministic data.
### 2.4. Loader and stubs
Under `backend/lib/` and `backend/stubs/`:
- `_loader.py`
  - reads `DEMO_MODE` from the environment,
  - routes calls to stubs when `DEMO_MODE=1`.
- `_downloader.py`
  - intentionally hard-disabled in this local demo (no network calls, no downloads).
- `stubs/*.py`
  - `console_stub.py`
  - `forge_stub.py`
  - `observer_stub.py`
  - `memory_stub.py`
These stubs implement the demo behavior:
- Console: fixed responses for a small set of commands.
- Forge: small demo plans with predictable statuses.
- Observer: in-memory events and a deterministic suggestion.
- Memory: in-memory store for the process lifetime.
No real engines or external services are used.
---
## 3. UI
The UI lives under `ui/` and is a Vite + React application.
### 3.1. Entry point
- `ui/src/App.tsx`:
  - renders the main layout,
  - defines the tab bar (Console, Observer, Forge, Memory),
  - implements the **Guided Demo** overlay for the Observer scenario,
  - calls the backend endpoints via HTTP.
The UI is started by `npm run dev` (triggered by the run scripts) and listens on `http://127.0.0.1:5173`.
### 3.2. Tabs
- **Console tab**
  - sends commands to `/api/console/exec`,
  - fetches history from `/api/console/history`,
  - displays command/output pairs.
- **Observer tab**
  - fetches events from `/api/observer/events`,
  - fetches suggestions from `/api/observer/suggest`,
  - shows a timeline of events and a list of suggestions.
- **Forge tab**
  - creates plans via `/api/forge/plan/new`,
  - runs plans via `/api/forge/plan/run`,
  - displays plan status and steps.
- **Memory tab**
  - writes items via `/api/memory/put`,
  - queries via `/api/memory/query`,
  - shows results ordered by timestamp.
### 3.3. Guided Demo overlay
The Guided Demo overlay:
- focuses on the Observer scenario,
- shows a narrated timeline,
- explains how to reproduce the scenario using `demo/demo_runner.py`,
- simulates a safe conversation in the Chat tab (read → propose patch → approve).
The overlay is purely UI logic; it does not expose any internal engine behavior.
---
## 4. Scenarios and runner
Under `demo/`:
- `scenarios/scenario1_observer.json`
- `scenarios/scenario2_forge_fix.json`
- `scenarios/scenario3_memory.json`
- `demo_runner.py`
- `micro_live.py`
- `sandbox/` (for local files like `config.yaml`)
### 4.1. Scenarios
Each scenario JSON encodes a small story:
- **Observer**: editor focus, file edit, terminal focus, command run, observer hint.
- **Forge**: plan request, steps, simulated states.
- **Memory**: notes saved, query that retrieves them.
The JSON files are simple and can be inspected or modified without touching the backend.
### 4.2. Runner
`demo_runner.py`:
- loads a scenario JSON,
- sends HTTP requests to the backend (`/api/observer/analyze`, `/api/forge/*`, `/api/memory/*`),
- optionally sleeps between events to simulate time.
`micro_live.py`:
- watches `demo/sandbox/config.yaml`,
- on change, sends a live event to `/api/observer/analyze`.
These scripts are optional helpers to make the demo more dynamic.
---
## 5. Scripts
Under `scripts/`:
- `run-demo.sh` (Linux/macOS)
- `run-demo.ps1` (Windows PowerShell)
Both:
- set `DEMO_MODE=1`,
- start the backend on `ADE_DEMO_PORT` (default 8001),
- start the UI dev server on port 5173.
They are thin wrappers around standard `uvicorn` and `npm run dev` commands.
---
## 6. Safety and boundaries
The architecture is intentionally conservative:
- no real services or production files are touched,
- no external network calls are made,
- `_downloader.py` is hard-disabled in this local demo.
The focus is on:
- clear separation between contracts and implementations,
- explicit stubs for demo behavior,
- a path to real engines in the future, without exposing them here.