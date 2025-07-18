from fastapi import FastAPI, APIRouter
import httpx
import os

ERGAST_BASE_URL = os.getenv("ERGAST_BASE_URL", "https://api.jolpi.ca/ergast/f1")
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from .database import init_db, async_session
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
=======
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


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
    async def summary_drivers(
        season: int | None = None,
        event: int | None = None,
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
        return [
            {"driver": r[0], "laps": r[1], "avg_time": r[2]}
            for r in res.all()
        ]

    @app.get("/summary/constructors")
    async def summary_constructors(season: int = None, event: int = None):
        return []

    @app.get("/driver/{driver_id}/summary")
    async def driver_summary(
        driver_id: str, db: AsyncSession = Depends(get_db)
    ):
        stmt = select(func.count(Lap.id), func.avg(Lap.time)).where(
            Lap.driver == driver_id
        )
        res = await db.execute(stmt)
        count, avg_time = res.one()
        return {"driver": driver_id, "laps": count, "avg_time": avg_time}

    @app.get("/driver/{driver_id}/seasons")
    async def driver_seasons(
        driver_id: str, db: AsyncSession = Depends(get_db)
    ):
        stmt = (
            select(Event.season)
            .distinct()
            .join(Session, Event.id == Session.event_id)
            .join(Lap, Session.id == Lap.session_id)
            .where(Lap.driver == driver_id)
        )
        res = await db.execute(stmt)
        seasons = sorted(r[0] for r in res.all())
        return seasons

    @app.get("/driver/{driver_id}/season/{year}/races")
    async def driver_season_races(
        driver_id: str, year: int, db: AsyncSession = Depends(get_db)
    ):
        stmt = (
            select(Event.name, func.count(Lap.id), func.avg(Lap.time))
            .join(Session, Event.id == Session.event_id)
            .join(Lap, Session.id == Lap.session_id)
            .where(Lap.driver == driver_id, Event.season == year)
            .group_by(Event.id)
            .order_by(Event.id)
        )
        res = await db.execute(stmt)
        return [
            {"event": r[0], "laps": r[1], "avg_time": r[2]} for r in res.all()
        ]

    @app.get("/driver/{driver_id}/cumulative-points")
    async def driver_cumulative_points(
        driver_id: str, db: AsyncSession = Depends(get_db)
    ):
        stmt = (
            select(Event.id, Event.name, func.count(Lap.id))
            .join(Session, Event.id == Session.event_id)
            .join(Lap, Session.id == Lap.session_id)
            .where(Lap.driver == driver_id)
            .group_by(Event.id)
            .order_by(Event.id)
        )
        res = await db.execute(stmt)
        total = 0
        data = []
        for eid, name, pts in res.all():
            total += pts
            data.append({"event": name, "points": total})
        return data

    @app.get("/driver/{driver_id}/top-results")
    async def driver_top_results(
        driver_id: str,
        limit: int = 3,
        db: AsyncSession = Depends(get_db),
    ):
        stmt = (
            select(Lap.session_id, Lap.lap, Lap.time)
            .where(Lap.driver == driver_id)
            .order_by(Lap.time)
            .limit(limit)
        )
        res = await db.execute(stmt)
        return [
            {"session_id": r[0], "lap": r[1], "time": r[2]} for r in res.all()
        ]

    @app.post("/compare")
    async def compare():
        return {}

    return app


app = create_app()
