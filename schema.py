from pydantic import BaseModel
from typing import List

class ConnInfo(BaseModel):
    agents_location: str
    host: str
    port: int
    uuid: str


class CheckInfo(BaseModel):
    host_to_check: str
    check_type: List[str]
    agents_location: str

