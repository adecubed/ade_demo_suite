from pydantic import BaseModel
class DemoStartResponse(BaseModel):
    ok: bool
    scenario: str
    status: str
    pid: int | None = None