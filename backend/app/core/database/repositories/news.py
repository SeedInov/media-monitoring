from datetime import datetime
from typing import Any, Optional
from fastapi import Depends
from app.core.database import get_clickhouse_client, AsyncClient

from app.core.schemas.filters.news import NewsFilters
from app.core.models.news import News
from app.core.schemas import CountResponse
from app.core.schemas.news import (
    SentimentByDay,
    SentimentByCountry,
    SentimentCount,
)
from pydantic import TypeAdapter
from app.core.logger import get_logger


class NewsRepository:
    def __init__(self, client: AsyncClient = Depends(get_clickhouse_client)):
        self.client = client
        self.logger = get_logger(self.__class__.__name__)

    async def fetch(
        self, limit, offset, filters: Optional[NewsFilters] = None
    ) -> list[News]:
        base_query = "Select * from news"
        if filters:
            base_query = filters.apply_filters(base_query)
        news = await self.client.query(f"{base_query} limit {limit} offset {offset};")
        self.logger.debug(f"Query: {base_query}")
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
        self.logger.debug(f"Query: {base_query}")
        return list(map(lambda x: x[field], news.named_results()))

    async def sentiments_count(self) -> list[SentimentCount]:
        query = """
            SELECT 
                sentiment as name,
                COUNT(sentiment) as count
            FROM
                news n
            GROUP BY
                sentiment
        """
        news = await self.client.query(query)
        self.logger.debug(f"Query: {query}")
        return TypeAdapter(list[SentimentCount]).validate_python(
            list(news.named_results())
        )

    async def sentiments_count_by_date(
        self, from_: datetime, to: datetime
    ) -> list[SentimentByDay]:
        query = f"""
            SELECT 
                DATE(publish_date) AS date,
                COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive,
                COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) AS negative,
                COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) AS neutral,
                COUNT(CASE WHEN sentiment = 'very negative' THEN 1 END) AS very_negative,
                COUNT(CASE WHEN sentiment = 'very positive' THEN 1 END) AS very_positive,
                COUNT(*) AS all
            FROM
                news n
            WHERE
                publish_date >= '{from_.strftime("%Y-%m-%d")}' 
                AND publish_date <= '{to.strftime("%Y-%m-%d")}'
            GROUP BY
                DATE(publish_date)
            ORDER BY
                date DESC
        """
        news = await self.client.query(query)
        self.logger.debug(f"Query: {query}")
        return TypeAdapter(list[SentimentByDay]).validate_python(
            list(news.named_results())
        )

    async def sentiments_count_by_country(self) -> list[SentimentByCountry]:
        query = """
            SELECT 
                country,
                COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive,
                COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) AS negative,
                COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) AS neutral,
                COUNT(CASE WHEN sentiment = 'very negative' THEN 1 END) AS very_negative,
                COUNT(CASE WHEN sentiment = 'very positive' THEN 1 END) AS very_positive,
                COUNT(*) AS all
            FROM
                news n
            GROUP BY
                country
            ORDER BY
                country
        """
        news = await self.client.query(query)
        self.logger.debug(f"Query: {query}")
        return TypeAdapter(list[SentimentByCountry]).validate_python(
            list(news.named_results())
        )
