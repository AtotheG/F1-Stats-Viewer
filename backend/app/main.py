from fastapi import FastAPI, APIRouter
import httpx
import os

ERGAST_BASE_URL = os.getenv("ERGAST_BASE_URL", "https://api.jolpi.ca/ergast/f1")
from contextlib import asynccontextmanager

from .database import init_db
from .models import Event, Session, Lap
from .fastf1_adapter import get_session


ergast_router = APIRouter(prefix="/ergast/f1")


@ergast_router.get("/{path:path}")
async def proxy_ergast(path: str = "", limit: int | None = None, offset: int | None = None):
    params = {}
    if limit is not None:
        params["limit"] = limit
    if offset is not None:
        params["offset"] = offset
    async with httpx.AsyncClient(base_url=ERGAST_BASE_URL) as client:
        res = await client.get(f"/{path}", params=params)
        res.raise_for_status()
        return res.json()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="F1 Weekend Insights", lifespan=lifespan)
    app.include_router(ergast_router)

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

    return app


app = create_app()
