from fastapi import APIRouter
from ..schemas.console import ConsoleCommand, ConsoleResult
from ..lib._loader import get_console
router = APIRouter()
@router.post("/exec", response_model=ConsoleResult)
async def execute(cmd: ConsoleCommand):
    console = get_console()
    return await console.execute(cmd.command, cmd.args)
@router.get("/history")
async def history():
    console = get_console()
    return {"history": await console.get_history()}