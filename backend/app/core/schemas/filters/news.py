from typing import List

from fastapi import Query
from app.core.schemas.filters import BaseFilters


class NewsFilters(BaseFilters):
    url: list[str] = []
    language: list[str] = []
    title: list[str] = []
    summary: list[str] = []
    country: list[str] = []
    sentiment: list[str] = []
    author: list[str] = []
    meta_site_name: list[str] = []

    @staticmethod
    def parse(
        id: List[str] = Query([], alias="id", description="Filter by ID"),
        url: List[str] = Query([], alias="url", description="Filter by URL"),
        language: List[str] = Query(
            [], alias="language", description="Filter by Language"
        ),
        title: List[str] = Query([], alias="title", description="Filter by Title"),
        summary: List[str] = Query(
            [], alias="summary", description="Filter by Summary"
        ),
        country: List[str] = Query(
            [], alias="country", description="Filter by Country"
        ),
        sentiment: List[str] = Query(
            [],
            alias="sentiment",
            description="Filter by Sentiment",
            openapi_examples={
                "positive": {"value": "positive"},
                "negative": {"value": "negative"},
                "neutral": {"value": "neutral"},
            },
        ),
        author: List[str] = Query([], alias="author", description="Filter by Author"),
        meta_site_name: List[str] = Query(
            [], alias="meta_site_name", description="Filter by Meta Site Name"
        ),
        search: str = Query(None, alias="search", description="Search query"),
        search_fields: List[str] = Query(
            [],
            alias="search_fields",
            description="Fields to search",
            openapi_examples={
                "title": {"value": "title"},
                "summary": {"value": "summary"},
                "country": {"value": "country"},
                "author": {"value": "author"},
                "meta_site_name": {"value": "meta_site_name"},
            },
        ),
        not_in_fields: List[str] = Query(
            [],
            alias="not_in_fields",
            description="Fields passed as filter will be treated as negation",
        ),
    ) -> "NewsFilters":
        return NewsFilters(
            id=NewsFilters.sanitize(id),
            url=NewsFilters.sanitize(url),
            language=NewsFilters.sanitize(language),
            title=NewsFilters.sanitize(title),
            summary=NewsFilters.sanitize(summary),
            country=NewsFilters.sanitize(country),
            author=NewsFilters.sanitize(author),
            meta_site_name=NewsFilters.sanitize(meta_site_name),
            sentiment=NewsFilters.sanitize(sentiment),
            search=NewsFilters.sanitize(search),
            search_fields=NewsFilters.sanitize(search_fields),
            not_in_fields=NewsFilters.sanitize(not_in_fields),
        )
