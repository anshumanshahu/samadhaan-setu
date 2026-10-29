# Samadhaan Setu - ML Service

This is the AI/ML microservice for **Samadhaan Setu**, a civic issue reporting platform. It classifies citizen-uploaded images into civic issue categories using a MobileNetV2-based image classification model.

## Overview

- **Framework:** FastAPI (Python)
- **Model:** MobileNetV2 with Transfer Learning
- **Input:** Civic issue image (JPG/PNG)
- **Output:** Predicted category + confidence score

## Classes

- Garbage
- Manhole
- Pothole
- Water Leakage
- Unknown (for images that don't match any civic issue category)

## Project Structure

```
ai-model/
  main.py              # FastAPI app with /predict endpoint
  requirements.txt      # Python dependencies
  civic_model_v3.h5     # Trained MobileNetV2 model
  venv/                  # Python virtual environment (not committed to git)
```

## Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. The service will be available at `http://localhost:8000`

## API Endpoints

### `GET /`
Health check endpoint. Returns service status.

### `POST /predict`
Accepts an image file and returns the predicted civic issue category.

**Request:**
- `multipart/form-data`
- Field name: `image` (file)

**Response:**
```json
{
  "category": "pothole",
  "confidence": 94.32,
  "is_uncertain": false,
  "all_scores": {
    "garbage": 1.2,
    "manhole": 2.1,
    "pothole": 94.32,
    "unknown": 1.5,
    "water_leak": 0.88
  }
}
```

- `is_uncertain` is `true` when confidence falls below the configured threshold (default: 60%), signaling that the frontend should prompt the user to manually confirm the category.

## Testing

You can test the `/predict` endpoint using:
- **Swagger UI:** Visit `http://localhost:8000/docs` and try the endpoint directly from the browser
- **Postman:** Send a `POST` request to `http://localhost:8000/predict` with `form-data`, key `image` (type: File)

## Model Training

The model was trained using **Google Colab** (GPU) with MobileNetV2 as the base (transfer learning), on a dataset of ~4,000 collected civic issue images across 5 classes. See the main project README for full training details.

## Integration

This service is called internally by the Node.js/Express backend, which forwards citizen-uploaded images here for classification before routing the issue to the relevant civic department.

```
React (Frontend) -> Node.js/Express (Main Backend) -> FastAPI (this service) -> MobileNetV2 Model
```