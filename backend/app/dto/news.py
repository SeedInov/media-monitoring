from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel


class News(BaseModel):
    id: str
    url: str
    read_more_link: Optional[str]
    language: str
    title: str
    top_image: Optional[str]
    meta_img: Optional[str]
    images: List[str] = []
    movies: List[str] = []
    keywords: List[str] = []
    meta_keywords: List[str] = []
    tags: List[str] = []
    authors: List[str] = []
    publish_date: Optional[datetime]
    summary: str
    meta_description: Optional[str]
    meta_lang: Optional[str]
    meta_favicon: Optional[str]
    meta_site_name: Optional[str]
    canonical_link: str
    text: str
    country: str
    decoded_url: str
    google_uri: str
    extracted_keywords: List[str]
    sentiment: str
    sentiment_impactful_texts: List[str]


class SentimentCount(BaseModel):
    name: str
    count: int


class DailyNewsSentiment(BaseModel):
    date: date
    positive: int
    negative: int
    neutral: int
    very_negative: int
    very_positive: int
    all: int

class NewsSentimentByCountry(BaseModel):
    country: str
    positive: int
    negative: int
    neutral: int
    very_negative: int
    very_positive: int
    all: int
