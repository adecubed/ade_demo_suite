import datetime
class MemoryStub:
    def __init__(self):
        self.store = {}
    async def put(self, key: str, content: str, tags=None):
        self.store[key] = {"content": content, "tags": tags or [], "ts": datetime.datetime.now().isoformat()}
        return {"ok": True}
    async def query(self, query: str, limit: int = None):
        results = [{"key": k, **v} for k, v in self.store.items() if query.lower() in k.lower() or query.lower() in v["content"].lower()]
        return results[:limit] if limit else results