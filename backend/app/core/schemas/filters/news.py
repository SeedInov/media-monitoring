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
        id: List[str] = Query([], alias="id"),
        url: List[str] = Query([], alias="url"),
        language: List[str] = Query([], alias="language"),
        title: List[str] = Query([], alias="title"),
        summary: List[str] = Query([], alias="summary"),
        country: List[str] = Query([], alias="country"),
        sentiment: List[str] = Query([], alias="sentiment"),
        author: List[str] = Query([], alias="author"),
        meta_site_name: List[str] = Query([], alias="meta_site_name"),
        search: str = Query(None, alias="search"),
        search_fields: List[str] = Query([], alias="search_fields"),
        not_in_fields: List[str] = Query([], alias="not_in_fields"),
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
