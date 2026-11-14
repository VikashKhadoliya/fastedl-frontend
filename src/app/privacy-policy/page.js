import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Privacy Policy - FastEDL (AdSense & GDPR Compliant)",
  description:
    "FastEDL Privacy Policy. We do not store passwords, session tokens, or permanent user media. Read our disclosures on cookies, Google AdSense, GDPR, and CCPA.",
  alternates: {
    canonical: "https://fastedl.app/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - FastEDL",
    description: "Read our comprehensive privacy policy, cookie policy, and AdSense disclosures.",
    url: "https://fastedl.app/privacy-policy",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - FastEDL",
    description: "Read our comprehensive privacy policy, cookie policy, and AdSense disclosures.",
    images: ["/og-image.svg"],
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 11, 2026";

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Privacy Policy</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Legal &amp; Privacy Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Effective Date: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8 text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              <strong>FastEDL</strong> (Fast Easy Download Link, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the online media utility at <span className="font-mono text-xs">https://fastedl.app</span>. We believe web tools should respect consumer privacy and operate with minimal data collection. This Privacy Policy outlines what information is collected, how it is used, and how advertising partners operate on our site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Core Privacy Guarantees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                <OxygenIcon name="security" size={20} className="mb-2" />
                <h3 className="font-bold text-xs">No Password Collection</h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">We never request or store Instagram passwords or session tokens.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                <OxygenIcon name="security" size={20} className="mb-2" />
                <h3 className="font-bold text-xs">No Media Archiving</h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">Files are streamed directly and transiently without permanent storage.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155]">
                <OxygenIcon name="security" size={20} className="mb-2" />
                <h3 className="font-bold text-xs">Zero User Profiling</h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">We do not link your identity with social media accounts or sell personal data.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Cookies and Web Beacons (Google AdSense Compliance)</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-3">
              Like many commercial websites, FastEDL uses standard internet cookies to maintain user preferences (such as your chosen Dark/Light theme and preferred language).
            </p>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-3">
              <strong>Third-Party Vendors &amp; Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to FastEDL or other websites. Google&apos;s use of advertising cookies (such as the DoubleClick cookie) enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
            </p>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              <strong>Opting Out of Personalized Advertising:</strong> Users may opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold underline">
                Google Ads Settings
              </a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold underline">
                aboutads.info
              </a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. California Consumer Privacy Act (CCPA)</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-2">
              Under the CCPA, California residents possess the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Request disclosure of the categories and specific pieces of personal data collected.</li>
              <li>Request deletion of any personal data collected.</li>
              <li><strong>Do Not Sell My Personal Information:</strong> FastEDL does not sell personal information to third parties for monetary consideration.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. General Data Protection Regulation (GDPR)</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-2">
              For users located within the European Economic Area (EEA), you have data protection rights including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#64748B] dark:text-[#94A3B8]">
              <li>The right to access, update, or delete information we maintain.</li>
              <li>The right of rectification if information is inaccurate.</li>
              <li>The right to object to processing and request restriction of data processing.</li>
              <li>The right to withdraw consent at any time where processing was based on consent.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Log Files &amp; Technical Processing</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              FastEDL follows standard server logging procedures. These logs record standard HTTP request data (IP addresses, browser type, referring/exit pages, date/time stamps). This data is used solely to administer the site, prevent malicious abuse (such as automated denial of service attacks), and ensure technical stability.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Privacy Inquiries &amp; Contact</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              If you have any questions, comments, or data privacy requests, please contact our designated privacy officer at{" "}
              <a href="mailto:privacy@fastedl.app" className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold underline">
                privacy@fastedl.app
              </a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
