export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// JSON or multipart (formData) request to our Node backend
export async function apiRequest(path, { token, method = "GET", body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload;
  if (formData) {
    payload = formData; // browser sets the multipart boundary itself
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong");
    err.status = res.status;
    throw err;
  }
  return data;
}

// <img> tags cannot send the login token, so we fetch the photo and make a blob URL
export async function fetchImageBlobUrl(complaintId, token) {
  const res = await fetch(`${API_URL}/complaints/${complaintId}/image`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Image not available");
  return URL.createObjectURL(await res.blob());
}