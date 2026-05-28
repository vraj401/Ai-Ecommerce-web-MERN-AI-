from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

CHROMA_PATH = BASE_DIR / "chroma-db"

TOP_K = 20
FETCH_K = 50
LAMBDA_MULT = 0.7