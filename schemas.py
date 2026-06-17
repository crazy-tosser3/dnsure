from pydantic import BaseModel
from typing import Dict

class Check(BaseModel):
    host_to_check: str
    check_type: Dict[str, bool]
    agents_location: str
    agent_uuid: str
