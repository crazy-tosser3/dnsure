from pydantic import BaseModel
<<<<<<< HEAD

class ConnInfo(BaseModel):
    host: str
    port: int
    password: str


class CheckInfo(BaseModel):
    host: str
    check_type: list
    server_location: str


=======
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
>>>>>>> 416e287 (add functionality)

