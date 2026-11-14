import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Terms of Service - FastEDL",
  description:
    "Review the Terms of Service for FastEDL (Fast Easy Download Link). Learn about acceptable personal use, intellectual property rights, and service limitations.",
  alternates: {
    canonical: "https://fastedl.app/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service - FastEDL",
    description: "Terms and conditions governing the use of FastEDL services.",
    url: "https://fastedl.app/terms-of-service",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - FastEDL",
    description: "Terms and conditions governing the use of FastEDL services.",
    images: ["/og-image.svg"],
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = "November 11, 2026";

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms-of-service" },
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Terms of Service</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Legal Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8 text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Agreement to Terms</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              By accessing or using the FastEDL website (<span className="font-mono text-xs">https://fastedl.app</span>), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Description of Service</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              FastEDL provides a web-based media locator and streaming utility that enables users to locate and download publicly accessible media from Instagram content delivery networks. FastEDL does not host, store, or republish content. All media is fetched transiently and streamed directly to the requesting client.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Acceptable Personal Use &amp; Intellectual Property</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-3">
              Users represent and warrant that they will only download media that they own, have created, or have received express written authorization from the copyright holder to download. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#64748B] dark:text-[#94A3B8]">
              <li>Use FastEDL for commercial exploitation or mass scraping of copyrighted materials without authorization.</li>
              <li>Attempt to circumvent security boundaries, authentication controls, or private account protections.</li>
              <li>Re-distribute or sell downloaded content in violation of intellectual property laws.</li>
              <li>Subject the website to automated denial-of-service attacks or excessive bot requests.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. DMCA Safe Harbor &amp; Copyright Infringement</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              FastEDL respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (17 U.S.C. § 512). If you believe your copyrighted work is accessible through our service without authorization, please consult our dedicated{" "}
              <Link href="/dmca" className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold underline">
                DMCA &amp; Copyright Policy
              </Link>{" "}
              or email our designated copyright agent at <span className="font-mono text-xs text-[#635BFF] dark:text-[#8B5CF6]">dmca@fastedl.app</span>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              The FastEDL service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted, error-free, or continuously compatible with third-party social media platform updates.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Limitation of Liability</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              In no event shall FastEDL, its operators, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Modifications to Terms</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              We reserve the right to revise these Terms of Service at any time. Notice of revisions will be provided by updating the &quot;Last Updated&quot; date at the top of this document. Continued use of FastEDL after revisions constitutes acceptance of the modified terms.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
