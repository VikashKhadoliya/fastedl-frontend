import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

async function proxyRequest(request, { params }) {
  const resolvedParams = await params;
  const pathArray = resolvedParams?.path || [];
  const subPath = Array.isArray(pathArray) ? pathArray.join("/") : pathArray;
  
  const search = request.nextUrl.search || "";
  const targetUrl = `${BACKEND_URL}/api/${subPath}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Forward standard headers, strip host so FastAPI doesn't see mismatched host
    const lowerKey = key.toLowerCase();
    if (!["host", "connection", "transfer-encoding"].includes(lowerKey)) {
      headers.set(key, value);
    }
  });

  const method = request.method;
  const fetchOptions = {
    method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(method)) {
    try {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        fetchOptions.body = await request.formData();
      } else if (contentType.includes("application/json")) {
        fetchOptions.body = await request.text();
      } else {
        fetchOptions.body = await request.arrayBuffer();
      }
    } catch (e) {
      // Body empty or already consumed
    }
  }

  try {
    const backendRes = await fetch(targetUrl, fetchOptions);
    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!["content-encoding", "transfer-encoding"].includes(lowerKey)) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await backendRes.arrayBuffer();
    return new NextResponse(responseBody, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error(`[API Proxy Error] Failed to proxy ${method} ${targetUrl}:`, err);
    return NextResponse.json(
      { detail: `Failed to connect to backend service at ${BACKEND_URL}: ${err.message}` },
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

