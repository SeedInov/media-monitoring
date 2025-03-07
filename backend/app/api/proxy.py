from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx

proxy_router = APIRouter(prefix="/news", tags=["news"])


@proxy_router.get("/proxy")
async def proxy(url: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch"
            )
        return StreamingResponse(
            response.aiter_bytes(), media_type=response.headers["Content-Type"]
        )
