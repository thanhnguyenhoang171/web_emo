import sys
import json
from predict_sentiment import infer  # Gọi hàm infer từ predict_sentiment.py

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")  # Đảm bảo xuất ra utf-8

    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing input text"}, ensure_ascii=False))
        sys.exit(1)

    text = " ".join(sys.argv[1:])  # Ghép các từ nếu có dấu cách
    result = infer(text)

    # In kết quả JSON
    print(json.dumps(result, ensure_ascii=False))
