from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from datetime import datetime
from ..schemas import PendingPlan, PlanDecisionRequest, PlanDecisionResult, PlanEvent
from ..stubs import get_memory_stub, get_forge_stub
router = APIRouter(prefix="/plan", tags=["plan"])
_pending_plan: Optional[PendingPlan] = None
_events: List[PlanEvent] = []
def _now() -> str:
    return datetime.utcnow().isoformat()
@router.get("/pending", response_model=Optional[PendingPlan])
async def get_pending_plan() -> Optional[PendingPlan]:
    return _pending_plan
@router.get("/events", response_model=List[PlanEvent])
async def get_plan_events() -> List[PlanEvent]:
    return list(_events)
@router.post("/approve", response_model=PlanDecisionResult)
async def approve_plan(
    req: PlanDecisionRequest,
    memory=Depends(get_memory_stub),
    forge=Depends(get_forge_stub),
) -> PlanDecisionResult:
    global _pending_plan
    if _pending_plan is None or _pending_plan.plan_id != req.plan_id:
        raise HTTPException(status_code=404, detail="No pending plan with this id")
    event = PlanEvent(
        ts=_now(),
        kind="plan_approved",
        payload=req.dict(),
    )
    _events.append(event)
    if req.scope == "all":
        for step in _pending_plan.steps:
            step.status = "done"
        memory.record_decision(
            key=f"plan.{req.plan_id}.approval",
            content="Plan fully approved in demo.",
            tags=["approval", "all"],
        )
    else:
        target = next((s for s in _pending_plan.steps if s.id == req.step_id), None)
        if not target:
            raise HTTPException(status_code=400, detail="Invalid step_id")
        target.status = "done"
        memory.record_decision(
            key=f"plan.{req.plan_id}.step.{req.step_id}.approval",
            content=f"Step {req.step_id} Approved in demo.",
            tags=["approval", "step"],
        )
    return PlanDecisionResult(
        plan_id=req.plan_id,
        scope=req.scope,
        step_id=req.step_id,
        status="approved",
    )
@router.post("/reject", response_model=PlanDecisionResult)
async def reject_plan(
    req: PlanDecisionRequest,
    memory=Depends(get_memory_stub),
) -> PlanDecisionResult:
    global _pending_plan
    if _pending_plan is None or _pending_plan.plan_id != req.plan_id:
        raise HTTPException(status_code=404, detail="No pending plan with this id")
    event = PlanEvent(
        ts=_now(),
        kind="plan_rejected",
        payload=req.dict(),
    )
    _events.append(event)
    if req.scope == "all":
        for step in _pending_plan.steps:
            if step.status == "pending":
                step.status = "failed"
        memory.record_decision(
            key=f"plan.{req.plan_id}.rejection",
            content="Plan fully rejected in demo.",
            tags=["rejection", "all"],
        )
    else:
        target = next((s for s in _pending_plan.steps if s.id == req.step_id), None)
        if not target:
            raise HTTPException(status_code=400, detail="Invalid step_id")
        if target.status == "pending":
            target.status = "failed"
        memory.record_decision(
            key=f"plan.{req.plan_id}.step.{req.step_id}.rejection",
            content=f"Step {req.step_id} Plan rejected in demo.",
            tags=["rejection", "step"],
        )
    return PlanDecisionResult(
        plan_id=req.plan_id,
        scope=req.scope,
        step_id=req.step_id,
        status="rejected",
    )
def set_pending_plan(plan: PendingPlan) -> None:
    global _pending_plan
    _pending_plan = plan
    _events.append(
        PlanEvent(
            ts=_now(),
            kind="plan_created",
            payload={"plan_id": plan.plan_id},
        )
    )