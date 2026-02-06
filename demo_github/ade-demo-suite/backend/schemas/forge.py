from pydantic import BaseModel
from typing import List, Dict
class PlanSpec(BaseModel):
    name: str
    goal: str
class PlanStatus(BaseModel):
    plan_id: str
    status: str
    steps: List[Dict]
class HealRequest(BaseModel):
    plan_id: str
    step_id: str
class HealResult(BaseModel):
    plan_id: str
    step_id: str
    status: str