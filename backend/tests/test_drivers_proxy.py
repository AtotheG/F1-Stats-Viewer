import pytest
from httpx import AsyncClient, ASGITransport
import app.main as main
import httpx

app = main.create_app()


class DummyClient:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        pass

    async def get(self, url, params=None):
        assert url == "https://ergast.com/api/f1/drivers/"
        assert params == {"limit": "1"}
        return httpx.Response(200, json={"MRData": {"DriverTable": []}})


@pytest.mark.asyncio
async def test_drivers_proxy(monkeypatch):
    monkeypatch.setattr(main, "httpx", type("m", (), {"AsyncClient": DummyClient}))

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        res = await ac.get('/ergast/f1/drivers/?limit=1')
        assert res.status_code == 200
        assert "MRData" in res.json()
