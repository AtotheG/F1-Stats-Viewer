import pytest
from httpx import AsyncClient, ASGITransport
import app.main as main
import app.fastf1_adapter as fastf1_adapter
from asgi_lifespan import LifespanManager
from sqlalchemy import delete
import app.database as database
from app.models import Event, Session as DBSess, Lap

app = main.create_app()

@pytest.mark.asyncio
async def test_series():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        res = await ac.get('/series')
        assert res.status_code == 200
        assert res.json() == ['F1']


@pytest.mark.asyncio
async def test_series_limit_offset():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        res = await ac.get('/series?limit=1&offset=0')
        assert res.status_code == 200
        assert res.json() == ['F1']


@pytest.mark.asyncio
async def test_seasons_limit_offset():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        res = await ac.get('/seasons?limit=2&offset=1')
        assert res.status_code == 200
        assert res.json() == [2024, 2023]


@pytest.mark.asyncio
async def test_api_prefix_alias():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        res = await ac.get('/api/seasons')
        assert res.status_code == 200
        assert res.json()[0] == 2025


def test_get_session_cache(monkeypatch):
    calls = []

    class DummySession:
        def load(self):
            calls.append('load')

    def fake_get_session(season, gp, session):
        calls.append((season, gp, session))
        return DummySession()

    monkeypatch.setattr(fastf1_adapter, 'fastf1', type('m', (), {'get_session': fake_get_session}))

    fastf1_adapter.get_session.cache_clear()

    sess1 = fastf1_adapter.get_session(2024, 'Bahrain', 'FP1')
    sess2 = fastf1_adapter.get_session(2024, 'Bahrain', 'FP1')

    assert sess1 is sess2
    assert calls.count('load') == 1
    assert calls.count((2024, 'Bahrain', 'FP1')) == 1


@pytest.mark.asyncio
async def test_lifespan_calls_init_db(monkeypatch):
    called = []

    async def fake_init_db():
        called.append(True)

    monkeypatch.setattr(main, 'init_db', fake_init_db)

    app = main.create_app()

    transport = ASGITransport(app=app)
    async with LifespanManager(app):
        async with AsyncClient(transport=transport, base_url='http://test') as ac:
            res = await ac.get('/series')
            assert res.status_code == 200

    assert called, 'init_db should be called during lifespan startup'


async def populate():
    async with database.async_session() as db:
        await db.execute(delete(Lap))
        await db.execute(delete(DBSess))
        await db.execute(delete(Event))
        await db.commit()

        e1 = Event(id=1, season=2024, name="Race 1")
        e2 = Event(id=2, season=2024, name="Race 2")
        db.add_all([e1, e2])
        await db.commit()

        s1 = DBSess(id=1, event_id=1, name="Race")
        s2 = DBSess(id=2, event_id=2, name="Race")
        db.add_all([s1, s2])
        await db.commit()

        laps = [
            Lap(session_id=1, lap=1, driver="HAM", time=90.0),
            Lap(session_id=1, lap=2, driver="HAM", time=88.0),
            Lap(session_id=2, lap=1, driver="HAM", time=92.0),
            Lap(session_id=1, lap=1, driver="VER", time=91.0),
            Lap(session_id=2, lap=1, driver="VER", time=93.0),
            Lap(session_id=2, lap=2, driver="VER", time=94.0),
        ]
        db.add_all(laps)
        await db.commit()


@pytest.mark.asyncio
async def test_driver_endpoints():
    async with LifespanManager(app):
        await populate()
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            res = await ac.get("/summary/drivers")
            assert res.status_code == 200
            data = res.json()
            ham = next(d for d in data if d["driver"] == "HAM")
            assert ham["laps"] == 3

            res = await ac.get("/driver/HAM/summary")
            assert res.json()["laps"] == 3

            res = await ac.get("/driver/HAM/seasons")
            assert res.json() == [2024]

            res = await ac.get("/driver/HAM/season/2024/races")
            races = res.json()
            assert races[0]["laps"] == 2
            assert len(races) == 2

            res = await ac.get("/driver/HAM/cumulative-points")
            cp = res.json()
            assert cp[-1]["points"] == 3

            res = await ac.get("/driver/HAM/top-results")
            tr = res.json()
            assert tr[0]["time"] == 88.0

@pytest.mark.asyncio
async def test_events_sessions_endpoints():
    async with LifespanManager(app):
        await populate()
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            res = await ac.get("/events/2024")
            assert res.status_code == 200
            events = res.json()
            assert len(events) == 2
            assert events[0]["id"] == 1
            res = await ac.get("/events/2024?limit=1&offset=1")
            assert [e["id"] for e in res.json()] == [2]

            res = await ac.get("/sessions/1")
            assert res.status_code == 200
            sessions = res.json()
            assert len(sessions) == 1
            assert sessions[0]["event_id"] == 1
            res = await ac.get("/sessions/1?offset=1")
            assert res.json() == []
