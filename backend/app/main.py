from fastapi import FastAPI, Query, Request, Response, Depends
from contextlib import asynccontextmanager
import httpx
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from .database import init_db, async_session
from .models import Event, Session, Lap

async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


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
    @app.get("/api/events/{season}")
    async def get_events(
        season: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
        db: AsyncSession = Depends(get_db),
    ):
        stmt = select(Event).where(Event.season == season).order_by(Event.id)
        res = await db.execute(stmt)
        data = res.scalars().all()
        return slice_list(data, limit, offset)

    @app.get("/sessions/{event_id}")
    @app.get("/api/sessions/{event_id}")
    async def get_sessions(
        event_id: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
        db: AsyncSession = Depends(get_db),
    ):
        stmt = select(Session).where(Session.event_id == event_id).order_by(Session.id)
        res = await db.execute(stmt)
        data = res.scalars().all()
        return slice_list(data, limit, offset)

    @app.get("/weekend/{session_id}/laps")
    @app.get("/api/weekend/{session_id}/laps")
    async def get_laps(
        session_id: int,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
        db: AsyncSession = Depends(get_db),
    ):
        stmt = select(Lap).where(Lap.session_id == session_id).order_by(Lap.lap)
        res = await db.execute(stmt)
        data = res.scalars().all()
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
    async def summary_constructors(
        season: int | None = None,
        event: int | None = None,
        limit: int | None = Query(None, ge=0),
        offset: int = Query(0, ge=0),
    ):
        data: list = []
        return slice_list(data, limit, offset)

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

    @app.api_route("/ergast/{path:path}", methods=["GET"])
    async def ergast_proxy(path: str, request: Request):
        url = f"https://ergast.com/api/{path}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=dict(request.query_params))
        return Response(
            content=resp.content,
            status_code=resp.status_code,
            media_type=resp.headers.get("content-type", "application/json"),
        )

    return app


app = create_app()
