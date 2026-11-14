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
  title: "Instagram Carousel Downloader - FastEDL (Multi-Slide Album Saver)",
  description:
    "Download multiple photos and videos from Instagram carousel albums. Preview individual slides or save the entire multi-post gallery in original quality.",
  alternates: {
    canonical: "https://fastedl.app/carousel",
  },
  openGraph: {
    title: "Instagram Carousel Downloader - FastEDL",
    description: "Download multiple photos and videos from Instagram carousel albums.",
    url: "https://fastedl.app/carousel",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Carousel Downloader - FastEDL",
    description: "Download multi-slide Instagram albums with selective or batch download.",
    images: ["/og-image.svg"],
  },
};

export default function CarouselPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Carousel Downloader",
    url: "https://fastedl.app/carousel",
    description: "Download multiple photos and videos from Instagram carousel albums.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Carousel Downloader", url: "/carousel" },
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Carousel Downloader</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Trust Badge / Category Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="carousel" size={16} alt="Carousel" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Instagram Carousel Tool</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">Multi-Slide Album Extraction</span>
          </div>

          {/* Dedicated Creative Visual Artwork */}
          <div className="mb-6 max-w-xs sm:max-w-sm mx-auto rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] shadow-md bg-white dark:bg-[#1E293B] p-2 sm:p-3">
            <img
              src="/images/fastedl-creative/10-carousel-downloader.png"
              alt="FastEDL Carousel Downloader"
              className="w-full h-auto object-contain rounded-xl"
              width={355}
              height={170}
              priority="true"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Carousel <span className="text-[#635BFF] dark:text-[#8B5CF6]">Downloader</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Extract and download every photo and video slide from multi-item Instagram carousel albums with a single click.
          </p>

          {/* Downloader Input Form Component with preselected 'carousel' tab */}
          <div className="mt-6">
            <DownloaderForm initialTab="carousel" />
          </div>
        </section>

        {/* How To Use Steps */}
        <HowToUseSteps />

        {/* SEO Editorial Content */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-[#0F172A] dark:text-[#F8FAFC]">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
              Download Full Instagram Carousel Galleries
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              Carousel posts can contain up to 10 or 20 individual photos and videos in a swipeable sequence. Most basic downloaders only grab the first thumbnail.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              FastEDL parses the entire multi-item graph structure, giving you an interactive slide preview where you can pick individual slides or click &quot;Download All Slides&quot; to fetch the entire collection at once.
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
