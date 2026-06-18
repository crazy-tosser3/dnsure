import asyncio
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.concurrency import run_in_threadpool
from schemas import Check
from agent_utils import check_http_https, check_ping, check_tcp_port, check_traceroute

app = FastAPI(title="dnsure-agent")

UUID_FILE = Path("agent.uuid")


@app.on_event("startup")
async def startup_event():
    if not UUID_FILE.exists():
        agent_uuid = str(uuid.uuid4())
        UUID_FILE.write_text(agent_uuid)
        print(f"Сгенерирован новый UUID для агента: {agent_uuid}")
    else:
        agent_uuid = UUID_FILE.read_text().strip()
        print(f"Загружен UUID агента: {agent_uuid}")
    
    app.state.agent_uuid = agent_uuid

@app.post("/api/start_check")
async def start_check(check: Check):
    """ПОИНТ СТАРТА ПРОВЕРКИ С ВЫБРАННЫМИ ПАРАМЕТРАМИ"""
    results = {}
    if check.agent_uuid != app.state.agent_uuid:
        raise HTTPException(status_code=403, detail="Неверный UUID агента.")
    
    tasks = []
    types_to_run = []

    for check_type, enabled in check.check_type.items():
        if not enabled:
            continue

        c_type = check_type.lower()
        types_to_run.append(check_type)
        
        if c_type in ["http", "https"]:
            tasks.append(run_in_threadpool(check_http_https, check.host_to_check))
        elif c_type == "ping":
            tasks.append(run_in_threadpool(check_ping, check.host_to_check))
        elif c_type == "tcp":
            target = check.host_to_check if ":" in check.host_to_check else f"{check.host_to_check}:443"
            tasks.append(run_in_threadpool(check_tcp_port, target))
        elif c_type == "traceroute":
            tasks.append(run_in_threadpool(check_traceroute, check.host_to_check))
        else:
            results[check_type] = {"error": "Неизвестный тип проверки"}
            types_to_run.pop()

    if tasks:
        completed_results = await asyncio.gather(*tasks)
        for i, check_type in enumerate(types_to_run):
            results[check_type] = completed_results[i]

    return {
        "status": "completed",
        "host_checked": check.host_to_check,
        "results": results
    }