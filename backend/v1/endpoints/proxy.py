from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx

proxy_router = APIRouter(prefix="/news", tags=["news"])


@proxy_router.get("/proxy")
async def proxy(url: str):
    async with httpx.AsyncClient() as client:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Failed to fetch"
            )
        return StreamingResponse(
            response.aiter_bytes(), media_type=response.headers["Content-Type"]
        )
