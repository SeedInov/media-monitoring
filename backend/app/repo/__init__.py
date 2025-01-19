from motor.motor_asyncio import AsyncIOMotorClient

from app.config import config

client = AsyncIOMotorClient(config.db_uri, maxPoolSize=200)
db = client[config.db_name]


class Database:
    def __init__(self):
        self.news = db["news"]
