from faker import Faker
import pytest
from httpx import ASGITransport, AsyncClient
from datetime import datetime, timedelta
from typing import AsyncGenerator
import pytz
from app import app
from app.core.database.repositories.news import NewsRepository
from app.core.models.news import News
from app.core.schemas import CountResponse
from app.core.schemas.news import (
    SentimentByCountry,
    SentimentByDay,
    SentimentCount,
)

fake = Faker()


def fake_news() -> News:
    return News(
        id=fake.uuid4(),
        url=fake.url(),
        read_more_link=fake.url(),
        language=fake.language_code(),
        title=fake.sentence(),
        top_image=fake.image_url(),
        meta_img=fake.image_url(),
        images=[fake.image_url() for _ in range(3)],
        movies=[fake.url() for _ in range(2)],
        keywords=[fake.word() for _ in range(4)],
        meta_keywords=[fake.word() for _ in range(4)],
        tags=[fake.word() for _ in range(3)],
        authors=[fake.name() for _ in range(2)],
        publish_date=fake.date_time_this_decade(),
        summary=fake.paragraph(),
        meta_description=fake.text(),
        meta_lang=fake.language_code(),
        meta_favicon=fake.image_url(),
        meta_site_name=fake.company(),
        canonical_link=fake.url(),
        text=fake.text(),
        country=fake.country_code(),
        decoded_url=fake.url(),
        google_uri=fake.url(),
        extracted_keywords=[fake.word() for _ in range(5)],
        sentiment=fake.random_element(["positive", "negative", "neutral"]),
        sentiment_impactful_texts=[fake.sentence() for _ in range(2)],
    )


class MockNewsRepository:
    async def fetch(self, *args, **kwargs) -> list[News]:
        return [fake_news() for _ in range(2)]

    async def fetch_count(self, *args, **kwargs) -> CountResponse:
        return CountResponse(count=10)

    async def distinct(self, *args, **kwargs) -> list[str]:
        return ["positive", "negative", "neutral"]

    async def sentiments_count(self, *args, **kwargs) -> list[SentimentCount]:
        return [
            SentimentCount(name="positive", count=100),
            SentimentCount(name="negative", count=50),
            SentimentCount(name="neutral", count=30),
        ]

    async def sentiments_count_by_date(self, *args, **kwargs) -> list[SentimentByDay]:
        return [
            SentimentByDay(
                date="2025-03-01",
                positive=50,
                negative=25,
                neutral=15,
                very_negative=5,
                very_positive=5,
                all=100,
            )
        ]

    async def sentiments_count_by_country(
        self, *args, **kwargs
    ) -> list[SentimentByCountry]:
        return [
            SentimentByCountry(
                country="US",
                positive=60,
                negative=20,
                neutral=15,
                very_negative=5,
                very_positive=5,
                all=100,
            ),
            SentimentByCountry(
                country="UK",
                positive=40,
                negative=30,
                neutral=20,
                very_negative=5,
                very_positive=5,
                all=100,
            ),
        ]


app.dependency_overrides[NewsRepository] = MockNewsRepository


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
async def should_get_news(client: AsyncClient) -> None:
    response = await client.get("/news?limit=5&offset=0")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def should_get_news_count(client: AsyncClient) -> None:
    response = await client.get("/news/count")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)
    assert "count" in response.json()


@pytest.mark.asyncio
async def should_get_news_distinct_field_values(client: AsyncClient) -> None:
    response = await client.get("/news/distinct?field=title")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def should_get_sentiment_count(client: AsyncClient) -> None:
    response = await client.get("/news/aggregate/sentiment")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def should_get_sentiment_count_by_date(client: AsyncClient) -> None:
    _from: str = (datetime.now(pytz.utc) - timedelta(days=30)).strftime("%Y-%m-%d")
    to: str = datetime.now(pytz.utc).strftime("%Y-%m-%d")

    response = await client.get(f"/news/aggregate/sentiment/date?from={_from}&to={to}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def should_get_sentiment_count_by_country(client: AsyncClient) -> None:
    response = await client.get("/news/aggregate/sentiment/country")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
