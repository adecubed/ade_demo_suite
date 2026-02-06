from fastapi import APIRouter
from typing import Dict, Any
from ..schemas.observer import ObservationEvent, Suggestion
from ..lib._loader import get_observer
router = APIRouter()
@router.get("/events")
async def get_events(limit: int = 10):
    observer = get_observer()
    return await observer.get_events(limit)
@router.get("/suggest")
async def get_suggestions():
    observer = get_observer()
    return {"suggestions": await observer.get_suggestions()}
@router.post("/analyze")
async def analyze_event(event: Dict[str, Any]):
    """
    Endpoint demo per analizzare un evento observer.
    Usato da demo_runner.py (scenario observer).
    """
    observer = get_observer()
    return await observer.analyze(event)