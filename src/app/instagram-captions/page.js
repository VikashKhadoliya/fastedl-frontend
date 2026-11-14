import ContentHub from "@/components/ContentHub";

export const metadata = {
  title: "Instagram Captions Library (Copy & Paste) - FastEDL",
  description:
    "Explore hundreds of curated Instagram captions across mood, attitude, travel, self-love, and aesthetic categories. Copy with one click.",
  alternates: {
    canonical: "https://fastedl.app/instagram-captions",
  },
};

export default function InstagramCaptionsHubPage() {
  const categories = [
    { slug: "mood-captions", name: "Mood" },
    { slug: "attitude-captions", name: "Attitude" },
    { slug: "love-captions", name: "Love" },
    { slug: "funny-captions", name: "Funny" },
    { slug: "self-love-captions", name: "Self-Love" },
    { slug: "travel-captions", name: "Travel" },
    { slug: "birthday-captions", name: "Birthday" },
    { slug: "friendship-captions", name: "Friendship" },
    { slug: "aesthetic-captions", name: "Aesthetic" },
    { slug: "sad-captions", name: "Sad" },
    { slug: "mirror-selfie-captions", name: "Mirror Selfie" },
  ];

  const fallbackArticles = [
    {
      slug: "mood-instagram-captions",
      title: "120+ Best Mood Captions for Instagram in 2026 (Copy & Paste)",
      excerpt: "120+ hand-picked Instagram captions for every vibe—from chill and low-key to energetic, grateful, and introspective.",
      category: "mood-captions",
      author: "FastEDL Editorial Team",
      read_time: "6 min read"
    },
    {
      slug: "attitude-captions",
      title: "80+ Savage Attitude Captions for Instagram (Boys & Girls)",
      excerpt: "Explore 80+ savage, bold, and high-status attitude captions with instant copy buttons.",
      category: "attitude-captions",
      author: "FastEDL Editorial Team",
      read_time: "5 min read"
    },
    {
      slug: "travel-captions",
      title: "75+ Wanderlust Travel Captions for Instagram Adventures",
      excerpt: "Capture the thrill of the open road, mountain vistas, and coastal escapes with short, poetic captions.",
      category: "travel-captions",
      author: "FastEDL Editorial Team",
      read_time: "5 min read"
    }
  ];

  return (
    <ContentHub
      sectionKey="instagram-captions"
      sectionTitle="Instagram Captions Library"
      sectionSubtitle="Curated, tested, and high-engagement Instagram caption collections written for creators and brands. Copy individual captions or entire groups with one click."
      badgeText="Instagram Captions"
      badgeIcon="text-editor"
      categories={categories}
      fallbackArticles={fallbackArticles}
    />
  );
}

