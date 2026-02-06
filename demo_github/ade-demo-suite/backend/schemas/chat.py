from pydantic import BaseModel
from typing import Optional, Dict, Any
class ChatRequest(BaseModel):
    message: str
class ChatResponse(BaseModel):
    assistant_message: str
    pending_plan: Optional[Dict[str, Any]] = None