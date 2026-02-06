from pydantic import BaseModel
from typing import List, Optional, Dict
class ConsoleCommand(BaseModel):
    command: str
    args: Optional[List[str]] = None
class ConsoleResult(BaseModel):
    output: str
    success: bool
class ConsoleEvent(BaseModel):
    ts: str
    kind: str
    payload: Dict