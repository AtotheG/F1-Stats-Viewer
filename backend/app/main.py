from fastapi import FastAPI
from typing import Sequence, TypeVar, Optional
from contextlib import asynccontextmanager

from .database import init_db
from .models import Event, Session, Lap
from .fastf1_adapter import get_session

T = TypeVar("T")


def paginate(
    items: Sequence[T], limit: Optional[int] = None, offset: int = 0
) -> list[T]:
    """Return a slice of *items* using ``limit`` and ``offset`` parameters."""
    sliced = list(items)[offset:]
    if limit is not None:
        sliced = sliced[:limit]
    return sliced


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="F1 Weekend Insights", lifespan=lifespan)

    @app.get("/series")
    async def get_series(limit: int | None = None, offset: int = 0):
        data = ["F1"]
        return paginate(data, limit, offset)

    @app.get("/seasons")
    async def get_seasons(
        series: str = "F1", limit: int | None = None, offset: int = 0
    ):
        seasons = list(range(2025, 2017, -1))
        return paginate(seasons, limit, offset)

    @app.get("/events/{season}")
    async def get_events(season: int, limit: int | None = None, offset: int = 0):
        events: list[Event] = []
        return paginate(events, limit, offset)

    @app.get("/sessions/{event_id}")
    async def get_sessions(event_id: int, limit: int | None = None, offset: int = 0):
        sessions: list[Session] = []
        return paginate(sessions, limit, offset)

    @app.get("/weekend/{session_id}/laps")
    async def get_laps(session_id: int, limit: int | None = None, offset: int = 0):
        laps: list[Lap] = []
        return paginate(laps, limit, offset)

    @app.get("/weekend/{session_id}/stints")
    async def get_stints(session_id: int, limit: int | None = None, offset: int = 0):
        stints: list[dict] = []
        return paginate(stints, limit, offset)

    @app.get("/summary/drivers")
    async def summary_drivers(
        season: int = None, event: int = None, limit: int | None = None, offset: int = 0
    ):
        drivers: list[dict] = []
        return paginate(drivers, limit, offset)

    @app.get("/summary/constructors")
    async def summary_constructors(
        season: int = None, event: int = None, limit: int | None = None, offset: int = 0
    ):
        constructors: list[dict] = []
        return paginate(constructors, limit, offset)

    @app.post("/compare")
    async def compare():
        return {}

    return app


app = create_app()
