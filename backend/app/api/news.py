from fastapi import APIRouter, Depends, Query

from app.repo.news import NewsRepo

news_router = APIRouter(prefix="/news", tags=["news"])


@news_router.get("")
async def get(
    news_repo: NewsRepo = Depends(NewsRepo),
    search: str = "",
    search_fields: list[str] = Query([], alias="searchFields"),
    limit: int = 10,
    offset: int = 0,
):
    where = {}
    if search and search_fields:
        where = "where " + " or ".join(
            [f"{field} ilike '%{search}%'" for field in search_fields]
        )
    news = await news_repo.fetch(limit, offset, where)
    return news


@news_router.get("/count")
async def count(
    news_repo: NewsRepo = Depends(NewsRepo),
    search: str = "",
    search_fields: list[str] = Query([], alias="searchFields"),
):
    where = {}
    if search and search_fields:
        where = "where " + " or ".join(
            [f"{field} ilike '%{search}%'" for field in search_fields]
        )
    count = await news_repo.fetch_count(where)
    return count
