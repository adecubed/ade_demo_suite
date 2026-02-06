# ADE Demo Suite — Scenarios
This document describes the three main scenarios implemented in the ADE Demo Suite.
All scenarios are:
- defined as JSON files under `demo/scenarios/`,
- replayed by `demo/demo_runner.py`,
- visible through the UI tabs (Console, Observer, Forge, Memory).
The scenarios are scripted and deterministic. They are designed to illustrate ideas, not to cover every real-world case.
---
## 1. Scenario 1 — Observer workflow
File:
- `demo/scenarios/scenario1_observer.json`
Narrative:
- You edit a configuration file.
- You restart a service multiple times in a similar way.
- The Observer recognizes this as a repetitive pattern.
- It suggests automating or hardening the restart flow.
Technical flow:
1. `demo_runner.py` loads `scenario1_observer.json`.
2. For each event, it calls:
   ```http
   POST /api/observer/analyze
   ```
   with a payload that includes:
   - a timestamp,
   - a source (for example, editor, terminal, filesystem),
   - a kind (for example, file edit, command run),
   - a small payload with details.
3. The Observer stub:
   - records events in memory,
   - generates a deterministic suggestion (for example, to automate a restart flow).
4. The UI (Observer tab) fetches:
   ```http
   GET /api/observer/events?limit=...
   GET /api/observer/suggest
   ```
   and displays:
   - the event timeline,
   - the suggestion list.
This scenario is the one used by the Guided Demo overlay.
---
## 2. Scenario 2 — Forge plan
File:
- `demo/scenarios/scenario2_forge_fix.json`
Narrative:
- You ask the system to “stabilize config”.
- Forge builds a small plan with a few steps.
- The plan runs and completes successfully.
Technical flow:
1. `demo_runner.py` loads `scenario2_forge_fix.json`.
2. It calls:
   ```http
   POST /api/forge/plan/new
   ```
   with a payload that includes:
   - a plan name,
   - a short goal description.
3. The Forge stub returns a plan status with:
   - a `plan_id`,
   - a `status` (for example, `created`),
   - a list of steps (each with an id, description and status).
4. Then `demo_runner.py` calls:
   ```http
   POST /api/forge/plan/run
   ```
   and the stub returns an updated plan status where all steps are marked as completed.
5. The UI (Forge tab) displays the plan and its steps.
This scenario shows how a small plan can structure a change into clear steps.
---
## 3. Scenario 3 — Memory recall
File:
- `demo/scenarios/scenario3_memory.json`
Narrative:
- You save a note about a decision (for example, “avoid restarts during peak hours”).
- Later, when a similar situation appears, you query memory.
- The note is retrieved and shown as context.
Technical flow:
1. `demo_runner.py` loads `scenario3_memory.json`.
2. It calls:
   ```http
   POST /api/memory/put
   ```
   with a payload that includes:
   - a key,
   - a content string,
   - optional tags.
3. The Memory stub stores the item in RAM with a timestamp.
4. Later, `demo_runner.py` calls:
   ```http
   POST /api/memory/query
   ```
   with:
   - a free-text query,
   - an optional limit.
5. The Memory stub returns a list of items that match the query, ordered by timestamp (most recent first).
6. The UI (Memory tab) displays the results.
This scenario shows how even a simple memory can help recall past decisions.
---
## 4. Live scenario helper — micro_live.py
File:
- `demo/micro_live.py`
Purpose:
- Watch a file under `demo/sandbox/` (for example, a configuration file).
- On each change, send a live event to the Observer:
  ```http
  POST /api/observer/analyze
  ```
- Let you see how the Observer reacts to real edits in the sandbox file.
This script is optional and meant for experimentation. It stays within the demo folder and does not touch files outside it.
---
## 5. Safety
Across all scenarios:
- No real services or production files are touched.
- All endpoints are local to the demo backend.
- All behavior is deterministic and scripted.
- No external network calls are made.
Use these scenarios as **building blocks** to think about:
- your own incidents and workflows,
- how an observer, a planner and a memory engine could help,
- what a “day with this kind of environment” could look like, without exposing any sensitive implementation details.