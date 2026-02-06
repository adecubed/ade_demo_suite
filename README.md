# ADE Demo Suite

**A vision demo for an AI-native development control layer**

> **Note**: This is a demonstration, not a production product.  
> Built by **ADE Cubed Inc.**, a Delaware corporation.

---

## What is ADE?

**ADE (Arkhon Development Environment)** is a companion environment that sits next to your existing tools and helps you:

- **See** what's happening (Observer)
- **Decide** what to do next (Forge / Planner)
- **Execute** safely (Console)
- **Remember** why things were done (Memory)

**ADE is not** a chatbot or an IDE replacement.  
**ADE is** a control layer that plans actions and keeps humans in the loop.

---

## What This Demo Shows

This demo presents, in a **scripted and deterministic way**:

- A mini **Console** for ADE-style commands
- An **Observer** that spots repetitive patterns
- A **Forge** planner that returns demo plans
- A **Memory** engine for storing notes
- A **Chat + approval loop** where actions run only after human approval

**Everything is**:
- Local (runs on your machine)
- Safe (DEMO_MODE=1, no real files touched)
- Deterministic (scripted scenarios)

**This is NOT**:
- Production-ready code
- The real ADE engine (that's private)
- Open source (proprietary, evaluation license)

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/adecubed/ade-demo_suite
cd adedemo/projects/demo_github/ade-demo-suite

# Install dependencies
pip install -r backend/requirements.txt
cd ui && npm install && cd ..

# Start demo (Linux/macOS)
chmod +x scripts/run-demo.sh
./scripts/run-demo.sh

# Start demo (Windows PowerShell)
.\scripts\run-demo.ps1

# Open http://localhost:5173 in your browser
```

**Takes 2 minutes to run.** No signup. No cloud services. No external dependencies.

---

## Documentation

DEMO.md - Complete installation and usage guide
README_guided_demo_observer.md - Guided Demo (Observer scenario) deep dive
PITCH.md - Problem statement, vision, and positioning
INVESTOR_FAQ.md - Frequently asked questions
docs/ARCHITECTURE.md - Backend/UI/stubs architecture
docs/SCENARIOS.md - Technical scenario descriptions

---

## Exploring the Demo

Once running at `http://localhost:5173`:

1. **Click "Run Guided Demo"** in the header for a narrative walkthrough of the Observer scenario
2. **Explore the tabs** - Console, Observer, Forge, Memory
3. **Run the scripted scenarios**:
   ```bash
   python demo/demo_runner.py --scenario observer
   python demo/demo_runner.py --scenario forge
   python demo/demo_runner.py --scenario memory
   ```

All actions are local and safe. No side effects on your system.

---

## For Investors and Partners

This demo serves as a **conversation starter** about:

- What an "AI-native development environment" could feel like in practice
- How Observer + Planner patterns can reduce operational toil
- Where the boundaries between automation and human control should be

**Behind this demo**, ADE Cubed Inc. operates a more advanced internal stack with:
- A real DevConsole
- A proactive Observer engine
- A Forge planner executing real plans
- A DB-backed memory and event store

**This repository represents the public surface** - a safe, shareable vision demo designed for evaluation and discussion.

**Contact**: investors@adecubed.com

---

## Safety and Privacy

This demo:
- Runs entirely locally (DEMO_MODE=1)
- Makes no external network calls
- Modifies no files on your system
- Uses only scripted, deterministic scenarios

Safe to run on your laptop without any risk to your existing environment.

---

## License

**Proprietary - Evaluation Only**

Copyright (c) 2026 ADE Cubed Inc. All Rights Reserved.

This software is provided for evaluation and demonstration purposes only.  
See [LICENSE](./LICENSE) for complete terms.

For commercial licensing inquiries: legal@adecubed.com

---

**If this vision resonates with you, please star the repository and share it with your network.**

---

(c) 2026 ADE Cubed Inc., a Delaware corporation.
