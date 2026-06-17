from pydantic import BaseModel

class ConnInfo(BaseModel):
    host: str
    port: int
    password: str


class CheckInfo(BaseModel):
    host: str
    check_type: list
    server_location: str



