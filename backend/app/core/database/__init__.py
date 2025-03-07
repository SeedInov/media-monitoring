from clickhouse_connect import get_async_client
from urllib3 import PoolManager
from app.core.config import settings
from clickhouse_connect.driver import AsyncClient

pool_manager = PoolManager(num_pools=10, maxsize=10)


async def get_clickhouse_client() -> AsyncClient:
    return await get_async_client(dsn=settings.CLICKHOUSE_DSN, pool_mgr=pool_manager)
