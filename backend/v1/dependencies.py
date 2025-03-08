from typing import AsyncGenerator

import httpx


async def get_async_client() -> AsyncGenerator[httpx.AsyncClient, None]:
    async with httpx.AsyncClient() as client:
        yield client
