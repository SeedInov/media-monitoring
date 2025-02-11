import pandas as pd
from service.sentiment import CLASSIFICATION_MAP, DEVICE, MODEL, TOKENIZER, classify_single_record, clear_vram
import argparse

def main():
    parser = argparse.ArgumentParser(description="Classify sentiment of text data.")
    parser.add_argument("data_path", type=str, help="Path to the CSV data file.")
    parser.add_argument("--start", type=int, default=0, help="Start index for processing (inclusive).")
    parser.add_argument("--end", type=int, default=-1, help="End index for processing (exclusive).  Use -1 for the end of the file")
    args = parser.parse_args()

    column = "text"  # Assuming "text" is the column containing the text data. Adjust if needed.

    try:
        df = pd.read_csv(args.data_path, encoding="utf-8")
    except FileNotFoundError:
        print(f"Error: File not found at {args.data_path}")
        return
    except Exception as e: # Catch other potential errors during file reading
        print(f"Error reading file: {e}")
        return


    if args.end == -1:
        end = len(df)
    else:
        end = min(args.end, len(df)) # Ensure end is not out of bounds

    df = df.iloc[args.start:end].copy() # Process only the specified slice and create a copy to avoid SettingWithCopyWarning
    df["sentiment"] = None
    df["sentiment_indicator_indexes"] = None
    texts = df[column]

    for i in range(len(texts)):
        sentiment, sentiment_indicator_indexes = classify_single_record(
            model=MODEL,
            tokenizer=TOKENIZER,
            classification_map=CLASSIFICATION_MAP,
            text=texts.iloc[i],  # Use .iloc to access elements by integer position
            chunk_size=128,
            top_k=2,
            device=DEVICE
        )
        df.at[df.index[i], "sentiment"] = sentiment # Use df.index[i] to access the correct index from the original dataframe.
        df.at[df.index[i], "sentiment_indicator_indexes"] = sentiment_indicator_indexes # Use df.index[i] to access the correct index from the original dataframe.

        clear_vram()

    clear_vram()

    print(df[["title", "sentiment", "sentiment_indicator_indexes"]])


if __name__ == "__main__":
    main()