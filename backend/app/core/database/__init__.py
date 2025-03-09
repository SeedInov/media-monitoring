import os
from clickhouse_connect import get_async_client
from urllib3 import PoolManager
from app.core.config import settings
from clickhouse_connect.driver import AsyncClient
from piccolo.conf.apps import AppConfig, table_finder

clickhouse_pool_manager = PoolManager(num_pools=10, maxsize=10)


async def get_clickhouse_client() -> AsyncClient:
    return await get_async_client(
        dsn=settings.CLICKHOUSE_DSN, pool_mgr=clickhouse_pool_manager
    )


CURRENT_DIRECTORY = os.path.dirname(os.path.abspath(__file__))


APP_CONFIG = AppConfig(
    app_name="app",
    migrations_folder_path=os.path.join(CURRENT_DIRECTORY, "migrations/piccolo"),
    table_classes=table_finder(modules=["app.core.models"]),
    migration_dependencies=[],
    commands=[],
)
