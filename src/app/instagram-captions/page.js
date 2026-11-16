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

  return (
    <ContentHub
      sectionKey="instagram-captions"
      sectionTitle="Instagram Captions Library"
      sectionSubtitle="Curated, tested, and high-engagement Instagram caption collections written for creators and brands. Copy individual captions or entire groups with one click."
      badgeText="Instagram Captions"
      badgeIcon="text-editor"
      categories={categories}
    />
  );
}

