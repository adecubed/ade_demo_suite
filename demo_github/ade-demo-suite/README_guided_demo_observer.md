# ADE Demo Suite — Guided Demo (Observer Scenario)
This document explains in detail how to run and understand the **Guided Demo** of the ADE Demo Suite, focusing on the **Observer** scenario.
The goal is to give you a clear, narrative walkthrough of what happens on screen, why it matters, and how ADE can help you reduce repetitive work — even if you are not a developer or a power user.
---
## 1. What this demo shows
The Guided Demo is a **scripted, deterministic scenario** that illustrates how ADE’s **Observer**:
- watches what is happening around a configuration file (`config.yaml`),
- notices that you keep repeating the same sequence of actions,
- and proposes a suggestion to make that flow safer and less fragile.
In this scenario, ADE is not trying to “read your mind”.
It simply connects a few signals:
1. A configuration file is edited (`config.yaml`).
2. A tool or terminal is used right after the edit.
3. A service is restarted multiple times in a similar way.
From these signals, ADE’s Observer infers that there is a **repetitive pattern** and suggests turning it into a small automation (or at least making it more robust).
---
## 2. Who this demo is for
This demo is intentionally designed to be understandable by:
- people who are comfortable with development tools, and
- people who are **not** familiar with coding or command lines.
You do not need to know how to write code to follow the story.
You only need to recognize a simple pattern:
> “I keep doing the same thing over and over again.
> Maybe the system could help me automate it.”
ADE’s role in this demo is to **highlight that pattern** and to show how it could be automated, not to force you into technical details.
---
## 3. Components involved
The ADE Demo Suite Guided Demo uses four main pieces:
1. **Backend (FastAPI)**
   - Exposes HTTP endpoints under `http://127.0.0.1:8001/api`.
   - Runs in `DEMO_MODE=1` and uses in-memory stubs (no real files or services are touched).
   - Handles:
     - `/api/observer/events`
     - `/api/observer/suggest`
     - `/api/observer/analyze`
     - plus endpoints for Console, Forge, and Memory.
2. **UI (Vite + React)**
   - Runs on `http://127.0.0.1:5173` by default.
   - Provides a mini ADE console with tabs:
     - `Chat`
     - `Console`
     - `Observer`
     - `Forge`
     - `Memory`
   - Includes a **“Run Guided Demo”** button that opens the Guided Demo overlay.
3. **Scenario runner (`demo_runner.py`)**
   - A Python script that replays a predefined scenario by sending events to the backend.
   - For the Observer scenario, it calls:
     - `POST /api/observer/analyze` with a sequence of events (editor focus, file edit, terminal focus, command run, observer hint).
4. **Observer engine stub**
   - A lightweight, in-memory engine that:
     - records events,
     - generates a deterministic suggestion (“Automate Restart”),
     - exposes them via `/api/observer/events` and `/api/observer/suggest`.
---
## 4. How to start the demo (backend + UI)
From the root of the demo suite (`demo_github/ade-demo-suite`), you have two helper scripts:
- `scripts/run-demo.sh` (Linux/macOS)
- `scripts/run-demo.ps1` (Windows PowerShell)
They both:
- set `DEMO_MODE=1`,
- start the FastAPI backend on a configurable port (default `8001`),
- start the Vite UI dev server (default `5173`).
### 4.1. Linux / macOS
From the `demo_github/ade-demo-suite` folder:
```bash
chmod +x scripts/run-demo.sh
./scripts/run-demo.sh
```
What this does:
- starts the backend with:
  - `python -m uvicorn backend.main:app --reload --port 8001`
- waits a couple of seconds,
- starts the UI with:
  - `npm run dev` in the `ui/` directory.
Once both are running, open:
- `http://127.0.0.1:5173` in your browser.
### 4.2. Windows (PowerShell)
From the `demo_github/ade-demo-suite` folder, in a PowerShell terminal:
```powershell
.\scripts\run-demo.ps1
```
Optionally, you can specify a custom port:
```powershell
.\scripts\run-demo.ps1 -Port 8001
```
The script will:
- start the backend with:
  - `python -m uvicorn backend.main:app --reload --port <Port>`
- start the UI with:
  - `npm run dev` in the `ui/` directory.
