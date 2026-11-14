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
  title: "Instagram Story Saver - FastEDL (Anonymous Story Downloader)",
  description:
    "Save public Instagram stories and short video clips before they expire at the 24-hour mark. Fast, anonymous, free, and no account required.",
  alternates: {
    canonical: "https://fastedl.app/story",
  },
  openGraph: {
    title: "Instagram Story Saver - FastEDL",
    description: "Save public Instagram stories before they disappear.",
    url: "https://fastedl.app/story",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Story Saver - FastEDL",
    description: "Archive active public Instagram stories quickly and anonymously.",
    images: ["/og-image.svg"],
  },
};

export default function StoryPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Story Saver",
    url: "https://fastedl.app/story",
    description: "Save active public Instagram stories and highlights anonymously before they expire.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Story Saver", url: "/story" },
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
          <Link href="/" className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] flex items-center gap-1.5 transition-colors">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Story Saver</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Trust Badge / Category Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="story" size={16} alt="Story" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Instagram Story Saver</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">24-Hour Active Stories</span>
          </div>

          {/* Dedicated Creative Visual Artwork */}
          <div className="mb-6 max-w-xs sm:max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] shadow-md bg-white dark:bg-[#1E293B] p-2 sm:p-3">
            <img
              src="/images/fastedl-creative/08-story-downloader.png"
              alt="FastEDL Story Saver"
              className="w-full h-auto object-contain rounded-xl"
              width={369}
              height={170}
              priority="true"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Story <span className="text-[#635BFF] dark:text-[#8B5CF6]">Saver</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Save and archive public Instagram stories, clips, and highlights before they expire after the 24-hour window.
          </p>

          {/* Downloader Input Form Component with preselected 'story' tab */}
          <div className="mt-6">
            <DownloaderForm initialTab="story" />
          </div>
        </section>

        {/* How To Use Steps */}
        <HowToUseSteps />

        {/* SEO Editorial Content */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-[#0F172A] dark:text-[#F8FAFC]">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
              Never Miss an Important Instagram Story
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              Instagram Stories are ephemeral by design and vanish after 24 hours. FastEDL allows creators, journalists, and fans to preserve memorable public stories in full quality.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              <em>Note:</em> Stories must be from public Instagram profiles and posted within the active 24-hour window. FastEDL respects Instagram privacy policies and does not bypass private account barriers.
            </p>
          </div>
        </section>

        {/* Explore All Formats */}
        <FeaturesSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
