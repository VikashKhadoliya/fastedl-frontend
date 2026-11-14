import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import FeatureShowcase from "@/components/FeatureShowcase";
import FAQSection from "@/components/FAQSection";
import { getWebApplicationSchema, getFAQSchema } from "@/lib/seo";

export const metadata = {
  title: "FastEDL - Instagram Downloader (Reels, Videos, Photos, Stories)",
  description:
    "Fast, free Instagram Downloader. Save Instagram reels, videos, photos, and carousel albums in high-definition MP4 and JPEG directly to any device.",
  alternates: {
    canonical: "https://fastedl.app",
  },
  openGraph: {
    title: "FastEDL - Instagram Downloader",
    description:
      "Save Instagram reels, videos, photos and carousel albums in high definition. Fast, simple, and mobile-friendly.",
    url: "https://fastedl.app",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastEDL - Instagram Downloader",
    description:
      "Save Instagram reels, videos, photos and carousel albums in high definition.",
    images: ["/og-image.svg"],
  },
};

export default function Home() {
  const webAppSchema = getWebApplicationSchema();
  const faqSchema = getFAQSchema([
    {
      q: "How do I download an Instagram video?",
      a: "Copy the share link of any public Instagram video, paste it into the input box above, and click Download. Once the preview loads, click Download Video to save the file.",
    },
    {
      q: "Can I download Instagram Reels?",
      a: "Yes. Paste the link of any public Instagram Reel to preview and save the vertical MP4 video with synchronized audio.",
    },
    {
      q: "Can I download carousel posts?",
      a: "Yes. When you enter a carousel link, FastEDL displays each photo and video slide so you can download them individually or all at once.",
    },
    {
      q: "Where are downloaded files saved?",
      a: "Files are saved to your device's default download folder, camera roll on iPhone, or browser downloads library on PC and Mac.",
    },
    {
      q: "Why is my link not working?",
      a: "Make sure the link is from a public account and copied in full. Content from private profiles cannot be retrieved.",
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section with Downloader Interface */}
        <HeroSection initialTab="video" />

        {/* 3. How It Works Section with 3 Visual Workflow Cards */}
        <HowToUseSteps />

        {/* 4. Main Features Section */}
        <FeaturesSection />

        {/* 5. Media Type Showcase (Video, Photo, Reels, Story, IGTV, Carousel) */}
        <FeatureShowcase />

        {/* 6. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
