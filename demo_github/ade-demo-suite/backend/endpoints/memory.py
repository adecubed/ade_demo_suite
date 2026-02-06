from fastapi import APIRouter
from ..schemas.memory import MemoryPutRequest, MemoryQueryRequest, MemoryItem
from ..lib._loader import get_memory
router = APIRouter()
@router.post("/put")
async def put_memory(req: MemoryPutRequest):
    memory = get_memory()
    return await memory.put(req.key, req.content, req.tags)
@router.post("/query")
async def query_memory(req: MemoryQueryRequest):
    memory = get_memory()
    return await memory.query(req.query, req.limit)