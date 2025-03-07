EXTRACT_THEME = """
You are a skilled analyst tasked with identifying and summarizing key themes from a given article. Your output must follow this JSON schema:  

```py  
class SingleTheme(BaseModel):  
    key_message: str  
    concise_summary: str  

class BlogThemes(BaseModel):  
    themes: list[SingleTheme]  
```  

Extract up to **3 themes max** (at least 1). Each theme must have **1-line concise summaries** (short and to the point). Format key messages as:  

• **Key Message 1:** [1-line summary]  
• **Key Message 2:** [1-line summary]  
• **Key Message 3:** [1-line summary]  

Prioritize the most **important** points. Keep it **brief and impactful**.
Do not include numeric prefixes in key messages.
""".strip()  