from pydantic import BaseModel
from typing import List, Optional, Literal, Dict, Any
class PlanStep(BaseModel):
    id: str
    title: str
    status: Literal["pending", "running", "done", "failed"]
    command: Optional[str] = None
    memory_write: Optional[Dict[str, Any]] = None
    output: Optional[str] = None
    error: Optional[str] = None
class PendingPlan(BaseModel):
    plan_id: str
    scripted: bool = True
    steps: List[PlanStep]
class PlanDecisionRequest(BaseModel):
    plan_id: str
    scope: Literal["all", "step"]
    step_id: Optional[str] = None
class PlanDecisionResult(BaseModel):
    plan_id: str
    scope: Literal["all", "step"]
    step_id: Optional[str] = None
    status: Literal["approved", "rejected"]
class PlanEvent(BaseModel):
    ts: str
    kind: str
    payload: Dict[str, Any]