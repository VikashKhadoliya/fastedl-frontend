const DEFAULT_BACKEND = process.env.NODE_ENV === "production"
  ? "https://fastedl-backend-production.up.railway.app"
  : "http://127.0.0.1:8000";

const BACKEND_URL = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND).replace(/\/+$/, "");

export async function getCmsPage(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/content/pages/${slug}`, {
      next: { revalidate: 30 }
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    const data = await res.json();
    if (data.success && data.page && data.page.status === "published") {
      return data.page;
    }
  } catch (err) {
    // Graceful fallback to static page if backend is unreachable
  }
  return null;
}
