const ML_URL = import.meta.env.VITE_ML_API_URL || "http://127.0.0.1:8000";

// Phone photos can be 5-12 MB. The model resizes to 224x224 anyway,
// so we shrink first: much faster upload, same prediction quality.
async function shrinkImage(file, maxSide = 1024) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    );
    return blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file; // unsupported format in this browser: send the original
  }
}

/**
 * Sends the photo to the FastAPI model.
 * Returns: { category, confidence, is_uncertain, all_scores }
 */
export async function classifyImage(file) {
  const photo = await shrinkImage(file);

  const formData = new FormData();
  formData.append("image", photo); // must match the FastAPI parameter name: image

  let res;
  try {
    res = await fetch(`${ML_URL}/predict`, { method: "POST", body: formData });
  } catch {
    throw new Error(
      "Could not reach the AI service. Check that the FastAPI server is running."
    );
  }

  if (!res.ok) {
    let detail = "Prediction failed. Please try again.";
    try {
      detail = (await res.json()).detail || detail;
    } catch {
      /* keep default message */
    }
    throw new Error(detail);
  }

  return res.json();
}