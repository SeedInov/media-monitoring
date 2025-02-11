import os
os.environ["HF_HOME"] = "models/huggingface"
os.environ["HF_HUB_CACHE"] = "models/huggingface/hub"
os.environ["HF_ASSETS_CACHE"] = "models/huggingface/assets"
os.environ["HF_TOKEN_PATH"] = "models/huggingface/token"


import torch
from transformers.modeling_utils import PreTrainedModel
from transformers.tokenization_utils_fast import PreTrainedTokenizerFast
from transformers import AutoTokenizer, AutoModelForSequenceClassification

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(DEVICE)

MODEL_NAME = "tabularisai/multilingual-sentiment-analysis"

TOKENIZER = AutoTokenizer.from_pretrained(MODEL_NAME)
MODEL = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME).to(DEVICE)
CLASSIFICATION_MAP = {
    0: "Very Negative", 
    1: "Negative", 
    2: "Neutral", 
    3: "Positive", 
    4: "Very Positive"
}

def clear_vram():
    if DEVICE == "cuda":
        torch.cuda.empty_cache()
        
def classify_single_record(
        model: PreTrainedModel, 
        tokenizer: PreTrainedTokenizerFast,
        classification_map: dict[int, str],
        text: str, 
        chunk_size: int = 512,
        top_k: int = 1,
        device: str = "cpu"
) -> tuple[str, list[tuple[int, int]]]:
    """
    Predicts sentiment for a single text record using a pre-trained model and tokenizer.
    The text is split into chunks for processing, and the top-k contributing chunks are identified.

    Args:
        model (PreTrainedModel): Pre-trained sentiment analysis model.
        tokenizer (PreTrainedTokenizerFast): Tokenizer for the model.
        classification_map (dict[int, str]): Dictionary of all classes
        text (str): Input text to analyze.
        chunk_size (int): Size of each chunk for processing. Default is 512.
        top_k (int): Number of top contributing chunks to return. Default is 1.
        device (str): Device to run the model on (e.g., "cuda" or "cpu"). Default is "cpu" if available.

    Returns:
        predicted_sentiment (str): Predicted sentiment label.
        contribute_chunk_text_positions (List[Tuple[int, int]]): Start and end positions of the top-k chunks in the original text.
    """
    
    # Tokenize and move inputs to target device
    inputs = tokenizer.encode_plus(
        text,
        truncation=False,
        return_tensors="pt",
        padding=False,
        return_offsets_mapping=True  # Enable offset tracking
    )
    input_ids = inputs["input_ids"].squeeze(0).to(device)
    attention_mask = inputs["attention_mask"].squeeze(0).to(device)
    offset_mapping = inputs["offset_mapping"].squeeze(0)
    
    # Adjust chunk_size if the text is shorter
    original_length = len(input_ids)
    if original_length < chunk_size:
        chunk_size = original_length

    # Calculate padding needed for full chunks
    pad_length = (chunk_size - (original_length % chunk_size)) % chunk_size
    total_chunks = (original_length + pad_length) // chunk_size
    
    # Adjust top_k if it exceeds the number of chunks
    top_k = min(top_k, total_chunks)

    # Vectorized padding and chunking
    pad_token_id = tokenizer.pad_token_id
    input_ids_padded = torch.cat([
        input_ids,
        torch.full((pad_length,), pad_token_id, dtype=torch.long, device=device)
    ])
    attention_mask_padded = torch.cat([
        attention_mask,
        torch.zeros(pad_length, dtype=torch.long, device=device)
    ])

    # Create chunks through reshaping
    chunk_inputs = {
        'input_ids': input_ids_padded.view(total_chunks, chunk_size),
        'attention_mask': attention_mask_padded.view(total_chunks, chunk_size)
    }

    # Debug print to check chunks
    # print(chunk_inputs)

    # Model inference
    with torch.no_grad():
        outputs = model(**chunk_inputs)
    
    # Average logits across chunks and compute probabilities and predictions
    avg_logits = outputs.logits.mean(dim=0)
    probabilities = torch.nn.functional.softmax(avg_logits, dim=-1)
    predicted_label_idx = probabilities.argmax().item()
    predicted_class = classification_map[predicted_label_idx]

    # Get top-k chunks using raw logits (avoids second softmax)
    chunk_contributions = outputs.logits[:, predicted_label_idx]
    topk_indices = chunk_contributions.topk(top_k).indices.cpu().tolist()

    # Map chunk indices to text positions
    contribute_positions: list[tuple[int, int]] = []
    for idx in topk_indices:
        chunk_start = idx * chunk_size
        chunk_end = chunk_start + chunk_size
        chunk_offsets = offset_mapping[chunk_start:chunk_end]
        
        # Find non-padding tokens
        non_pad = (chunk_offsets != 0).any(dim=1)
        if non_pad.any():
            start_pos = chunk_offsets[non_pad][0][0].item() # First non-pad token
            end_pos = chunk_offsets[non_pad][-1][1].item()  # Last non-pad token
        else:
            start_pos, end_pos = 0, 0
        contribute_positions.append((start_pos, end_pos))
    
    return predicted_class, contribute_positions