from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torch.nn.functional as F
import string

# ---------------------------------------------------------
# 1. Tokenizer and Model Classes
# ---------------------------------------------------------

class Tokenizer:
    def __init__(self):
        self.vocab = {char: idx + 1 for idx, char in enumerate(string.printable)}
        self.vocab_size = len(self.vocab) + 1

    def encode(self, text):
        text = str(text)[:200]
        indices = [self.vocab.get(c, 0) for c in text]
        padding = [0] * (200 - len(indices))
        return indices + padding

class UrlCNN(nn.Module):
    def __init__(self, vocab_size, embed_dim=32, num_filters=64, kernel_sizes=[3, 4, 5], num_classes=1):
        super(UrlCNN, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.convs = nn.ModuleList([
            nn.Conv1d(in_channels=embed_dim,
                      out_channels=num_filters,
                      kernel_size=k) for k in kernel_sizes])

        # dropout for regularization
        self.dropout = nn.Dropout(0.5)

        # fully connected output layer
        self.fc = nn.Linear(num_filters * len(kernel_sizes), num_classes)

    def forward(self, x):
        # embedding
        x = self.embedding(x) 
        x = x.permute(0, 2, 1) 

        # applying convolutions + reLU + global max pooling
        x_list = [F.relu(conv(x)) for conv in self.convs]
        x_list = [F.max_pool1d(conv_out, conv_out.shape[2]).squeeze(2) for conv_out in x_list]

        x = torch.cat(x_list, 1)

        # dropout and classify
        x = self.dropout(x)
        return self.fc(x)

# ---------------------------------------------------------
# 2. Initialize FastAPI and Load Trained Weights
# ---------------------------------------------------------

app = FastAPI()

# Allow CORS so your Chrome Extension can talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the exact same tokenizer and model architecture
tokenizer = Tokenizer()
# Note: num_filters must match what you used during training (128)
model = UrlCNN(vocab_size=tokenizer.vocab_size, num_classes=1, num_filters=128)

# Load the saved weights mapping them to the CPU
model.load_state_dict(torch.load('phishing_cnn.pth', map_location=torch.device('cpu'), weights_only=True))
model.eval() # Set the model to evaluation mode

# ---------------------------------------------------------
# 3. Define the API Endpoint
# ---------------------------------------------------------

class URLRequest(BaseModel):
    url: str

@app.post("/predict")
def predict_url(request: URLRequest):
    # Encode the incoming URL string
    encoded = tokenizer.encode(request.url)
    inputs = torch.tensor([encoded], dtype=torch.long)
    
    # Run the model without tracking gradients (faster & uses less memory)
    with torch.no_grad():
        outputs = model(inputs)
        prob = torch.sigmoid(outputs).item()
        
    return {
        "isDangerous": prob > 0.5,
        "confidence": prob
    }