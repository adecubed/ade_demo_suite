import asyncio
import json
from pathlib import Path
from typing import Any, Dict
import httpx
DEMO_BACKEND_BASE = "http://127.0.0.1:8001/api"
SCENARIOS_DIR = Path(__file__).parent / "scenarios"
async def _post(client: httpx.AsyncClient, path: str, payload: Dict[str, Any]) -> None:
    url = f"{DEMO_BACKEND_BASE}{path}"
    resp = await client.post(url, json=payload)
    print(f"[demo_runner] POST {url} -> {resp.status_code}")
    try:
        print(resp.json())
    except Exception:
        print(resp.text)
async def run_scenario_observer(client: httpx.AsyncClient, scenario: Dict[str, Any]) -> None:
    print(f"[demo_runner] Running scenario: {scenario.get('id')}")
    events = scenario.get("events", [])
    for ev in events:
        t = ev.get("t", 0)
        await asyncio.sleep(t / 10.0)
        payload = {
            "type": ev.get("type"),
            "payload": ev.get("payload", {}),
        }
        await _post(client, "/observer/analyze", payload)
async def run_scenario_forge(client: httpx.AsyncClient, scenario: Dict[str, Any]) -> None:
    plan = scenario.get("plan", {})
    name = plan.get("name", "demo_plan")
    goal = plan.get("goal", "Demo goal")
    print(f"[demo_runner] Forge create_plan name={name}")
    await _post(client, "/forge/plan/new", {"name": name, "goal": goal})
    await asyncio.sleep(0.5)
    print(f"[demo_runner] Forge run_plan plan_id={name}")
    await _post(client, f"/forge/plan/run?plan_id={name}", {})
async def run_scenario_memory(client: httpx.AsyncClient, scenario: Dict[str, Any]) -> None:
    items = scenario.get("memory_items", [])
    for item in items:
        await _post(
            client,
            "/memory/put",
            {
                "key": item["key"],
                "content": item["content"],
                "tags": item.get("tags", []),
            },
        )
    queries = scenario.get("queries", [])
    for q in queries:
        await asyncio.sleep(q.get("t", 0) / 10.0)
        await _post(
            client,
            "/memory/query",
            {
                "query": q.get("query", ""),
                "limit": 10,
            },
        )
async def main() -> None:
    import argparse
    parser = argparse.ArgumentParser(description="ADE Demo Suite scenario runner")
    parser.add_argument(
        "--scenario",
        choices=["observer", "forge", "memory"],
        required=True,
        help="Scenario da eseguire",
    )
    args = parser.parse_args()
    scenario_file = {
        "observer": SCENARIOS_DIR / "scenario1_observer.json",
        "forge": SCENARIOS_DIR / "scenario2_forge_fix.json",
        "memory": SCENARIOS_DIR / "scenario3_memory.json",
    }[args.scenario]
    with scenario_file.open("r", encoding="utf-8") as f:
        scenario = json.load(f)
    async with httpx.AsyncClient(timeout=10.0) as client:
        if args.scenario == "observer":
            await run_scenario_observer(client, scenario)
        elif args.scenario == "forge":
            await run_scenario_forge(client, scenario)
        elif args.scenario == "memory":
            await run_scenario_memory(client, scenario)
if __name__ == "__main__":
    asyncio.run(main())