import asyncio
from typing import Dict, Any, List
class ForgeStub:
    """
    Stub Forge engine per la ADE Demo Suite.
    Espone i metodi minimi usati dagli endpoint:
    - create_plan(name, goal)
    - run_plan(plan_id)
    - verify_plan(plan_id)
    - heal_plan(plan_id, step_id)
    Tutti i ritorni sono coerenti con lo schema PlanStatus / HealResult:
    - PlanStatus: { plan_id: str, status: str, steps: List[dict] }
    - HealResult: { plan_id: str, step_id: str, status: str }
    """
    def __init__(self) -> None:
        # memoria in-process dei piani demo
        self._plans: Dict[str, Dict[str, Any]] = {}
    def _ensure_plan(self, plan_id: str, goal: str | None = None) -> Dict[str, Any]:
        if plan_id in self._plans:
            return self._plans[plan_id]
        plan = {
            "plan_id": plan_id,
            "goal": goal or "(demo)",
            "status": "created",
            "steps": [
                {"id": "step1", "title": "Demo step 1"},
                {"id": "step2", "title": "Demo step 2"},
            ],
        }
        self._plans[plan_id] = plan
        return plan
    async def create_plan(self, name: str, goal: str) -> Dict[str, Any]:
        plan_id = name or "demo_plan"
        plan = self._ensure_plan(plan_id, goal)
        plan["status"] = "created"
        self._plans[plan_id] = plan
        # shape compatibile con PlanStatus
        return {
            "plan_id": plan_id,
            "status": "created",
            "steps": plan["steps"],
        }
    async def run_plan(self, plan_id: str) -> Dict[str, Any]:
        await asyncio.sleep(0.1)
        plan = self._ensure_plan(plan_id)
        plan["status"] = "completed"
        self._plans[plan_id] = plan
        return {
            "plan_id": plan_id,
            "status": "completed",
            "steps": plan["steps"],
        }
    async def verify_plan(self, plan_id: str) -> Dict[str, Any]:
        """
        Verifica demo: ritorna sempre 'verified' per il piano richiesto.
        """
        plan = self._ensure_plan(plan_id)
        return {
            "plan_id": plan_id,
            "status": "verified",
            "steps": plan["steps"],
        }
    async def heal_plan(self, plan_id: str, step_id: str) -> Dict[str, Any]:
        """
        Heal demo: simula la correzione di uno step e ritorna 'healed'.
        """
        self._ensure_plan(plan_id)
        return {
            "plan_id": plan_id,
            "step_id": step_id,
            "status": "healed",
        }