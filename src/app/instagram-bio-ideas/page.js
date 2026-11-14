import ContentHub from "@/components/ContentHub";

export const metadata = {
  title: "Instagram Bio Ideas (Copy & Paste) - FastEDL",
  description:
    "Curated collection of aesthetic, stylish, VIP, attitude, and professional Instagram bio ideas for boys, girls, creators, and brands.",
  alternates: {
    canonical: "https://fastedl.app/instagram-bio-ideas",
  },
};

export default function InstagramBiosHubPage() {
  const categories = [
    { slug: "boys-instagram-bios", name: "Boys" },
    { slug: "girls-instagram-bios", name: "Girls" },
    { slug: "attitude-bios", name: "Attitude" },
    { slug: "business-bios", name: "Business" },
    { slug: "creator-bios", name: "Creators" },
  ];

  const fallbackArticles = [
    {
      slug: "boys-instagram-bio",
      title: "120+ Cool & Aesthetic Instagram Bios for Boys (VIP & Stylish)",
      excerpt: "Upgrade your Instagram profile with 120+ unique bios for boys. From minimalist and confident to VIP attitude and classy quotes.",
      category: "boys-instagram-bios",
      author: "FastEDL Editorial Team",
      read_time: "5 min read"
    }
  ];

  return (
    <ContentHub
      sectionKey="instagram-bio-ideas"
      sectionTitle="Instagram Bio Ideas"
      sectionSubtitle="High-converting, aesthetic, and stylish Instagram bio templates. Copy full bios or customize lines to make your profile stand out instantly."
      badgeText="Instagram Bios"
      badgeIcon="favorite"
      categories={categories}
      fallbackArticles={fallbackArticles}
    />
  );
}

