import httpx
import pytest
from httpx import ASGITransport, AsyncClient
from app import app
from unittest.mock import AsyncMock, MagicMock
from v1.endpoints.proxy import get_async_client


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
async def should_returns_proxy_content(client: AsyncClient):
    mock_client = AsyncMock(httpx.AsyncClient)
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {"Content-Type": "text/plain"}
    mock_response.aiter_bytes.return_value = [b"Test content"]
    mock_client.get.return_value = mock_response

    def get_mock_client():
        return mock_client

    app.dependency_overrides[get_async_client] = get_mock_client
    response = await client.get("/news/proxy?url=https://streaming-response.com")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/plain"
    assert response.content == b"Test content"
