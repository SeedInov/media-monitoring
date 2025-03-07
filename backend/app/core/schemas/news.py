from pydantic import BaseModel
from datetime import date


class SentimentCount(BaseModel):
    name: str
    count: int


class SentimentByDay(BaseModel):
    date: date
    positive: int
    negative: int
    neutral: int
    very_negative: int
    very_positive: int
    all: int


class SentimentByCountry(BaseModel):
    country: str
    positive: int
    negative: int
    neutral: int
    very_negative: int
    very_positive: int
    all: int
