export default function sitemap() {
  const baseUrl = "https://fastedl.app";
  const currentDate = new Date().toISOString();

  const coreRoutes = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
    // Dedicated Downloader Pages
    { url: `${baseUrl}/instagram-video-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/instagram-reels-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/instagram-reel-to-mp3`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/instagram-photo-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/instagram-carousel-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/instagram-story-downloader`, lastModified: currentDate, changeFrequency: "daily", priority: 0.95 },
    
    // Content Library Hubs (Manually Curated)
    { url: `${baseUrl}/instagram-captions`, lastModified: currentDate, changeFrequency: "daily", priority: 0.92 },
    { url: `${baseUrl}/instagram-hashtags`, lastModified: currentDate, changeFrequency: "daily", priority: 0.92 },
    { url: `${baseUrl}/instagram-bio-ideas`, lastModified: currentDate, changeFrequency: "daily", priority: 0.92 },
    { url: `${baseUrl}/instagram-ideas`, lastModified: currentDate, changeFrequency: "daily", priority: 0.92 },

    // Individual Curated Articles
    { url: `${baseUrl}/instagram-captions/mood-instagram-captions`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/instagram-captions/attitude-captions`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/instagram-captions/travel-captions`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/instagram-hashtags/travel-hashtags`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/instagram-bio-ideas/boys-instagram-bio`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.88 },

    // Guides & Platform Help
    { url: `${baseUrl}/guides`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/how-to-use`, lastModified: currentDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/instagram-downloader-android`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/instagram-downloader-iphone`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/instagram-downloader-pc`, lastModified: currentDate, changeFrequency: "daily", priority: 0.85 },

    // Brand & Legal
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terms-of-service`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dmca`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified: currentDate, changeFrequency: "monthly", priority: 0.5 },
  ];

  return coreRoutes;
}
