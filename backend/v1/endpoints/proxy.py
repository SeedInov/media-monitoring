from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
import httpx

from v1.dependencies import get_async_client

proxy_router = APIRouter(prefix="/proxy", tags=["Proxy"])


@proxy_router.get("")
async def proxy(
    url: str = Query(..., example="https://imageurl.com/image.png"),
    client: httpx.AsyncClient = Depends(get_async_client),
):
    """
    Proxy an image from a URL
    """
    response = await client.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        },
    )
    return StreamingResponse(
        response.aiter_bytes(),
        media_type=response.headers["Content-Type"],
        headers=response.headers,
    )
