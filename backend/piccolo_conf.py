from urllib.parse import urlparse
from piccolo.conf.apps import AppRegistry
from piccolo.engine.postgres import PostgresEngine
from app.core.config import settings


parsed_pg_dsn = urlparse(settings.POSTGRES_DSN)
DB_CONFIG = {
    "database": parsed_pg_dsn.path[1:] or "media-monitoring",
    "user": parsed_pg_dsn.username,
    "password": parsed_pg_dsn.password,
    "host": parsed_pg_dsn.hostname,
    "port": parsed_pg_dsn.port,
}

DB = PostgresEngine(config=DB_CONFIG)

APP_REGISTRY = AppRegistry(apps=["app.core.database"])
