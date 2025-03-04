from config import CONFIG
from fastapi import APIRouter
from app.api.on_demand import on_demand_job


MAIN_ROUTER = APIRouter(prefix=CONFIG.root_path)

MAIN_ROUTER.include_router(on_demand_job)