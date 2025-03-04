from pydantic import BaseModel
from service.sentiment import CLASSIFICATION_MAP, DEVICE, MODEL, TOKENIZER, SentimentType, classify_single_record, clear_vram

class Sentiment(BaseModel):
    sentiment: SentimentType
    indices: list[tuple[int,int]]
    text: str

def sentiment_extract(text: str, top_k: int):
    sentiment, sentiment_indicator_indexes = classify_single_record(
        model=MODEL,
        tokenizer=TOKENIZER,
        classification_map=CLASSIFICATION_MAP,
        text="blog text here .....",
        chunk_size=128,
        top_k=2,
        device=DEVICE
    )
    clear_vram()

    return Sentiment(text=text, sentiment=sentiment, indices=sentiment_indicator_indexes)
    

if __name__ == "__main__":
    print(sentiment_extract("GREAAAAAAT YAYYYY HAPPY", 2))