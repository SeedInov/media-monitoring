from app.schema.constants import CHAT_MODEL_MINI
from app.res.error import ThemeExtractFailure
from app.prompt.theme_prompt import EXTRACT_THEME
from app.schema.on_demand_schema import BlogThemes
from app.service.openai_service import GEMINI_CLIENT, retries_gpt_response


@retries_gpt_response(validate=BlogThemes, err=ThemeExtractFailure, err_msg="Resume Build", tries=3)
async def generate_themes(title: str, summary: str, text: str) -> tuple[BlogThemes, int, int, int]:
    prompt = f"""
{EXTRACT_THEME}

---

Article:

Title: {title}

Summary: {summary}

""".strip()

    return await GEMINI_CLIENT.chat.completions.create(
        model=CHAT_MODEL_MINI,
        response_format={"type": "json_object"},
        temperature=0,
        messages=[
            {"role": "user", "content": prompt},
        ]
    )
