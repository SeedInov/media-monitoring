from fastapi import APIRouter, Depends, Query

from app.repo.news import NewsRepo
from app.types.filters.news import NewsFilters
from app.dto import CountResponse
from app.dto.news import News

news_router = APIRouter(prefix="/news", tags=["news"])


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
) -> list[str]:
    values = await news_repo.distinct(field, query)
    return values
