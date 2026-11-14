import ContentHub from "@/components/ContentHub";

export const metadata = {
  title: "Instagram Hashtags Directory (Copy & Paste Sets) - FastEDL",
  description:
    "Curated Instagram hashtag collections categorized by niche. Copy researched tags for fashion, travel, fitness, photography, business, and food.",
  alternates: {
    canonical: "https://fastedl.app/instagram-hashtags",
  },
};

export default function InstagramHashtagsHubPage() {
  const categories = [
    { slug: "fashion-hashtags", name: "Fashion" },
    { slug: "travel-hashtags", name: "Travel" },
    { slug: "fitness-hashtags", name: "Fitness" },
    { slug: "photography-hashtags", name: "Photography" },
    { slug: "business-hashtags", name: "Business" },
    { slug: "food-hashtags", name: "Food" },
  ];

  const fallbackArticles = [
    {
      slug: "travel-hashtags",
      title: "Best Travel Hashtags for Instagram to Boost Explore Reach",
      excerpt: "A researched breakdown of top-tier travel hashtags categorized by destination, solo travel, luxury retreats, and photography.",
      category: "travel-hashtags",
      author: "FastEDL Editorial Team",
      read_time: "5 min read"
    }
  ];

  return (
    <ContentHub
      sectionKey="instagram-hashtags"
      sectionTitle="Instagram Hashtags Directory"
      sectionSubtitle="Researched, spam-free hashtag collections built to help your Reels and photos get classified by Instagram recommendation algorithms."
      badgeText="Instagram Hashtags"
      badgeIcon="help"
      categories={categories}
      fallbackArticles={fallbackArticles}
    />
  );
}

