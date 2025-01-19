from fastapi import APIRouter, Depends, Query

from app.repo.news import NewsRepo

news_router = APIRouter(prefix="/news", tags=["news"])

@news_router.get("/")
async def get(
    news_repo: NewsRepo = Depends(NewsRepo),
    search: str = "",
    search_fields: list[str] = Query([], alias="searchFields"),
    limit: int = 10,
    offset: int = 0,
):
    match = {}
    if search and search_fields:
        match = {
            "$or": [
                {field: {"$regex": search, "$options": "i"}} for field in search_fields
            ]
        }
    news = await news_repo.fetch(limit, offset, match)
    return news


@news_router.get("/count")
async def count(
    news_repo: NewsRepo = Depends(NewsRepo),
    search: str = "",
    search_fields: list[str] = [],
):
    match = {}
    if search and search_fields:
        match = {
            "$or": [
                {field: {"$regex": search, "$options": "i"}} for field in search_fields
            ]
        }
    count = await news_repo.fetch_count(match)
    return count
