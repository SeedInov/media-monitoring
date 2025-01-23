from clickhouse_connect import get_async_client
from urllib3 import PoolManager
from app.config import config

pool_manager = PoolManager(num_pools=10, maxsize=10)

async def get_clickhouse_client():
    return await get_async_client(dsn=config.clickhouse_dsn, pool_mgr=pool_manager)
