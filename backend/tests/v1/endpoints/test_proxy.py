import pytest
from httpx import ASGITransport, AsyncClient
from app import app
from unittest.mock import MagicMock, patch


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
@patch("httpx.AsyncClient.get")
async def test_proxy_success(mock_get, client: AsyncClient):
    """Test successful proxy request."""
    mock_get.return_value = MagicMock()
    mock_get.return_value.status_code = 200
    mock_get.return_value.headers = {"Content-Type": "text/plain"}
    mock_get.return_value.content = b"Streaming Response"
    response = await client.get("/news/proxy?url=https://streaming-response.com")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "text/plain"
    assert response.content == b"Streaming Response"


@pytest.mark.asyncio
@patch("httpx.AsyncClient.get")
async def test_proxy_non_200_response(mock_get, client: AsyncClient):
    """Test proxy request handling when the external API returns an error."""
    mock_get.return_value = MagicMock()
    mock_get.return_value.status_code = 404
    mock_get.return_value.json.return_value = {"detail": "Failed to fetch"}
    
    response = await client.get("/news/proxy?url=https://streaming-response.com")
    assert response.status_code == 404
    assert response.json() == {"detail": "Failed to fetch"}



