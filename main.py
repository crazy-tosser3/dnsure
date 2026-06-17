from fastapi import FastAPI
from schema import ConnInfo, CheckInfo

app = FastAPI(title="dnsure")

@app.post("/api/agent_add")
async def agent_add(conn_info: ConnInfo):
    """ПОИНТ ДЛЯ РЕГИСТРАЦИИ АГЕНТА"""
    ...

@app.delete("/api/agent_del")
async def agent_del(conn_info: ConnInfo):
    """ПОИНТ ДЛЯ УДАЛЕНИЯ АГЕНТА"""
    ...

@app.get("/api/get_agents")
async def get_agents():
    """ПОИНТ ДЛЯ ПОЛУЧЕНИЯ СПИСКА АГЕНТОВ"""
    ...

@app.post("/api/start_chenk")
async def start_chenk(check_info: CheckInfo):
    """ПОИНТ ДЛЯ ЗАПУСКА ПРОВЕРКИ"""
    ...