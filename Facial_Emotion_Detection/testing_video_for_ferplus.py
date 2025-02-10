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
model.load_weights(
    "FERPlus_Trained\\Adam_Flatten\\best_model_ferplus_Adam_Flatten.keras"
)


def predict_emotion(image_path):
    """
    Phát hiện khuôn mặt và dự đoán cảm xúc từ ảnh đầu vào.
    """
    # Load ảnh
    try:
        image = face_recognition.load_image_file(image_path)
    except Exception as e:
        print(f"Error loading image: {e}")
        return


    # Phát hiện khuôn mặt với CNN
    face_locations = face_recognition.face_locations(
        image, model="cnn"
    )  # Sử dụng CNN thay vì HOG

    if not face_locations:
        print("No faces detected in the image.")
        return None

    # Chuyển ảnh từ RGB (face_recognition) sang BGR (OpenCV)
    image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    # Ngưỡng độ tự tin
    confidence_threshold = 0.2

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

        # Resize và chuẩn hóa khuôn mặt
        try:
            face_resized = cv2.resize(
                face_image, (48, 48)
            )  # Chỉnh lại kích thước ảnh khuôn mặt
        except Exception as e:
            print(f"Error resizing face image: {e}")
            continue

        face_normalized = face_resized.astype("float32") / 255.0
        face_normalized = np.expand_dims(face_normalized, axis=-1)  # Thêm chiều kênh
        face_normalized = np.expand_dims(face_normalized, axis=0)  # Thêm chiều batch

        # Dự đoán cảm xúc
        predictions = model.predict(face_normalized)[0]  # Lấy kết quả đầu tiên
        predicted_class = np.argmax(predictions)  # Chỉ số class dự đoán
        confidence = np.max(predictions)  # Độ tự tin cao nhất

        # Kiểm tra độ tự tin
        if confidence >= confidence_threshold:
            # Vẽ hình chữ nhật quanh khuôn mặt
            cv2.rectangle(image_bgr, (left, top), (right, bottom), (0, 255, 0), 2)

            # Gắn nhãn cho khuôn mặt
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
        else:
            # Nếu độ tự tin thấp hơn ngưỡng, không hiển thị kết quả
            print(f"Confidence below threshold: {confidence:.2f}")

    # Hiển thị ảnh đã xử lý
    cv2.imshow("Detected Emotion", image_bgr)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


# Test prediction
image_path = "chup-anh-gia-dinh-3-nguoi-1.jpg"  # Đường dẫn tới ảnh đầu vào
predict_emotion(image_path)


# label_dict = {
#     0: "fear",
#     1: "surprise",
#     2: "angry",
#     3: "neutral",
#     4: "sad",
#     5: "disgust",
#     6: "contempt",
#     7: "happy",
# }

# label_dict = {
#     0: "angry",
#     1: "disgust",
#     2: "fear",
#     3: "happy",
#     4: "sad",
#     5: "surprise",
#     6: "neutral",
# }
