import os
import requests
import asyncpg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schema import ConnInfo, CheckInfo

load_dotenv('env_docker')

app = FastAPI(title="dnsure")

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_USER = os.environ.get("POSTGRES_USER")
DB_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
DB_HOST = os.environ.get("POSTGRES_HOST")
DB_PORT = os.environ.get("POSTGRES_PORT")
DB_NAME = os.environ.get("POSTGRES_DB")

DSN = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

@app.on_event("startup")
async def startup_event():
    app.state.db_pool = await asyncpg.create_pool(DSN)
    async with app.state.db_pool.acquire() as conn:
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS agents (
                uuid TEXT PRIMARY KEY,
                agents_location TEXT NOT NULL,
                host TEXT NOT NULL,
                port INTEGER NOT NULL
            )
        ''')

@app.on_event("shutdown")
async def shutdown_event():
    await app.state.db_pool.close()

@app.post("/api/agent_add")
async def agent_add(conn_info: ConnInfo):
    """ПОИНТ ДЛЯ РЕГИСТРАЦИИ АГЕНТА"""
    async with app.state.db_pool.acquire() as conn:
        await conn.execute('''
            INSERT INTO agents (uuid, agents_location, host, port)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (uuid) DO UPDATE SET 
                agents_location = EXCLUDED.agents_location,
                host = EXCLUDED.host,
                port = EXCLUDED.port
        ''', conn_info.uuid, conn_info.agents_location, conn_info.host, conn_info.port)
    return {"message": "Agent registered successfully", "uuid": conn_info.uuid}

@app.delete("/api/agent_del")
async def agent_del(conn_info: ConnInfo):
    """ПОИНТ ДЛЯ УДАЛЕНИЯ АГЕНТА"""
    async with app.state.db_pool.acquire() as conn:
        result = await conn.execute("DELETE FROM agents WHERE uuid = $1", conn_info.uuid)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Agent not found")
    return {"message": "Agent deleted successfully"}

@app.get("/api/get_agents")
async def get_agents():
    """ПОИНТ ДЛЯ ПОЛУЧЕНИЯ СПИСКА АГЕНТОВ"""
    async with app.state.db_pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM agents")
        return {"agents": [dict(row) for row in rows]}

@app.post("/api/start_check")
async def start_check(check_info: CheckInfo):
    """ПОИНТ ДЛЯ ЗАПУСКА ПРОВЕРКИ"""
    async with app.state.db_pool.acquire() as conn:
        target_agents = await conn.fetch('''
            SELECT * FROM agents WHERE agents_location = $1
        ''', check_info.agents_location)
        
    if not target_agents:
        raise HTTPException(status_code=404, detail="No agents found for this location")

    results = []
    for agent in target_agents:
        url = f"http://{agent['host']}:{agent['port']}/api/start_check"
        payload = check_info.dict()
        payload['agent_uuid'] = agent['uuid']

        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()  # Проверка на HTTP ошибки (4xx, 5xx)
            results.append({"agent": agent["uuid"], "status": "success", "data": response.json()})
        except requests.exceptions.HTTPError as e:
            error_data = {"agent": agent["uuid"], "status": "error", "detail": f"Agent returned status {e.response.status_code}"}
            try:
                error_data["agent_response"] = e.response.json()
            except requests.exceptions.JSONDecodeError:
                error_data["agent_response"] = e.response.text
            results.append(error_data)
        except requests.exceptions.RequestException as e:
            results.append({"agent": agent["uuid"], "status": "error", "detail": str(e)})

    return {"results": results}
