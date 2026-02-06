from fastapi import APIRouter
from ..schemas.forge import PlanSpec, PlanStatus, HealRequest, HealResult
from ..lib._loader import get_forge
router = APIRouter()
@router.post("/plan/new", response_model=PlanStatus)
async def create_plan(spec: PlanSpec) -> PlanStatus:
    forge = get_forge()
    return await forge.create_plan(spec.name, spec.goal)
@router.post("/plan/run", response_model=PlanStatus)
async def run_plan(plan_id: str) -> PlanStatus:
    forge = get_forge()
    return await forge.run_plan(plan_id)
@router.post("/plan/verify", response_model=PlanStatus)
async def verify_plan(plan_id: str) -> PlanStatus:
    forge = get_forge()
    return await forge.verify_plan(plan_id)
@router.post("/plan/heal", response_model=HealResult)
async def heal_plan(req: HealRequest) -> HealResult:
    forge = get_forge()
    return await forge.heal_plan(req.plan_id, req.step_id)