Then open:
- `http://127.0.0.1:5173` in your browser.
---
## 5. Running the Guided Demo (Observer scenario)
Once the backend and UI are running:
1. Open `http://127.0.0.1:5173` in your browser.
2. You should see the **ADE DEMO CONSOLE** with multiple tabs.
3. In the header, there is a button: **“Run Guided Demo”**.
There are two parts to the Guided Demo:
- the **visual overlay** (narration),
- the **live events** (Observer tab).
### 5.1. Start the Guided Demo overlay
Click the **“Run Guided Demo”** button.
This will:
- switch the active tab to **Observer**,
- open a modal overlay titled **“Guided Demo — Observer scenario”**,
- start a small scripted chat in the **Chat** tab (simulating how ADE would negotiate a file change with you).
The overlay explains, in plain English:
- what the scenario is about,
- what pattern ADE is recognizing,
- how to reproduce the same sequence on your machine.
### 5.2. Replay the Observer scenario events
To actually send the events to the backend and see them appear in the Observer tab:
1. Make sure the demo is running (backend + UI).
2. In a terminal, from the root folder `demo_github/ade-demo-suite`, run:
   ```bash
   python demo/demo_runner.py --scenario observer
   ```
3. Go back to the **Observer** tab in the UI and watch:
   - the **Events** list being populated (timeline of what happened),
   - the **Suggestions** list showing the “Automate Restart” hint.
---
## 6. Step-by-step narrative (what you are seeing)
The Guided Demo overlay includes a timeline of narration steps (`guidedDemoSteps`).
Here is the story in plain English:
1. **t = 0s — A normal work session**
   You are in the middle of a normal work session.
   Your main app is open and you are adjusting a setting that depends on a configuration file.
2. **t = 5s — Editing the configuration**
   You change a value in `config.yaml` to tweak how the system behaves.
   It is a small change, but you know something needs to be restarted for it to take effect.
3. **t = 10s — Restarting the service**
   You switch to your tools and trigger a restart of the service.
   You have already done this several times today, and you will probably do it again.
4. **t = 15s — Observer connects the dots**
   ADE’s Observer connects these events:
   - the edit to `config.yaml`,
   - the focus on the tools/terminal,
   - the service restart.
5. **t = 20s — Recognizing a pattern**
   After a few cycles, the Observer notices a repeating pattern.
   It is not reading your mind: it simply sees that you are repeating the same sequence of actions.
6. **t = 25s — Suggesting automation**
   At this point ADE proposes a suggestion:
   - turn this into a small automation, or
   - at least make the flow safer and less fragile.
7. **t = 30s — Deterministic demo**
   In this local demo the suggestion is predefined and deterministic.
   It is here to show the kind of help ADE can provide in real situations.
8. **t = 35s — Reducing noise, not replacing you**
   The goal is not to replace your work, but to reduce the noise:
   - fewer manual repetitions,
   - more focus on the decisions that really matter.
---
## 7. What the Observer tab shows
In the **Observer** tab you will see two main sections:
1. **Events**
   A chronological list of observation events, for example:
   - `FSWatcher / FS_CHANGE` on `config.yaml`,
   - `editor_focus`,
   - `file_edit`,
   - `terminal_focus`,
   - `command_run` (e.g. a restart command),
   - `observer_hint`.
   Each event includes:
   - a timestamp (`ts`),
   - a source (which watcher produced it),
   - a kind (type of event),
   - a payload (structured details).
2. **Suggestions**
   A list of suggestions generated by the Observer, for example:
   - Title: `Automate Restart`
   - Description: a short explanation of why this pattern was detected.
   - Action hint: a suggestion like “consider creating a small script or command to restart safely whenever config.yaml changes”.
In this demo, the suggestion is **always the same** for this scenario.
In a real system, suggestions would depend on your actual behavior and context.
---
## 8. The Chat tab: simulated ADE conversation
When you click **“Run Guided Demo”**, the **Chat** tab also starts a small scripted conversation.
This conversation is not connected to the backend; it is a **local simulation** of how ADE would:
1. Receive a user request to change a file.
2. Explain that it must:
   - read the file first,
   - show the proposed changes,
   - ask for explicit approval before writing.
3. Propose a `write ... EOF` patch in ADE style.
4. Wait for an “Approve” signal.
5. Apply the change (simulated) and summarize what happened.
The purpose of this chat is to show ADE’s **safety model**:
- no blind writes,
- clear, human-readable patches,
- explicit approval required.
---
## 9. What this demo does NOT do
To keep the demo safe and easy to run:
- It does **not** modify any real configuration files on your system.
- It does **not** restart any real services or containers.
- It does **not** connect to your actual editor or terminal.
Everything is:
- **scripted** (predefined events and suggestions),
- **deterministic** (same input → same output),
- **local** (in-memory stubs, no external dependencies).
The goal is to **show the experience**, not to cover every real-world edge case.
---
## 10. Next steps and ideas
If you want to extend or adapt this demo, you could:
- Add new scenarios to `demo/demo_runner.py` (e.g. a Memory-focused scenario, a Forge plan scenario).
- Customize the Observer stub to generate different suggestions based on different patterns.
- Connect the demo to your own sample project (still in a safe, sandboxed way).
The Guided Demo is just a starting point:
it shows how ADE can sit next to you, watch for repetitive patterns, and gently suggest ways to automate them — without requiring you to be a developer or a power user.