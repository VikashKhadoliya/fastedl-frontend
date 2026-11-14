import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Disclaimer & Fair Use Notice - FastEDL",
  description:
    "Legal disclaimer regarding non-affiliation with Instagram / Meta Platforms, Inc. and copyright fair use guidelines for FastEDL.",
  alternates: {
    canonical: "https://fastedl.app/disclaimer",
  },
  openGraph: {
    title: "Disclaimer & Fair Use Notice - FastEDL",
    description: "Legal disclaimer regarding non-affiliation with Instagram / Meta Platforms, Inc.",
    url: "https://fastedl.app/disclaimer",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer & Fair Use Notice - FastEDL",
    description: "Legal disclaimer regarding non-affiliation with Instagram / Meta Platforms, Inc.",
    images: ["/og-image.svg"],
  },
};

export default function DisclaimerPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Disclaimer", url: "/disclaimer" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] mb-6">
          <Link href="/" className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={12} className="opacity-40" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Disclaimer</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Legal Notices &amp; Fair Use
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Legal Disclaimer
          </h1>
          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Please review this legal disclosure carefully before using our website and media services.
          </p>
        </div>

        <div className="space-y-8 text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed text-sm sm:text-base">
          {/* Trademark Callout */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <div className="flex items-center gap-2.5 font-bold text-lg mb-2">
              <OxygenIcon name="security" size={20} />
              <span>Trademark &amp; Non-Affiliation Notice</span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <strong>FastEDL</strong> is an independent web application and is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., Facebook, or any of their parent companies or subsidiaries</strong>. The name &quot;Instagram&quot; as well as related names, marks, emblems, and images are registered trademarks of their respective owners.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              1. Non-Hosting &amp; Transient Conduit Notice
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              FastEDL does not host, index, or maintain a database of copyrighted Instagram photos, reels, or videos. All files downloaded through this site are fetched directly and transiently from public servers and content delivery networks (CDNs) of Instagram/Meta upon specific user request. We operate solely as a technical conduit.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              2. Intellectual Property &amp; User Responsibility
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              All content made accessible through Instagram belongs exclusively to the original content creators, photographers, artists, and rights holders. FastEDL does not claim copyright or ownership over any downloaded files. Users assume full legal responsibility for how downloaded materials are used.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              3. Copyright Inquiries
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              If you represent a copyright holder and wish to block access to specific content, please submit a notice to our designated agent at <a href="mailto:dmca@fastedl.app" className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold underline">dmca@fastedl.app</a>. We process all valid requests promptly.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
