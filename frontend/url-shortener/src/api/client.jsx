const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    const message =
      (data && (data.detail || JSON.stringify(data))) ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  createShortUrl: (url) =>
    request("/shorten/", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),

  getShortUrl: (shortCode) => request(`/shorten/${shortCode}/`),

  updateShortUrl: (shortCode, url) =>
    request(`/shorten/${shortCode}/`, {
      method: "PUT",
      body: JSON.stringify({ url }),
    }),

  deleteShortUrl: (shortCode) =>
    request(`/shorten/${shortCode}/`, { method: "DELETE" }),

  getStats: (shortCode) => request(`/shorten/${shortCode}/stats/`),

  redirectUrl: (shortCode) =>
    `${API_BASE_URL}/r/${shortCode}/`,
};
