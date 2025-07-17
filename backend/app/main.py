from fastapi import FastAPI
from .database import init_db
from .models import Event, Session, Lap
from .fastf1_adapter import get_session

app = FastAPI(title="F1 Weekend Insights")

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/series")
async def get_series():
    return ["F1"]

@app.get("/seasons")
async def get_seasons(series: str = "F1"):
    return list(range(2025, 2017, -1))

@app.get("/events/{season}")
async def get_events(season: int):
    return []

@app.get("/sessions/{event_id}")
async def get_sessions(event_id: int):
    return []

@app.get("/weekend/{session_id}/laps")
async def get_laps(session_id: int):
    return []

@app.get("/weekend/{session_id}/stints")
async def get_stints(session_id: int):
    return []

@app.get("/summary/drivers")
async def summary_drivers(season: int = None, event: int = None):
    return []

@app.get("/summary/constructors")
async def summary_constructors(season: int = None, event: int = None):
    return []

@app.post("/compare")
async def compare():
    return {}
