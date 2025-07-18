from fastapi import FastAPI, Depends, Query
from contextlib import asynccontextmanager
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .database import init_db, async_session
from .models import Event, Session, Lap
from .fastf1_adapter import get_session


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


def slice_list(data: list, limit: int | None, offset: int) -> list:
    if limit is None:
        return data[offset:]
    return data[offset : offset + limit]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="F1 Weekend Insights", lifespan=lifespan)

    @app.get("/series")
    async def get_series():
        return ["F1"]

    @app.get("/seasons")
    async def get_seasons(series: str = "F1"):
        return list(range(2025, 2015, -1))

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

    # Combined driver summary endpoint
    @app.get("/summary/drivers")
    async def summary_drivers(
        season: int | None = None,
        event: int | None = None,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
        db: AsyncSession = Depends(get_db),
    ):
        stmt = (
            select(Lap.driver, func.count(Lap.id), func.avg(Lap.time))
            .join(Session, Lap.session_id == Session.id)
            .join(Event, Session.event_id == Event.id)
        )
        if event is not None:
            stmt = stmt.where(Event.id == event)
        elif season is not None:
            stmt = stmt.where(Event.season == season)
        stmt = stmt.group_by(Lap.driver)
        res = await db.execute(stmt)
        data = [
            {"driver": r[0], "laps": r[1], "avg_time": r[2]}
            for r in res.all()
        ]
        return slice_list(data, limit, offset)

    @app.get("/summary/constructors")
    async def summary_constructors(season: int = None, event: int = None):
        return []

    @app.post("/compare")
    async def compare():
        return {}

    return app


app = create_app()
