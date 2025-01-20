from contextlib import asynccontextmanager
import logging as logging
from typing import List
from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from app.api.news import news_router
from app.repo import Database
from app.logger import logger

def init_routers(app_: FastAPI) -> None:
    app_.include_router(news_router)

@asynccontextmanager
async def lifespan(_: FastAPI):
    while True:
        try:
            await Database().client["admin"].command("ping")
            logger.info("Db Connection is successful")
            break
        except Exception as e:
            logger.error(f"Db Connection failed: {e}")
    yield


def make_middleware() -> List[Middleware]:
    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_methods=["*"],
            allow_headers=["*"],
        ),
    ]
    return middleware


def create_app() -> FastAPI:
    app_ = FastAPI(
        title="Media Monitoring API",
        description="Hide API",
        version="1.0.0",
        root_path="/api",
        middleware=make_middleware(),
        lifespan=lifespan,
    )
    init_routers(app_=app_)
    return app_


app = create_app()
