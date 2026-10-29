// Calls the FastAPI model. The backend re-checks every photo itself,
// so nobody can fake the category from the browser.
const ML_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

exports.classifyBuffer = async (buffer, contentType) => {
  const form = new FormData();
  form.append("image", new Blob([buffer], { type: contentType }), "photo.jpg");

  const res = await fetch(`${ML_URL}/predict`, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`ML service responded with ${res.status}`);
  return res.json(); // { category, confidence, is_uncertain, all_scores }
};