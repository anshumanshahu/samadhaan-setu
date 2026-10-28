from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI(title="Samadhaan Setu - ML Service")

# Allow Node/Express backend (and React during local dev) to call this service.
# Replace "*" with your actual frontend/backend URLs before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Load model once at startup (not on every request) ----
MODEL_PATH = "model/civic_model_v3.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Must match the alphabetical folder order from training (train_gen.class_indices)
CLASS_NAMES = ["garbage", "manhole", "pothole", "unknown", "water_leak"]

CONFIDENCE_THRESHOLD = 60.0  # below this, treat as uncertain


def preprocess_image(file_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Samadhaan Setu ML service is running"}


@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    try:
        file_bytes = await image.read()
        img_array = preprocess_image(file_bytes)

        prediction = model.predict(img_array)
        scores = prediction[0]

        predicted_index = int(np.argmax(scores))
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(scores) * 100)

        all_scores = {
            CLASS_NAMES[i]: float(scores[i] * 100) for i in range(len(CLASS_NAMES))
        }

        is_uncertain = confidence < CONFIDENCE_THRESHOLD

        return {
            "category": predicted_class,
            "confidence": round(confidence, 2),
            "is_uncertain": is_uncertain,
            "all_scores": {k: round(v, 2) for k, v in all_scores.items()},
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")