class ForgeStub:
    async def create_plan(self, name: str, goal: str):
        return {
            "plan_id": f"demo_{name}",
            "status": "pending",
            "steps": [
                {"step_id": "step1", "title": "Analyze Config", "status": "pending"},
                {"step_id": "step2", "title": "Apply Fix", "status": "pending"}
            ]
        }
    async def run_plan(self, plan_id: str):
        return {"status": "running", "plan_id": plan_id}