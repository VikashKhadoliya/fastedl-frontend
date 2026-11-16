/**
 * API client for FastEDL Instagram Downloader backend.
 * Provides resilient fallback between direct Railway production backend and Next.js proxy route,
 * with strict Content-Type checking to prevent raw HTML parse errors.
 */

const PRODUCTION_BACKEND_URL = "https://fastedl-backend-production.up.railway.app";

export function getBackendBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return PRODUCTION_BACKEND_URL;
    }
  }
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_BACKEND_URL;
  }
  return "http://127.0.0.1:8000";
}

/**
 * Safely parses response, ensuring HTML error pages never trigger JSON syntax exceptions.
 */
async function parseApiResponse(res, fallbackMessage) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.toLowerCase().includes("application/json");

  let payload = null;
  if (isJson) {
    try {
      payload = await res.json();
    } catch (e) {
      // Malformed JSON body
      payload = null;
    }
  }

  if (!res.ok) {
    // 1. If structured JSON error returned by FastAPI
    if (payload) {
      if (typeof payload.detail === "string" && payload.detail.trim()) {
        throw new Error(payload.detail);
      }
      if (Array.isArray(payload.detail) && payload.detail.length > 0) {
        const first = payload.detail[0];
        throw new Error(first.msg || first.message || fallbackMessage);
      }
      if (payload.message) {
        throw new Error(payload.message);
      }
    }

    // 2. If HTML or gateway error returned (e.g. Vercel 404/502/504)
    if (!isJson) {
      if (res.status === 404) {
        throw new Error("Media service endpoint not found (404). Please ensure backend is reachable.");
      }
      if (res.status === 502 || res.status === 503) {
        throw new Error("FastEDL backend is currently warming up on Railway. Please wait 10 seconds and try again.");
      }
      if (res.status === 504) {
        throw new Error("Request timed out. Instagram took too long to respond. Please try again.");
      }
      throw new Error(`Server returned HTTP status ${res.status}.`);
    }

    throw new Error(fallbackMessage);
  }

  // If response is OK but not JSON (unexpected proxy response)
  if (!isJson || !payload) {
    throw new Error("Server returned an invalid non-JSON response. Please retry.");
  }

  return payload;
}

export async function validateInstagramUrl(url) {
  const primaryBackend = getBackendBaseUrl();
  const endpoints = [
    `${primaryBackend}/api/validate`,
    "/api/validate",
    "/backend-api/validate"
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ url }),
      });

      return await parseApiResponse(res, "Invalid Instagram link. Please check the URL.");
    } catch (err) {
      lastError = err;
      // If error was a specific platform message from FastAPI, don't keep trying fallback endpoints
      if (err.message && !err.message.includes("fetch") && !err.message.includes("network") && !err.message.includes("404")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to validate Instagram URL. Please check your connection.");
}

export async function fetchInstagramMedia(url) {
  const primaryBackend = getBackendBaseUrl();
  const endpoints = [
    `${primaryBackend}/api/fetch`,
    "/api/fetch",
    "/backend-api/fetch"
  ];

  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ url }),
      });

      return await parseApiResponse(res, "Unable to load media from this Instagram post. Please verify the post is public.");
    } catch (err) {
      lastError = err;
      // If error is a specific message returned from the backend (e.g. private account), re-throw immediately
      if (
        err.message &&
        !err.message.includes("fetch") &&
        !err.message.includes("network") &&
        !err.message.includes("Failed to connect") &&
        !err.message.includes("404") &&
        !err.message.includes("warming up")
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Unable to connect to media processing server. Please try again.");
}

export function buildDownloadProxyUrl(directUrl, filename, audioUrl = null, quality = null, formatId = null) {
  if (!directUrl) return "";
  const base = `${getBackendBaseUrl()}/api/download`;
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

export function buildDownloadMp3ProxyUrl(sourceUrl, filename, bitrate = 192, inline = false) {
  if (!sourceUrl) return "";
  const base = `${getBackendBaseUrl()}/api/download-mp3`;
  const params = new URLSearchParams({
    url: sourceUrl,
    filename: filename || "fastedl_audio",
    bitrate: String(bitrate || 192)
  });
  if (inline) {
    params.set("inline", "true");
  }
  return `${base}?${params.toString()}`;
}
