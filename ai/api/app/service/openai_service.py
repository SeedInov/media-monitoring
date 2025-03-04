import json
from config import CONFIG
from functools import wraps
from openai import AsyncOpenAI
from app.utils.logger import LOG
from fastapi import HTTPException
from typing import Optional, Type
from openai.types.chat import ChatCompletion
from pydantic import BaseModel, ValidationError



GEMINI_CLIENT = AsyncOpenAI(
    base_url=CONFIG.base_url,
    api_key=CONFIG.gemini_api_key
)


def json_from_text(text: str) -> dict:
    # Check if the text starts with ```json and adjust the starting point
    index = text.find("```json")
    if index == -1:
        index = 0
    text = text[index:]
        
    text = text[next(idx for idx, c in enumerate(text) if c in "{[") :]
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        return json.loads(text[: e.pos])

def retries_gpt_response(err: HTTPException, 
                         err_msg: str = "", 
                         validate: Optional[Type[BaseModel]] = None, 
                         find_json: bool = False, 
                         tries: int = 3) -> tuple[BaseModel | str, int, int, int]:
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):

            for try_count in range(tries):
                try:

                    res: ChatCompletion = await func(*args, **kwargs)
                    content = res.choices[0].message.content
                    
                    # LOG.debug(content)

                    if validate is None:
                        output = content
                    else:
                        if find_json:
                            output = validate.model_validate(
                                json_from_text(text=content)
                            )
                        else:
                            output = validate.model_validate_json(content)

                    return (
                        output,
                        res.usage.prompt_tokens,
                        res.usage.completion_tokens,
                        res.usage.total_tokens,
                    )

                except (ValidationError, json.JSONDecodeError) as e:
                    LOG.warning(f"{err_msg} parse error, retries {try_count+1}")
                except Exception as e:
                    LOG.critical(f"Exception in {err_msg}: {e}")
                    raise e

            LOG.error(f"Validation error {err_msg}")
            raise err

        return wrapper

    return decorator