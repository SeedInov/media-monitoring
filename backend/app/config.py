import os
from dotenv import load_dotenv


class Config:
    def __init__(self):
        load_dotenv()
        self.db_uri = os.environ["DB_URI"]
        self.db_name = os.environ["DB_NAME"]


config = Config()
