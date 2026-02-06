import asyncio
from pathlib import Path
from typing import Dict, Any
import httpx
DEMO_BACKEND_BASE = "http://127.0.0.1:8001/api"
WATCH_FILE = Path(__file__).parent / "sandbox" / "config.yaml"
async def send_live_event(payload: Dict[str, Any]) -> None:
    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{DEMO_BACKEND_BASE}/observer/analyze"
        resp = await client.post(url, json=payload)
        print(f"[micro_live] POST {url} -> {resp.status_code}")
        try:
            print(resp.json())
        except Exception:
            print(resp.text)
async def watch_file() -> None:
    print(f"[micro_live] Watching {WATCH_FILE}")
    last_mtime = None
    while True:
        if WATCH_FILE.exists():
            mtime = WATCH_FILE.stat().st_mtime
            if last_mtime is None:
                last_mtime = mtime
            elif mtime != last_mtime:
                last_mtime = mtime
                payload = {
                    "type": "file_edit",
                    "payload": {
                        "file": str(WATCH_FILE),
                        "change": "modified",
                    },
                }
                await send_live_event(payload)
        await asyncio.sleep(1.0)
async def main() -> None:
    WATCH_FILE.parent.mkdir(parents=True, exist_ok=True)
    await watch_file()
if __name__ == "__main__":
    asyncio.run(main())