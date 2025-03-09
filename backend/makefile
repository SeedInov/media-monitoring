test:
	uv run pytest --cov=app --cov=v1
run:
	uv run main.py
migrate-clickhouse:
	uv run python -m app.core.database.migrations.clickhouse.migrate

migration-generate:
	uv run piccolo migrations new app --auto
migration-check:
	uv run piccolo migrations check

migration-run:
	uv run piccolo migrations forwards app