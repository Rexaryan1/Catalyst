from transformers import AutoModel, AutoTokenizer
import torch

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

# Use half precision if possible, load layer by layer to reduce peak memory
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
model = AutoModel.from_pretrained(
    MODEL_ID,
    torch_dtype=torch_dtype,
    low_cpu_mem_usage=True,
    use_safetensors=True
)

# Disable gradients (saves memory)
for param in model.parameters():
    param.requires_grad = False

model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

