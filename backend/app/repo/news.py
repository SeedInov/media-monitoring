from typing import Any, Optional
from fastapi import Depends
from app.repo import get_clickhouse_client
from clickhouse_connect.driver import AsyncClient
from app.types.filters.news import NewsFilters
from app.dto.news import News
from pydantic import TypeAdapter
from app.dto import CountResponse


class NewsRepo:
    def __init__(self, client: AsyncClient = Depends(get_clickhouse_client)):
        self.client = client

    async def fetch(
        self, limit, offset, filters: Optional[NewsFilters] = None
    ) -> list[News]:
        base_query = "Select * from news"
        if filters:
            base_query = filters.apply_filters(base_query)
        news = await self.client.query(f"{base_query} limit {limit} offset {offset};")
        return TypeAdapter(list[News]).validate_python(list(news.named_results()))

    async def fetch_count(self, filters: Optional[NewsFilters] = None) -> CountResponse:
        base_query = "Select count(id) as count from news"
        if filters:
            base_query = filters.apply_filters(base_query)
        news = await self.client.query(f"{base_query};")
        return CountResponse.model_validate(list(news.named_results())[0])

    async def distinct(
        self, field: str, filters: Optional[NewsFilters] = None
    ) -> list[Any]:
        base_query = f"Select distinct({field}) as {field} from news"
        if filters:
            base_query = filters.apply_filters(base_query)
        news = await self.client.query(f"{base_query};")
        return list(map(lambda x: x[field], news.named_results()))
