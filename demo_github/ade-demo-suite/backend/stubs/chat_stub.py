from typing import List, Dict, Any, Optional
from datetime import datetime
from .memory_stub import MemoryStub
from .forge_stub import ForgeStub
class ChatStub:
    """
    Stub deterministico per la chat demo:
    - restituisce messaggi assistant fissi
    - può allegare un piano 'scripted' per lo scenario0_chat_approve
    """
    def __init__(self, memory: MemoryStub, forge: ForgeStub):
        self.memory = memory
        self.forge = forge
        self._messages: List[Dict[str, Any]] = []
    def send(self, user_message: str) -> Dict[str, Any]:
        ts = datetime.utcnow().isoformat()
        self._messages.append({"ts": ts, "role": "user", "content": user_message})
        # Scripted behavior: se il messaggio contiene "backup" proponiamo il piano demo
        if "backup" in user_message.lower():
            assistant_message = "[DEMO] I can propose a 3-step plan to automate the backup.."
            self._messages.append(
                {"ts": ts, "role": "assistant", "content": assistant_message}
            )
            plan = self.forge.get_or_create_scripted_backup_plan()
            return {
                "assistant_message": assistant_message,
                "pending_plan": plan,
            }
        assistant_message = "[DEMO] This is a fixed response from the demo chat"
        self._messages.append(
            {"ts": ts, "role": "assistant", "content": assistant_message}
        )
        return {
            "assistant_message": assistant_message,
            "pending_plan": None,
        }
    def history(self) -> List[Dict[str, Any]]:
        return list(self._messages)