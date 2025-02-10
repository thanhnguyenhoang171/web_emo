import cv2
import numpy as np
import face_recognition
from tensorflow.keras.models import model_from_json

# Load model structure
with open("FERPlus_Trained\\Adam_Flatten\\ferplus_Adam_Flatten.json", "r") as json_file:
    loaded_model_json = json_file.read()
# Load the model
model = model_from_json(loaded_model_json)

# Load model weights
model.load_weights("FERPlus_Trained\\Adam_Flatten\\best_model_ferplus_Adam_Flatten.keras")


def predict_emotion(image_path):
    """
    Phát hiện khuôn mặt và dự đoán cảm xúc từ ảnh đầu vào, hỗ trợ ảnh lớn.
    """
    try:
        # Load ảnh
        image = face_recognition.load_image_file(image_path)

        # Chuyển đổi ảnh sang định dạng BGR để dùng với OpenCV
        image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        # Giảm kích thước ảnh nếu ảnh quá lớn
        max_size = 800  # Kích thước tối đa (chiều dài hoặc chiều rộng)
        height, width = image.shape[:2]
        if max(height, width) > max_size:
            scale = max_size / max(height, width)
            image_bgr = cv2.resize(image_bgr, (int(width * scale), int(height * scale)))

        # Phát hiện khuôn mặt (dùng model 'cnn' để chính xác hơn, nhưng chậm hơn)
        face_locations = face_recognition.face_locations(image, model="hog")

        if not face_locations:
            print("No faces detected in the image.")
            return None

        for face_location in face_locations:
            # Trích xuất tọa độ khuôn mặt
            top, right, bottom, left = face_location

            # Cắt khuôn mặt
            face_image = image[top:bottom, left:right]
            if face_image.size == 0:
                print("Face region is too small. Skipping...")
                continue

            # Chuyển sang grayscale
            face_image = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)

            # Tiền xử lý khuôn mặt
            face_image = cv2.equalizeHist(face_image)  # Cân bằng histogram

            # Resize và chuẩn hóa khuôn mặt
            try:
                face_resized = cv2.resize(face_image, (48, 48))
            except Exception as e:
                print(f"Error resizing face image: {e}")
                continue

            face_normalized = face_resized.astype("float32") / 255.0
            face_normalized = np.expand_dims(
                face_normalized, axis=-1
            )  # Thêm chiều kênh
            face_normalized = np.expand_dims(
                face_normalized, axis=0
            )  # Thêm chiều batch

            # Dự đoán cảm xúc
            predictions = model.predict(face_normalized)[0]  # Lấy kết quả đầu tiên
            predicted_class = np.argmax(predictions)  # Chỉ số class dự đoán
            confidence = np.max(predictions)  # Độ tự tin cao nhất

            # Vẽ khung khuôn mặt và hiển thị nhãn class
            cv2.rectangle(image_bgr, (left, top), (right, bottom), (0, 255, 0), 2)
            label = f"Class {predicted_class} ({confidence:.2f})"
            cv2.putText(
                image_bgr,
                label,
                (left, top - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2,
            )

            # Hiển thị toàn bộ độ tự tin cho các class
            print("Confidence scores for each class:")
            for class_idx, score in enumerate(predictions):
                print(f"Class {class_idx}: {score:.2f}")

        # Hiển thị ảnh đã xử lý
        cv2.imshow("Emotion Detection", image_bgr)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    except Exception as e:
        print(f"Error processing image: {e}")


# Test prediction
image_path = "chup-anh-gia-dinh-3-nguoi-1.jpg"  # Đường dẫn tới ảnh đầu vào
predict_emotion(image_path)
