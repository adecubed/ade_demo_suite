from pydantic import BaseModel
from typing import List, Optional
class MemoryPutRequest(BaseModel):
    key: str
    content: str
    tags: Optional[List[str]] = None
class MemoryQueryRequest(BaseModel):
    query: str
    limit: Optional[int] = None
class MemoryItem(BaseModel):
    key: str
    content: str
    tags: List[str]
    ts: str