from app.core.schemas.filters import BaseFilters


def should_default_values():
    filters = BaseFilters()
    assert filters.id == []
    assert filters.search == ""
    assert filters.not_in_fields == []
    assert filters.search_fields == []


def should_sanitize_string():
    assert BaseFilters.sanitize(" test ") == "test"
    assert BaseFilters.sanitize("O'Reilly") == "O''Reilly"


def should_sanitize_list():
    assert BaseFilters.sanitize([" test1 ", " test2 "]) == ["test1", "test2"]
    assert BaseFilters.sanitize(["O'Reilly"]) == ["O''Reilly"]


def should_build_where_clause_with_id():
    filters = BaseFilters(id=["123", "456"])
    assert filters.build_where_clause() == "id IN ('123', '456')"


def should_build_where_clause_with_not_in_fields():
    filters = BaseFilters(id=["123", "456"], not_in_fields=["id"])
    assert filters.build_where_clause() == "id NOT IN ('123', '456')"


def should_build_where_clause_with_multiple_fields():
    filters = BaseFilters(id=["123"], search_fields=["name"], search="John Doe")
    assert "id IN ('123')" in filters.build_where_clause()


def should_build_search_filter():
    filters = BaseFilters(search="John Doe", search_fields=["name", "email"])
    expected = "((name ILIKE '%John%' AND name ILIKE '%Doe%') OR (email ILIKE '%John%' AND email ILIKE '%Doe%'))"
    assert filters.build_search_filter() == expected


def should_apply_filters_without_conditions():
    filters = BaseFilters()
    query = "SELECT * FROM users"
    assert filters.apply_filters(query) == "SELECT * FROM users"


def should_apply_filters_with_conditions():
    filters = BaseFilters(id=["123"], search="John", search_fields=["name"])
    query = "SELECT * FROM users"
    expected = "SELECT * FROM users WHERE ((name ILIKE '%John%')) AND id IN ('123')"
    assert filters.apply_filters(query) == expected
