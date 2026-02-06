import datetime
class ConsoleStub:
    async def execute(self, command: str, args=None):
        if command == "ade-state":
            return {"output": "ADE Status: OPERATIONAL\nPhase: 3\nStep: demo_ready", "success": True}
        return {"output": f"Stub execution of {command}", "success": True}
    async def get_history(self):
        return [
            {"ts": datetime.datetime.now().isoformat(), "kind": "cmd", "payload": {"text": "ade-state"}},
            {"ts": datetime.datetime.now().isoformat(), "kind": "out", "payload": {"text": "ADE Status: OPERATIONAL"}}
        ]