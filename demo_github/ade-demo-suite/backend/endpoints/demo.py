import os
import sys
from subprocess import Popen
from fastapi import APIRouter, HTTPException, Query
from ..schemas.demo import DemoStartResponse
router = APIRouter()
@router.post("/start", response_model=DemoStartResponse)
async def start_demo(
    scenario: str = Query(..., pattern="^(observer|forge|memory)$")
) -> DemoStartResponse:
    """
    Start the demo_runner.py script in the background with the requested scenario.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    demo_dir = os.path.join(base_dir, "demo")
    script_path = os.path.join(demo_dir, "demo_runner.py")
    if not os.path.isfile(script_path):
        raise HTTPException(status_code=500, detail="demo_runner.py non trovato")
    cmd = [sys.executable, script_path, "--scenario", scenario]
    try:
        proc = Popen(cmd, cwd=demo_dir)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to start demo: {e}")
    return DemoStartResponse(
        ok=True,
        scenario=scenario,
        status="started",
        pid=proc.pid if proc and proc.pid else None,
    )