from pydantic import BaseModel
from typing import List, Dict, Optional
class ObservationEvent(BaseModel):
    ts: str
    source: str
    kind: str
    payload: Dict
class DetectedPattern(BaseModel):
    id: str
    label: str
    confidence: Optional[float] = None
class Suggestion(BaseModel):
    id: str
    title: str
    description: str
    action_hint: str