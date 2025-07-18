import pytest
from httpx import AsyncClient, ASGITransport, MockTransport, Response
import app.main as main


@pytest.mark.asyncio
async def test_ergast_drivers():
    async def handler(request):
        data = {"MRData": {"DriverTable": {}}}
        return Response(200, json=data)

    transport = MockTransport(handler)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/ergast/f1/drivers/?limit=1")
        assert res.status_code == 200
        js = res.json()
        assert "MRData" in js
        assert "DriverTable" in js["MRData"]


@pytest.mark.asyncio
async def test_seasons_length():
    app = main.create_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/seasons")
        assert res.status_code == 200
        seasons = res.json()
        assert isinstance(seasons, list)
        assert len(seasons) == 10
