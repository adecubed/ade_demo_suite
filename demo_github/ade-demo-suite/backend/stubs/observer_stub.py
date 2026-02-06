import datetime
from typing import Any, Dict, List
from ..schemas.observer import ObservationEvent, Suggestion
class ObserverEngineStub:
    """
    Motore Observer stub "ricco" per la demo.
    - Mantiene una lista in-RAM di eventi (ObservationEvent).
    - Mantiene una lista in-RAM di suggerimenti (Suggestion).
    - analyze(): riceve un payload generico, crea un evento e, se riconosce pattern
      semplici, aggiunge un suggerimento.
    """
    def __init__(self) -> None:
        self._events: List[ObservationEvent] = []
        self._suggestions: List[Suggestion] = []
        # Seed iniziale: un evento e un suggerimento demo, così la UI non è vuota.
        now = datetime.datetime.now().isoformat()
        seed_event = ObservationEvent(
            ts=now,
            source="FSWatcher",
            kind="FS_CHANGE",
            payload={"path": "config.yaml"},
        )
        self._events.append(seed_event)
        seed_suggestion = Suggestion(
            id="sug_001",
            title="Automate Restart",
            description="You edited config.yaml 3 times. Automate docker-compose restart?",
            action_hint="read scripts/auto-restart.sh",
        )
        self._suggestions.append(seed_suggestion)
    async def get_events(self, limit: int = 10) -> List[ObservationEvent]:
        """
        Ritorna gli ultimi `limit` eventi in ordine cronologico (più recenti in fondo).
        """
        if limit <= 0:
            return []
        return self._events[-limit:]
    async def get_suggestions(self) -> Dict[str, List[Suggestion]]:
        """
        Ritorna tutti i suggerimenti correnti in un dict {"suggestions": [...]}
        per compatibilità con gli endpoint esistenti.
        """
        return {"suggestions": list(self._suggestions)}
    async def analyze(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analizza un evento generico proveniente dalla demo (demo_runner, micro_live).
        Payload atteso (libero, non tipato rigidamente):
        {
            "type": "<event_type>",
            "payload": { ... }
        }
        """
        ev_type = payload.get("type", "unknown")
        ev_payload = payload.get("payload", {}) or {}
        # Costruiamo un nuovo ObservationEvent a partire dal payload.
        now = datetime.datetime.now().isoformat()
        source = ev_payload.get("source", "demo")
        kind = ev_payload.get("kind", ev_type)
        event = ObservationEvent(
            ts=now,
            source=source,
            kind=kind,
            payload=ev_payload,
        )
        self._events.append(event)
        # Regola demo molto semplice: se vediamo un path "config.yaml" o un tipo "file_edit",
        # aggiungiamo (se non già presente) un suggerimento di automazione.
        path = ev_payload.get("path") or ev_payload.get("file")
        if path == "config.yaml" or ev_type in ("file_edit", "editor"):
            if not any(s.id == "sug_001" for s in self._suggestions):
                sug = Suggestion(
                    id="sug_001",
                    title="Automate Restart",
                    description="You edited config.yaml multiple times. Automate docker-compose restart?",
                    action_hint="read scripts/auto-restart.sh",
                )
                self._suggestions.append(sug)
        # Ritorniamo un piccolo riepilogo per il caller (demo_runner).
        return {
            "status": "ok",
            "recorded_event": {
                "ts": event.ts,
                "source": event.source,
                "kind": event.kind,
                "payload": event.payload,
            },
        }