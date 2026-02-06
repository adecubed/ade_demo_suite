from fastapi import APIRouter, Depends
from ..schemas import ChatRequest, ChatResponse, PendingPlan, PlanStep
from ..stubs import get_memory_stub, get_forge_stub
from .plan import set_pending_plan
router = APIRouter(prefix="/chat", tags=["chat"])
@router.post("/send", response_model=ChatResponse)
async def send_chat(
    req: ChatRequest,
    memory=Depends(get_memory_stub),
    forge=Depends(get_forge_stub),
) -> ChatResponse:
    text = req.message.strip()
    # Scripted: se l'utente parla di backup, attiva lo scenario0
    if "backup" in text.lower():
        plan_dict = forge.get_or_create_scripted_backup_plan()
        steps = [
            PlanStep(
                id=s["id"],
                title=s["title"],
                status="pending",
                command=s.get("command"),
                memory_write=s.get("memory_write"),
            )
            for s in plan_dict["steps"]
        ]
        pending = PendingPlan(plan_id=plan_dict["plan_id"], scripted=True, steps=steps)
        set_pending_plan(pending)
        assistant_message = "[DEMO] I have prepared a scripted plan for the ADE backup. You can approve or reject the steps."
        return ChatResponse(
            assistant_message=assistant_message,
            pending_plan=pending.dict(),
        )
    # Fallback: risposta fissa senza piano
    assistant_message = "[DEMO] This is a fixed response from the demo chat."
    return ChatResponse(
        assistant_message=assistant_message,
        pending_plan=None,
    )