import pytest
from httpx import ASGITransport, AsyncClient
from datetime import datetime, timedelta
from typing import AsyncGenerator
import pytz
from app import app


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
async def test_get_news(client: AsyncClient) -> None:
    response = await client.get("/news?limit=5&offset=0")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_news_count(client: AsyncClient) -> None:
    response = await client.get("/news/count")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "count" in response.json()


@pytest.mark.asyncio
async def test_get_news_distinct(client: AsyncClient) -> None:
    response = await client.get("/news/distinct?field=title")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_sentiment_count(client: AsyncClient) -> None:
    response = await client.get("/news/aggregate/sentiment")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_sentiment_count_by_date(client: AsyncClient) -> None:
    _from: str = (datetime.now(pytz.utc) - timedelta(days=30)).strftime("%Y-%m-%d")
    to: str = datetime.now(pytz.utc).strftime("%Y-%m-%d")

    response = await client.get(f"/news/aggregate/sentiment/date?from={_from}&to={to}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_sentiment_count_by_country(client: AsyncClient) -> None:
    response = await client.get("/news/aggregate/sentiment/country")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
