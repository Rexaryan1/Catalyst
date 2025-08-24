import logging
from typing import List
import torch
from transformers import AutoTokenizer, AutoModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Force CPU (Render free tier usually has no GPU)
device = torch.device("cpu")

# Load small paraphrase model (MiniLM ~22MB)
MODEL_NAME = "sentence-transformers/paraphrase-MiniLM-L6-v2"
logger.info(f"🚀 Loading model: {MODEL_NAME} on CPU (optimized for low RAM)")

# Use float16 if supported to reduce memory
dtype = torch.float16 if torch.backends.mps.is_available() else torch.float32

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME, torch_dtype=dtype).to(device)
model.eval()  # inference only

def generate_embedding_from_text(text: str) -> List[float]:
    """Generate a semantic embedding vector from a single text string."""
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128  # shorter = less RAM
    ).to(device)

    with torch.no_grad():
        output = model(**inputs)
        # CLS pooling
        cls_vector = output.last_hidden_state[:, 0, :]
        return cls_vector.cpu().numpy()[0].tolist()

def _generate_query_vector(subject: str, topic: str, additional_comments: str) -> List[float]:
    """Generate a semantic embedding vector from subject, topic, and comments."""
    query_text = f"Subject: {subject}. Topic: {topic}. {additional_comments}".strip()
    logger.info(f"🧠 Generating embedding for: {query_text}")

    inputs = tokenizer(
        query_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    ).to(device)

    with torch.no_grad():
        output = model(**inputs)
        cls_vector = output.last_hidden_state[:, 0, :]
        return cls_vector.cpu().numpy()[0].tolist()


