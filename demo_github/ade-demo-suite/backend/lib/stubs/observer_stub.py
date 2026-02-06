import datetime
from typing import Any, Dict, List
# Usiamo il motore stub "ricco" definito in backend/stubs/observer_stub.py
from ...stubs.observer_stub import ObserverEngineStub
class ObserverStub:
    """
    Adattatore sottile sopra ObserverEngineStub per la demo locale.
    - get_events: ritorna lista di dict (come prima), serializzando ObservationEvent.
    - get_suggestions: ritorna lista di dict (come prima), serializzando Suggestion.
    - analyze: nuovo metodo usato da /api/observer/analyze e demo_runner.
    """
    def __init__(self) -> None:
        self._engine = ObserverEngineStub()
    async def get_events(self, limit: int) -> List[Dict[str, Any]]:
        events = await self._engine.get_events(limit)
        # events è una lista di ObservationEvent → serializziamo a dict
        return [e.dict() for e in events]
    async def get_suggestions(self) -> List[Dict[str, Any]]:
        data = await self._engine.get_suggestions()
        # engine.get_suggestions() ritorna {"suggestions": [Suggestion, ...]}
        suggestions = data.get("suggestions", [])
        return [s.dict() for s in suggestions]
    async def analyze(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Pass-through verso ObserverEngineStub.analyze.
        """
        return await self._engine.analyze(payload)