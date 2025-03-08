from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from v1.api import v1_api_router


def get_application():
    _app = FastAPI(
        title=settings.PROJECT_NAME,
        root_path="/api",
        swagger_ui_parameters={
            "syntaxHighlight": {"theme": "obsidian"},
            "deepLinking": True,
        },
    )

    _app.include_router(v1_api_router)

    _app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return _app


app = get_application()
