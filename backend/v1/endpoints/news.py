from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.core.database.repositories.news import NewsRepository
from app.core.models.news import News
from app.core.schemas.filters.news import NewsFilters
from app.core.schemas import CountResponse
from app.core.schemas.news import SentimentByDay, SentimentByCountry, SentimentCount

news_router = APIRouter(prefix="/news", tags=["News"])


@news_router.get("")
async def get(
    news_repo: NewsRepository = Depends(NewsRepository),
    query: NewsFilters = Depends(NewsFilters.parse),
    limit: int = Query(
        10, ge=0, le=1000, description="Limit the number of results", example=10
    ),
    offset: int = Query(0, ge=0, description="Offset the results", example=0),
) -> list[News]:
    """
    Get paginated list of news with advanced filtering options
    """
    news = await news_repo.fetch(limit, offset, query)
    return news


@news_router.get("/count")
async def count(
    news_repo: NewsRepository = Depends(NewsRepository),
    query: NewsFilters = Depends(NewsFilters.parse),
) -> CountResponse:
    """
    Get the count of news with advanced filtering options
    """
    count = await news_repo.fetch_count(query)
    return count


@news_router.get("/distinct")
async def distinct(
    field: str = Query(
        ..., description="Field to get distinct values", example="country"
    ),
    news_repo: NewsRepository = Depends(NewsRepository),
    query: NewsFilters = Depends(NewsFilters.parse),
) -> list[Optional[str]]:
    """
    Get distinct values of a field with advanced filtering options
    """
    values = await news_repo.distinct(field, query)
    return values


@news_router.get("/aggregate/sentiment")
async def sentiment_count(
    news_repo: NewsRepository = Depends(NewsRepository),
) -> list[SentimentCount]:
    """
    Get the count of news group by sentiment
    """
    sentiments_aggregate = await news_repo.sentiments_count()
    return sentiments_aggregate


@news_router.get("/aggregate/sentiment/date")
async def sentiment_count_by_date(
    _from: datetime = Query(
        ...,
        alias="from",
        description="Start range of news when published",
        example="2025-01-01",
    ),
    to: datetime = Query(
        default_factory=datetime.now, description="End range of news when published"
    ),
    news_repo: NewsRepository = Depends(NewsRepository),
) -> list[SentimentByDay]:
    """
    Get the count of news group by sentiment and date
    """
    daily_sentiments = await news_repo.sentiments_count_by_date(_from, to)
    return daily_sentiments


@news_router.get("/aggregate/sentiment/country")
async def sentiment_count_by_country(
    news_repo: NewsRepository = Depends(NewsRepository),
) -> list[SentimentByCountry]:
    """
    Get the count of news group by sentiment and country
    """
    sentiments_by_country = await news_repo.sentiments_count_by_country()
    return sentiments_by_country
