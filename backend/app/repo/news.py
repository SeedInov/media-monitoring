from fastapi import Depends
from app.repo import get_clickhouse_client
from clickhouse_connect.driver import AsyncClient


class NewsRepo:
    def __init__(self, client: AsyncClient = Depends(get_clickhouse_client)):
        self.client = client

    async def fetch(self, limit, offset, where: str = "") -> list:
        news = await self.client.query(
            f"Select * from news {where} limit {limit} offset {offset};"
        )
        return list(news.named_results())

    async def fetch_count(self, where: str = "") -> int:
        news = await self.client.query(f"Select count(id) as count from news {where};")
        return list(news.named_results())[0]
