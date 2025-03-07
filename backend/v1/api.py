from fastapi import APIRouter
from v1.endpoints.news import news_router
from v1.endpoints.proxy import proxy_router


v1_api_router = APIRouter()
v1_api_router.include_router(news_router)
v1_api_router.include_router(proxy_router)
