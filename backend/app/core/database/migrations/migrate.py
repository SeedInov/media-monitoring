from clickhouse_migrations.clickhouse_cluster import ClickhouseCluster
from app.core.config import settings
from urllib.parse import urlparse
from colorama import Fore, Style, init

init(autoreset=True)

dsn = urlparse(settings.CLICKHOUSE_DSN)
db_host = dsn.hostname
db_user = dsn.username
db_password = dsn.password
db_name = dsn.path.lstrip("/")
migrations_home = "app/core/database/migrations"

cluster = ClickhouseCluster(db_host, db_user, db_password)

migrations = cluster.migrate(
    db_name,
    migrations_home,
    cluster_name=None,
    create_db_if_no_exists=True,
    multi_statement=True,
)

print(
    f"{Fore.CYAN}{Style.BRIGHT}Running migrations for database: {db_name}{Style.RESET_ALL}"
)
print(f"{Fore.YELLOW}Host: {db_host}, User: {db_user}{Style.RESET_ALL}")

for migration in migrations:
    print(
        f"{Fore.GREEN}Migration {migration.version} with:{Style.RESET_ALL}\n{Fore.LIGHTBLACK_EX}{migration.script}{Style.RESET_ALL}"
    )

print(
    f"{Fore.MAGENTA}{Style.BRIGHT}\nMigration process completed successfully!{Style.RESET_ALL}"
)
