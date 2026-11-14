/**
 * API client for Instagram Downloader backend.
 * Provides fallback between direct backend URL and Next.js rewrite proxy.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function validateInstagramUrl(url) {
  const endpoints = [
    `${BACKEND_URL}/api/validate`,
    "/backend-api/validate"
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Invalid Instagram link");
      }
      return data;
    } catch (err) {
      lastError = err;
      // If direct endpoint failed with connection error, try proxy endpoint
    }
  }

  throw lastError || new Error("Failed to validate Instagram URL");
}

export async function fetchInstagramMedia(url) {
  const endpoints = [
    `${BACKEND_URL}/api/fetch`,
    "/backend-api/fetch"
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Unable to download content from this URL");
      }
      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to connect to media processing server");
}

export function buildDownloadProxyUrl(directUrl, filename, audioUrl = null, quality = null, formatId = null) {
  if (!directUrl) return "";
  const base = `${BACKEND_URL}/api/download`;
  const params = new URLSearchParams({
    url: directUrl,
    filename: filename || "fastedl_media"
  });
  if (audioUrl) {
    params.set("audio_url", audioUrl);
  }
  if (quality) {
    params.set("quality", quality);
  }
  if (formatId) {
    params.set("format_id", formatId);
  }
  return `${base}?${params.toString()}`;
}

