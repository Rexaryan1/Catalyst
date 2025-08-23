# airesources.py
from transformers import AutoTokenizer, AutoModel
import torch

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"

# Load tokenizer once (small memory footprint)
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

# Load model in "low_cpu_mem_usage" and "float16" if possible
def load_model():
    model = AutoModel.from_pretrained(
        MODEL_ID,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        low_cpu_mem_usage=True
    )
    model.eval()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    return model, device

# Lazily load model only when imported (keeps API same as before)
model, device = load_model()

