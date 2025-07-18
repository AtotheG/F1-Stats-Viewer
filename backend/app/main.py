from fastapi import FastAPI, Query
from contextlib import asynccontextmanager

from .database import init_db
from .models import Event, Session, Lap
from .fastf1_adapter import get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def slice_list(data: list, limit: int | None, offset: int) -> list:
    """Return the slice of *data* applying offset and limit."""
    start = offset or 0
    if limit is None:
        end = None
    else:
        end = start + limit
    return data[start:end]


def create_app() -> FastAPI:
    app = FastAPI(title="F1 Weekend Insights", lifespan=lifespan)

    @app.get("/series")
    async def get_series(
        limit: int | None = Query(None, ge=0), offset: int = Query(0, ge=0)
    ):
        data = ["F1"]
        return slice_list(data, limit, offset)

    @app.get("/seasons")
    async def get_seasons(
        series: str = "F1",
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data = list(range(2025, 2017, -1))
        return slice_list(data, limit, offset)

    @app.get("/events/{season}")
    async def get_events(
        season: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list[Event] = []
        return slice_list(data, limit, offset)

    @app.get("/sessions/{event_id}")
    async def get_sessions(
        event_id: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list[Session] = []
        return slice_list(data, limit, offset)

    @app.get("/weekend/{session_id}/laps")
    async def get_laps(
        session_id: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list[Lap] = []
        return slice_list(data, limit, offset)

    @app.get("/weekend/{session_id}/stints")
    async def get_stints(
        session_id: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list = []
        return slice_list(data, limit, offset)

    @app.get("/summary/drivers")
    async def summary_drivers(
        season: int | None = None,
        event: int | None = None,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list = []
        return slice_list(data, limit, offset)

    @app.get("/summary/constructors")
    async def summary_constructors(
        season: int | None = None,
        event: int | None = None,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list = []
        return slice_list(data, limit, offset)

    @app.post("/compare")
    async def compare():
        return {}

    return app


app = create_app()
