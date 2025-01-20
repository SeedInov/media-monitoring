from app.logger import logger
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import config

client = AsyncIOMotorClient(config.db_uri, maxPoolSize=200)
db = client[config.db_name]


class Database:
    def __init__(self):
        self.client = client
        self.db = db
        self.news = db["news"]

    async def initialize_indices(self):
        try:
            await self.news.create_index([("url", 1)], name="url_uc", unique=True)
        except Exception as e:
            logger.error(f"Index creation failed: It may Already Exists {e}")
