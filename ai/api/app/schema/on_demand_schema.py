from enum import StrEnum
from typing import Optional
from pydantic import BaseModel, Field
from app.schema.base_schema import BaseResponse


class SingleTheme(BaseModel):
    key_message: str
    concise_summary: str

class BlogThemes(BaseModel):
    themes: list[SingleTheme]




class ThemeExtractReq(BaseModel):
    title: str
    summary: str
    text: Optional[str] = None
    
class ThemeExtractRes(BaseResponse, BlogThemes):
    ...





