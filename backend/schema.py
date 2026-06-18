from pydantic import BaseModel
from typing import Dict

class ConnInfo(BaseModel):
    agents_location: str
    host: str
    port: int
    uuid: str

class CheckInfo(BaseModel):
    host_to_check: str
    check_type: Dict[str, bool]
    agent_uuid: str
