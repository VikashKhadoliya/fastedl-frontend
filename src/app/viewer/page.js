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
  title: "Anonymous Instagram Viewer - FastEDL (View Profiles Privately)",
  description:
    "View public Instagram profiles, biographies, statistics, and full-resolution profile pictures anonymously without logging in or leaving traces.",
  alternates: {
    canonical: "https://fastedl.app/viewer",
  },
  openGraph: {
    title: "Anonymous Instagram Viewer - FastEDL",
    description: "View public Instagram profiles and avatars without logging in.",
    url: "https://fastedl.app/viewer",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anonymous Instagram Viewer - FastEDL",
    description: "Inspect public Instagram profiles and HD avatars anonymously without an account.",
    images: ["/og-image.svg"],
  },
};

export default function ViewerPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Anonymous Instagram Viewer",
    url: "https://fastedl.app/viewer",
    description: "View public Instagram creator profiles and avatars anonymously.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Anonymous Instagram Viewer", url: "/viewer" },
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Anonymous Viewer</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Trust Badge / Category Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="viewer" size={16} alt="Viewer" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Anonymous Instagram Viewer</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">100% Private &amp; Incognito</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Anonymous <span className="text-[#635BFF] dark:text-[#8B5CF6]">Viewer</span>
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            View public Instagram creator profiles, statistics, bios, and full-resolution avatars without logging in or leaving a trace.
          </p>

          {/* Downloader Input Form Component with preselected 'viewer' tab */}
          <div className="mt-6">
            <DownloaderForm initialTab="viewer" />
          </div>
        </section>

        {/* How To Use Steps */}
        <HowToUseSteps />

        {/* SEO Editorial Content */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 text-[#0F172A] dark:text-[#F8FAFC]">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4">
              Browse Public Instagram Content Privately
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              FastEDL Anonymous Viewer lets you view public profiles, subscriber numbers, recent media, and original profile photos without creating an Instagram account or signing in.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B] dark:text-[#94A3B8] mb-4">
              Your identity is completely shielded because queries are routed securely without personal session cookies or tokens.
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
