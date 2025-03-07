import re
from typing import List, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T", str, List[str])


class BaseFilters(BaseModel):
    id: List[str] = []
    search: Optional[str] = ""
    not_in_fields: List[str] = []
    search_fields: List[str] = []

    @staticmethod
    def sanitize(value: T) -> T:
        """Sanitize input by trimming spaces and preventing SQL injection."""
        if isinstance(value, list):
            return [item.strip().replace("'", "''") for item in value]
        return value.strip().replace("'", "''") if isinstance(value, str) else value

    def build_where_clause(self):
        filters = []
        search_filter = self.build_search_filter()
        if search_filter:
            filters.append(search_filter)

        for key, values in self.model_dump(
            exclude_unset=True, exclude={"not_in_fields", "search_fields", "search"}
        ).items():
            if values:
                op = "NOT IN" if key in self.not_in_fields else "IN"
                values_str = ", ".join(f"'{value}'" for value in values)
                filters.append(f"{key} {op} ({values_str})")

        return " AND ".join(filters) if filters else ""

    def build_search_filter(self):
        if self.search and self.search_fields:
            conditions = []
            for field in self.search_fields:
                field_conditions = [
                    f"{field} ILIKE '%{re.escape(keyword)}%'"
                    for keyword in self.search.split(" ")
                ]
                conditions.append(f"({' AND '.join(field_conditions)})")
            return f"({' OR '.join(conditions)})"

    def apply_filters(self, base_query: str):
        where_clause = self.build_where_clause()
        return f"{base_query} WHERE {where_clause}" if where_clause else base_query
