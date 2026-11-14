/**
 * SEO & Schema.org JSON-LD structured data utilities for FastEDL
 */

export const SITE_CONFIG = {
  name: "FastEDL",
  fullName: "Fast Easy Download Link",
  url: "https://fastedl.app",
  ogImage: "https://fastedl.app/og-image.svg",
  supportEmail: "support@fastedl.app",
  dmcaEmail: "dmca@fastedl.app",
  privacyEmail: "privacy@fastedl.app",
  locale: "en_US",
  defaultDescription:
    "FastEDL is a fast, free online Instagram downloader. Save Instagram reels, videos, photos, and carousels in high quality MP4 and JPEG.",
};

/**
 * Global WebSite schema for search engines
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    alternateName: [SITE_CONFIG.fullName, "Fast EDL", "FastEDL App"],
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.defaultDescription,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/#downloader`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * WebApplication schema for tool and landing pages
 */
export function getWebApplicationSchema({
  name = "FastEDL - Instagram Downloader",
  url = SITE_CONFIG.url,
  description = SITE_CONFIG.defaultDescription,
  applicationCategory = "MultimediaApplication",
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    alternateName: SITE_CONFIG.fullName,
    url,
    applicationCategory,
    operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
    browserRequirements: "Requires modern web browser with HTML5 and JavaScript support",
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "High Definition 1080p MP4 Video Downloads",
      "Instagram Reels Saver with Synchronized Audio",
      "Full Resolution JPEG Photo Extraction",
      "Carousel Album Multi-Item Downloads",
      "Zero Registration or Account Login Required",
      "Direct Browser Download without App Installation",
    ],
  };
}

/**
 * BreadcrumbList schema
 */
export function getBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

/**
 * FAQPage schema
 */
export function getFAQSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * HowTo schema for step-by-step guides
 */
export function getHowToSchema({
  name,
  description,
  steps = [],
  totalTime = "PT1M",
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    supply: [
      {
        "@type": "HowToSupply",
        name: "Instagram Media URL",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Web Browser",
      },
    ],
    step: steps.map((s, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: s.title,
      text: s.description,
      url: s.url || `${SITE_CONFIG.url}/#downloader`,
      ...(s.image && {
        image: s.image.startsWith("http") ? s.image : `${SITE_CONFIG.url}${s.image}`,
      }),
    })),
  };
}

