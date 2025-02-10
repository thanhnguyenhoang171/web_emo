import cv2
import numpy as np
import face_recognition
from tensorflow.keras.models import model_from_json
import os

base_path = os.path.dirname(os.path.abspath(__file__))  # Đường dẫn thư mục hiện tại
json_path = os.path.join(
    base_path,
    "trainned/FER2013_trainned/adam_flatten/fer2013_Adam_Flatten.json",
)
weights_path = os.path.join(
    base_path,
    "trainned/FER2013_trainned/adam_flatten/best_model_fer2013_Adam_Flatten.keras",
)

with open(json_path, "r") as json_file:
    loaded_model_json = json_file.read()

# Load the model
model = model_from_json(loaded_model_json)

# Load model weights
model.load_weights(weights_path)

label_dict = {
    0: "angry",
    1: "disgust",
    2: "fear",
    3: "happy",
    4: "sad",
    5: "surprise",
    6: "neutral",
}

# Tạo thư mục lưu ảnh nếu chưa có
output_dir = "public/images/detectedEmotion"
os.makedirs(output_dir, exist_ok=True)


def predict_emotion(image_path):
    try:
        image = face_recognition.load_image_file(image_path)
        gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

        # Phát hiện khuôn mặt với HOG
        face_locations = face_recognition.face_locations(gray_image, model="hog")

        if not face_locations:
            return {"error": "No faces detected in the image."}

        confidence_threshold = 0.5
        results = []
        image_bgr = cv2.cvtColor(
            image, cv2.COLOR_RGB2BGR
        )  # Chuyển ảnh sang BGR để vẽ khung

        for face_location in face_locations:
            top, right, bottom, left = face_location
            face_image = gray_image[top:bottom, left:right]

            # Resize và chuẩn hóa khuôn mặt
            face_resized = cv2.resize(face_image, (48, 48))
            face_normalized = face_resized.astype("float32") / 255.0
            face_normalized = np.expand_dims(face_normalized, axis=-1)
            face_normalized = np.expand_dims(face_normalized, axis=0)

            predictions = model.predict(face_normalized)[0]
            predicted_class = np.argmax(predictions)
            confidence = np.max(predictions)

            if confidence >= confidence_threshold:
                label = f"{label_dict[predicted_class]} ({confidence:.2f})"

                # Vẽ khung và nhãn lên ảnh
                cv2.rectangle(image_bgr, (left, top), (right, bottom), (0, 255, 0), 2)
                cv2.putText(
                    image_bgr,
                    label,
                    (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.9,
                    (0, 255, 0),
                    2,
                )

                results.append(
                    {"class": label_dict[predicted_class], "confidenceScore": float(confidence)}
                )

        # Lưu ảnh đã vẽ khung vào thư mục 'detectedEmotion'
        output_path = os.path.join(output_dir, os.path.basename(image_path))
        cv2.imwrite(output_path, image_bgr)

        return {
            "results": results,
            "output_image": os.path.basename(output_path),
        }
    except Exception as e:
        return {"error": str(e)}
# predict_emotion(
#     "public\\images\\rating\\z6149867258087_7415800296a4842746d76e0332fd03fe-1738834289662.jpg"
# )
