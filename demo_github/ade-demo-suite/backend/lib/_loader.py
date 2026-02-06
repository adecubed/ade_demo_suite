import os

# Stub "classici" per console / observer (sotto backend/lib/stubs)
from .stubs import console_stub as lib_console_stub
from .stubs import observer_stub as lib_observer_stub

# Stub Forge e Memory allineati agli schemi Pydantic (sotto backend/stubs)
from ..stubs import forge_stub as new_forge_stub
from ..stubs import memory_stub as new_memory_stub

DEMO_MODE = os.getenv("DEMO_MODE", "1")

# Istanza singleton per ogni stub, così lo stato in-RAM è condiviso
_console_instance = None
_forge_instance = None
_observer_instance = None
_memory_instance = None


def get_console():
    global _console_instance
    if DEMO_MODE == "1":
        if _console_instance is None:
            _console_instance = lib_console_stub.ConsoleStub()
        return _console_instance
    raise Exception("Real engines not available in this local demo")


def get_forge():
    global _forge_instance
    if DEMO_MODE == "1":
        if _forge_instance is None:
            _forge_instance = new_forge_stub.ForgeStub()
        return _forge_instance
    raise Exception("Real engines not available in this local demo")


def get_observer():
    global _observer_instance
    if DEMO_MODE == "1":
        if _observer_instance is None:
            _observer_instance = lib_observer_stub.ObserverStub()
        return _observer_instance
    raise Exception("Real engines not available in this local demo")


def get_memory():
    global _memory_instance
    if DEMO_MODE == "1":
        if _memory_instance is None:
            _memory_instance = new_memory_stub.MemoryStub()
        return _memory_instance
    raise Exception("Real engines not available in this local demo")