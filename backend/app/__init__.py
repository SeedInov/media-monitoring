from typing import List
from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware
from app.api.news import news_router


def init_routers(app_: FastAPI) -> None:
    app_.include_router(news_router)


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
        title="PNI-Backend",
        description="Hide API",
        version="1.0.0",
        root_path="/api",
        middleware=make_middleware(),
    )
    init_routers(app_=app_)
    return app_


app = create_app()
