from typing import List

from fastapi import Query
from app.types.filters import BaseFilters


class NewsFilters(BaseFilters):
    url: list[str] = []
    language: list[str] = []
    title: list[str] = []
    summary: list[str] = []
    country: list[str] = []

    @staticmethod
    def parse(
        id: List[str] = Query([], alias="id"),
        url: List[str] = Query([], alias="url"),
        language: List[str] = Query([], alias="language"),
        title: List[str] = Query([], alias="title"),
        summary: List[str] = Query([], alias="summary"),
        country: List[str] = Query([], alias="country"),
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
            search=NewsFilters.sanitize(search),
            search_fields=NewsFilters.sanitize(search_fields),
            not_in_fields=NewsFilters.sanitize(not_in_fields),
        )
