from typing import Dict, List, Optional
from datetime import datetime, timezone
from ..schemas.memory import MemoryItem
class MemoryStub:
    def __init__(self) -> None:
        self._store: Dict[str, MemoryItem] = {}
    async def put(self, key: str, content: str, tags: Optional[List[str]] = None) -> MemoryItem:
        if tags is None:
            tags = []
        ts = datetime.now(timezone.utc).isoformat()
        item = MemoryItem(key=key, content=content, tags=tags, ts=ts)
        self._store[key] = item
        return item
    async def query(self, query: str, limit: Optional[int] = None) -> List[MemoryItem]:
        items = list(self._store.values())
        if query:
            q = query.lower()
            items = [
                it for it in items
                if q in it.key.lower() or q in it.content.lower()
            ]
        items.sort(key=lambda it: it.ts, reverse=True)
        if limit is not None:
            items = items[:limit]
        return items