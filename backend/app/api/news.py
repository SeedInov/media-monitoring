from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.repo.news import NewsRepo
from app.types.filters.news import NewsFilters
from app.dto import CountResponse
from app.dto.news import DailyNewsSentiment, News, NewsSentimentByCountry, SentimentCount

news_router = APIRouter(prefix="/news", tags=["News"])


@news_router.get("")
async def get(
    news_repo: NewsRepo = Depends(NewsRepo),
    query: NewsFilters = Depends(NewsFilters.parse),
    limit: int = 10,
    offset: int = 0,
) -> list[News]:
    news = await news_repo.fetch(limit, offset, query)
    return news


@news_router.get("/count")
async def count(
    news_repo: NewsRepo = Depends(NewsRepo),
    query: NewsFilters = Depends(NewsFilters.parse),
) -> CountResponse:
    count = await news_repo.fetch_count(query)
    return count


@news_router.get("/distinct")
async def distinct(
    field: str = Query(...),
    news_repo: NewsRepo = Depends(NewsRepo),
    query: NewsFilters = Depends(NewsFilters.parse),
) -> list[Optional[str]]:
    values = await news_repo.distinct(field, query)
    return values


@news_router.get("/aggregate/sentiment")
async def sentiment_count(
    news_repo: NewsRepo = Depends(NewsRepo),
) -> list[SentimentCount]:
    sentiments_aggregate = await news_repo.sentiments_count()
    return sentiments_aggregate


@news_router.get("/aggregate/sentiment/date")
async def sentiment_count_by_date(
    _from: datetime = Query(..., alias="from"),
    to: datetime = Query(default_factory=datetime.now),
    news_repo: NewsRepo = Depends(NewsRepo),
) -> list[DailyNewsSentiment]:
    daily_sentiments = await news_repo.sentiments_count_by_date(_from, to)
    return daily_sentiments



@news_router.get("/aggregate/sentiment/country")
async def sentiment_count_by_country(
    news_repo: NewsRepo = Depends(NewsRepo),
) -> list[NewsSentimentByCountry]:
    sentiments_by_country = await news_repo.sentiments_count_by_country()
    return sentiments_by_country
