import sys
import json
import os
from predict_emotion import predict_emotion  # Hàm predict_emotion

if __name__ == "__main__":
    # Tắt log TensorFlow
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
    sys.stdout.reconfigure(encoding="utf-8")  # Đảm bảo xuất ra định dạng utf-8

    image_path = sys.argv[1]
    result = predict_emotion(image_path)

    # Chỉ in kết quả JSON
    print(json.dumps(result, ensure_ascii=False))
