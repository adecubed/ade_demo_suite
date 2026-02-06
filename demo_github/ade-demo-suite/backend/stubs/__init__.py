from typing import Optional
from .memory_stub import MemoryStub
from .forge_stub import ForgeStub
_MEMORY_STUB: Optional[MemoryStub] = None
_FORGE_STUB: Optional[ForgeStub] = None
def get_memory_stub() -> MemoryStub:
    global _MEMORY_STUB
    if _MEMORY_STUB is None:
        _MEMORY_STUB = MemoryStub()
    return _MEMORY_STUB
def get_forge_stub() -> ForgeStub:
    global _FORGE_STUB
    if _FORGE_STUB is None:
        _FORGE_STUB = ForgeStub()
    return _FORGE_STUB