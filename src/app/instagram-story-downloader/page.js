import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloaderForm from "@/components/DownloaderForm";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import FAQSection from "@/components/FAQSection";
import OxygenIcon from "@/components/OxygenIcon";
import { getWebApplicationSchema, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Instagram Story Downloader - FastEDL (Anonymous & Fast)",
  description:
    "Download public Instagram stories and story highlights in full HD quality. Fast, safe, and anonymous story saver for mobile and desktop.",
  alternates: {
    canonical: "https://fastedl.app/instagram-story-downloader",
  },
  openGraph: {
    title: "Instagram Story Downloader - FastEDL",
    description: "Download public Instagram stories and story highlights in full HD without login.",
    url: "https://fastedl.app/instagram-story-downloader",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Story Downloader - FastEDL",
    description: "Save public Instagram stories with original audio before they disappear.",
    images: ["/og-image.svg"],
  },
};

export default function InstagramStoryDownloaderPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Story Downloader",
    url: "https://fastedl.app/instagram-story-downloader",
    description: "Download public Instagram stories and highlights in high-definition quality anonymously.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Story Downloader", url: "/instagram-story-downloader" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <OxygenIcon name="go-home" className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Instagram Story Downloader</span>
        </nav>

        {/* Hero Section */}
        <div className="pt-6 pb-2 text-center max-w-4xl mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <OxygenIcon name="chronometer" className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Instagram <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#06B6D4]">Story Downloader</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Save expiring public Instagram stories and permanent highlights before they disappear after 24 hours.
          </p>
        </div>

        {/* Downloader Form */}
        <DownloaderForm initialTab="story" />

        {/* Steps */}
        <HowToUseSteps />

        {/* Features */}
        <FeaturesSection />

        {/* FAQs */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}

