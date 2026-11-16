import ContentHub from "@/components/ContentHub";

export const metadata = {
  title: "Instagram Post, Reel & Story Ideas - FastEDL",
  description:
    "Never run out of content ideas. Tested Instagram Reel concepts, carousel blueprints, and story prompts to increase engagement and saves.",
  alternates: {
    canonical: "https://fastedl.app/instagram-ideas",
  },
};

export default function InstagramIdeasHubPage() {
  const categories = [
    { slug: "instagram-reel-ideas", name: "Reel Ideas" },
    { slug: "instagram-post-ideas", name: "Post & Carousel Ideas" },
    { slug: "instagram-story-ideas", name: "Story Ideas" },
  ];

  return (
    <ContentHub
      sectionKey="instagram-ideas"
      sectionTitle="Instagram Content Ideas"
      sectionSubtitle="Actionable creative blueprints, viral Reel hooks, and carousel frameworks designed to boost organic watch time and community engagement."
      badgeText="Content Ideas"
      badgeIcon="view-media-album-cover"
      categories={categories}
    />
  );
}

