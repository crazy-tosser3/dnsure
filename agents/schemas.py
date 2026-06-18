from pydantic import BaseModel
from typing import Dict

class Check(BaseModel):
    host_to_check: str
    check_type: Dict[str, bool]
    agent_uuid: str

class Heartbeat(BaseModel):
    agent_uuid: str
