import { NextResponse } from "next/server";

const PRODUCTION_BACKEND = "https://fastedl-backend-production.up.railway.app";
const LOCAL_BACKEND = "http://127.0.0.1:8000";

// Determine default backend
const PRIMARY_BACKEND = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || (
  process.env.NODE_ENV === "production" ? PRODUCTION_BACKEND : LOCAL_BACKEND
)).replace(/\/+$/, "");

async function fetchWithFallback(targetSubPath, search, method, headers, bodyData) {
  const isDev = process.env.NODE_ENV !== "production";
  const urlsToTry = [
    `${PRIMARY_BACKEND}/api/${targetSubPath}${search}`
  ];

  // In dev mode, if primary is local and fails, automatically fallback to production backend
  if (isDev && PRIMARY_BACKEND.includes("127.0.0.1") || PRIMARY_BACKEND.includes("localhost")) {
    urlsToTry.push(`${PRODUCTION_BACKEND}/api/${targetSubPath}${search}`);
  }

  let lastError = null;

  for (let i = 0; i < urlsToTry.length; i++) {
    const currentUrl = urlsToTry[i];
    try {
      const fetchOptions = {
        method,
        headers,
        cache: "no-store",
      };

      if (bodyData !== undefined) {
        fetchOptions.body = bodyData;
      }

      // If trying local backend, use a 2.5-second timeout so requests don't hang if local server isn't running
      const isLocal = currentUrl.includes("127.0.0.1") || currentUrl.includes("localhost");
      if (isLocal && urlsToTry.length > 1) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        fetchOptions.signal = controller.signal;
        
        try {
          const res = await fetch(currentUrl, fetchOptions);
          clearTimeout(timeoutId);
          return res;
        } catch (localErr) {
          clearTimeout(timeoutId);
          // Local server offline or timed out, fall through to production fallback
          console.warn(`[FastEDL Proxy] Local backend (${currentUrl}) unavailable, falling back to live production backend...`);
          continue;
        }
      }

      return await fetch(currentUrl, fetchOptions);
    } catch (err) {
      lastError = err;
      console.warn(`[FastEDL Proxy] Failed to fetch from ${currentUrl}:`, err.message);
    }
  }

  throw lastError || new Error("All backend endpoints failed to respond");
}

async function proxyRequest(request, { params }) {
  const resolvedParams = await params;
  const pathArray = resolvedParams?.path || [];
  const subPath = Array.isArray(pathArray) ? pathArray.join("/") : pathArray;
  const search = request.nextUrl.search || "";
  const method = request.method;

  // Build clean headers, strip host
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (!["host", "connection", "transfer-encoding"].includes(lowerKey)) {
      headers.set(key, value);
    }
  });

  // Extract body for non-GET/HEAD methods
  let bodyData = undefined;
  if (!["GET", "HEAD"].includes(method)) {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        bodyData = await request.formData();
      } else if (contentType.includes("application/json") || contentType.includes("application/x-www-form-urlencoded") || contentType.includes("text/")) {
        bodyData = await request.text();
      } else {
        bodyData = await request.arrayBuffer();
      }
    } catch (e) {
      // Body empty or unreadable
    }
  }

  try {
    const backendRes = await fetchWithFallback(subPath, search, method, headers, bodyData);

    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["content-encoding", "transfer-encoding"].includes(lowerKey)) {
        responseHeaders.set(key, value);
      }
    });

    // For media download streams, forward the live ReadableStream directly without buffering in memory
    const isStream = subPath === "download" || subPath === "download-mp3" || responseHeaders.get("content-disposition");
    const responseBody = isStream ? backendRes.body : await backendRes.arrayBuffer();

    return new NextResponse(responseBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`[API Proxy Error] Failed to proxy ${method} /api/${subPath}:`, err);
    return NextResponse.json(
      { detail: `FastEDL service temporarily unreachable. Ensure the backend is active.` },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const OPTIONS = proxyRequest;
