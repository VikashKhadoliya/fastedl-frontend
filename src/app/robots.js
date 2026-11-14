export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/backend-api/"],
    },
    sitemap: "https://fastedl.app/sitemap.xml",
  };
}
