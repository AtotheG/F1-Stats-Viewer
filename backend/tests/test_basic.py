import pytest
from httpx import AsyncClient, ASGITransport
import app.main as main
import app.fastf1_adapter as fastf1_adapter
from asgi_lifespan import LifespanManager

app = main.create_app()


@pytest.mark.asyncio
async def test_series():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/series")
        assert res.status_code == 200
        assert res.json() == ["F1"]

        res = await ac.get("/series", params={"limit": 1, "offset": 0})
        assert res.status_code == 200
        assert res.json() == ["F1"]

        res = await ac.get("/series", params={"offset": 1})
        assert res.status_code == 200
        assert res.json() == []


@pytest.mark.asyncio
async def test_seasons_pagination():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/seasons", params={"limit": 2})
        assert res.status_code == 200
        assert res.json() == [2025, 2024]

        res = await ac.get("/seasons", params={"offset": 6})
        assert res.status_code == 200
        assert res.json() == [2019, 2018]


def test_get_session_cache(monkeypatch):
    calls = []

    class DummySession:
        def load(self):
            calls.append("load")

    def fake_get_session(season, gp, session):
        calls.append((season, gp, session))
        return DummySession()

    monkeypatch.setattr(
        fastf1_adapter, "fastf1", type("m", (), {"get_session": fake_get_session})
    )

    fastf1_adapter.get_session.cache_clear()

    sess1 = fastf1_adapter.get_session(2024, "Bahrain", "FP1")
    sess2 = fastf1_adapter.get_session(2024, "Bahrain", "FP1")

    assert sess1 is sess2
    assert calls.count("load") == 1
    assert calls.count((2024, "Bahrain", "FP1")) == 1


@pytest.mark.asyncio
async def test_lifespan_calls_init_db(monkeypatch):
    called = []

    async def fake_init_db():
        called.append(True)

    monkeypatch.setattr(main, "init_db", fake_init_db)

    app = main.create_app()

    transport = ASGITransport(app=app)
    async with LifespanManager(app):
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            res = await ac.get("/series")
            assert res.status_code == 200

    assert called, "init_db should be called during lifespan startup"
