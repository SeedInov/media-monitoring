import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import datetime, timedelta
from faker import Faker
from app.core.database import AsyncClient
from app.core.database.repositories.news import NewsRepository
from app.core.schemas.news import SentimentByDay, SentimentByCountry, SentimentCount
from app.core.schemas import CountResponse
from app.core.models.news import News
from app.core.schemas.filters.news import NewsFilters

fake = Faker()


@pytest.fixture
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


@pytest.fixture
def mock_client() -> AsyncMock:
    client: AsyncMock = AsyncMock(spec=AsyncClient)
    return client


@pytest.fixture
def news_repository(mock_client: AsyncMock) -> NewsRepository:
    return NewsRepository(client=mock_client)


@pytest.fixture
def news_filters():
    news_filter = MagicMock(spec=NewsFilters)
    return news_filter


@pytest.mark.asyncio
class TestNewsRepository:
    async def should_fetch_news(
        self,
        news_repository: NewsRepository,
        mock_client: AsyncMock,
        fake_news: News,
        news_filters: MagicMock,
    ) -> None:
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [
            fake_news.model_dump()
        ]
        news_filters.apply_filters.return_value = "fake query"
        result: list[News] = await news_repository.fetch(
            limit=1, offset=0, filters=news_filters
        )

        news_filters.apply_filters.assert_called_once()
        assert isinstance(result, list)
        assert isinstance(result[0], News)
        assert result[0].id == fake_news.id

    async def should_fetch_news_count(
        self,
        news_repository: NewsRepository,
        mock_client: AsyncMock,
        news_filters: MagicMock,
    ) -> None:
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [{"count": 10}]
        news_filters.apply_filters.return_value = "fake query"
        result: CountResponse = await news_repository.fetch_count(filters=news_filters)

        news_filters.apply_filters.assert_called_once()
        assert isinstance(result, CountResponse)
        assert result.count == 10

    async def should_fetch_news_distinct_field_values(
        self,
        news_repository: NewsRepository,
        mock_client: AsyncMock,
        news_filters: MagicMock,
    ) -> None:
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [
            {"country": "US"},
            {"country": "UK"},
        ]
        news_filters.apply_filters.return_value = "fake query"
        result: list[str] = await news_repository.distinct(
            "country", filters=news_filters
        )
        news_filters.apply_filters.assert_called_once()
        assert result == ["US", "UK"]

    async def should_fetch_news_sentiments_count(
        self, news_repository: NewsRepository, mock_client: AsyncMock
    ) -> None:
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [
            {"name": "positive", "count": 5},
            {"name": "negative", "count": 3},
        ]
        result: list[SentimentCount] = await news_repository.sentiments_count()
        assert isinstance(result, list)
        assert isinstance(result[0], SentimentCount)
        assert result[0].name == "positive"
        assert result[0].count == 5

    async def should_fetch_sentiments_count_by_date(
        self, news_repository: NewsRepository, mock_client: AsyncMock
    ) -> None:
        from_date: datetime = datetime.now() - timedelta(days=10)
        to_date: datetime = datetime.now()
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [
            {
                "date": from_date.date().isoformat(),
                "positive": 3,
                "negative": 2,
                "neutral": 4,
                "very_negative": 1,
                "very_positive": 2,
                "all": 12,
            }
        ]
        result: list[SentimentByDay] = await news_repository.sentiments_count_by_date(
            from_date, to_date
        )
        assert isinstance(result, list)
        assert isinstance(result[0], SentimentByDay)
        assert result[0].date == from_date.date()
        assert result[0].all == 12

    async def should_fetch_sentiments_count_by_country(
        self, news_repository: NewsRepository, mock_client: AsyncMock
    ) -> None:
        mock_client.query.return_value.named_results = MagicMock()
        mock_client.query.return_value.named_results.return_value = [
            {
                "country": "US",
                "positive": 10,
                "negative": 5,
                "neutral": 7,
                "very_negative": 3,
                "very_positive": 4,
                "all": 29,
            }
        ]
        result: list[
            SentimentByCountry
        ] = await news_repository.sentiments_count_by_country()
        assert isinstance(result, list)
        assert isinstance(result[0], SentimentByCountry)
        assert result[0].country == "US"
        assert result[0].all == 29
