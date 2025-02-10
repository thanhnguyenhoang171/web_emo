import argparse
import torch
import torch.nn as nn
from transformers import AutoTokenizer, AutoModel
from pyvi import ViTokenizer
from gensim.utils import simple_preprocess
import os

base_path = os.path.dirname(os.path.abspath(__file__))  # Đường dẫn thư mục hiện tại
model_path = os.path.join(
    base_path,
    "trainned/sentiment_trainned/phobert_fold7.pth",
)
# Xác định thiết bị
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# Danh sách nhãn cảm xúc
class_names = ["Positive", "Negative", "Neutral"]


# Định nghĩa mô hình (ví dụ)
class SentimentClassifier(nn.Module):
    def __init__(self, n_classes):
        super(SentimentClassifier, self).__init__()
        self.bert = AutoModel.from_pretrained("vinai/phobert-base")
        self.drop = nn.Dropout(p=0.3)
        self.fc = nn.Linear(self.bert.config.hidden_size, n_classes)

    def forward(self, input_ids, attention_mask):
        last_hidden_state, output = self.bert(
            input_ids=input_ids, attention_mask=attention_mask, return_dict=False
        )
        x = self.drop(output)
        x = self.fc(x)
        return x


# Khởi tạo tokenizer và model với số lớp tương ứng (ở đây dùng n_classes=3 như đã train)
tokenizer = AutoTokenizer.from_pretrained("vinai/phobert-base", use_fast=False)
model = SentimentClassifier(n_classes=3)
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()


def infer(text, max_len=120):
    # Tiền xử lý văn bản
    text_proc = " ".join(simple_preprocess(text))
    text_proc = ViTokenizer.tokenize(text_proc)
    encoded = tokenizer.encode_plus(
        text_proc,
        max_length=max_len,
        truncation=True,
        add_special_tokens=True,
        padding="max_length",
        return_attention_mask=True,
        return_tensors="pt",
    )
    input_ids = encoded["input_ids"].to(device)
    attention_mask = encoded["attention_mask"].to(device)
    with torch.no_grad():
        output = model(input_ids, attention_mask)
        _, y_pred = torch.max(output, dim=1)
    return {"emotion": class_names[y_pred.item()]}
