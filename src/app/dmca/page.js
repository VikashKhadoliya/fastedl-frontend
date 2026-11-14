import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "DMCA Copyright Policy & Takedown Procedure - FastEDL",
  description:
    "Review FastEDL's DMCA copyright policy. Submit copyright notices, understand our safe harbor compliance, and contact our designated copyright agent.",
  alternates: {
    canonical: "https://fastedl.app/dmca",
  },
  openGraph: {
    title: "DMCA Copyright Policy - FastEDL",
    description: "DMCA compliance, copyright takedown instructions, and designated agent details.",
    url: "https://fastedl.app/dmca",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DMCA Copyright Policy - FastEDL",
    description: "DMCA compliance, copyright takedown instructions, and designated agent details.",
    images: ["/og-image.svg"],
  },
};

export default function DMCAPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "DMCA Copyright Policy", url: "/dmca" },
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">DMCA Policy</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Intellectual Property Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            DMCA &amp; Copyright Policy
          </h1>
          <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Notice and Takedown Procedure Under 17 U.S.C. § 512
          </p>
        </div>

        <div className="space-y-8 text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed text-sm sm:text-base">
          <div>
            <h2 className="text-xl font-bold mb-3">1. DMCA Statement</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              FastEDL complies with the provisions of the Digital Millennium Copyright Act (17 U.S.C. § 512) and international intellectual property standards. As an online service provider, FastEDL does not host, store, or index content on its servers. Rather, it operates as a technical tool allowing users to access publicly hosted media streams directly from third-party social media content delivery networks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <OxygenIcon name="security" size={24} />
              <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">
                Designated Copyright Agent
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
              All formal copyright infringement notices and counter-notifications should be addressed to our designated agent:
            </p>
            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] space-y-1 text-xs">
              <p><strong>Entity:</strong> FastEDL Legal &amp; Copyright Compliance</p>
              <p><strong>Email:</strong> <a href="mailto:dmca@fastedl.app" className="text-[#635BFF] dark:text-[#8B5CF6] font-mono underline">dmca@fastedl.app</a></p>
              <p><strong>Response Turnaround:</strong> Typically processed within 24 to 48 business hours</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Filing a Formal Takedown Notice</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mb-3">
              If you are a copyright owner or an authorized representative and believe your work is accessible through FastEDL without authorization, you must submit a written notification containing:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
              <li>A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright interest.</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or a representative list of such works.</li>
              <li>Identification of the material that is claimed to be infringing and sufficient URL information to allow FastEDL to locate and block the query path.</li>
              <li>Information reasonably sufficient to permit FastEDL to contact you, such as an address, telephone number, and email address.</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Our Action Upon Receipt</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              Upon receiving a bona fide notification complying with 17 U.S.C. § 512(c)(3), FastEDL will promptly investigate and, where appropriate, implement domain or URL-level blocks preventing our system from querying or fetching the identified URL.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Counter-Notification Procedure</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              If you believe that a URL was blocked by mistake or misidentification, you may submit a counter-notice in writing to our designated agent pursuant to 17 U.S.C. § 512(g)(3).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Repeat Infringer Policy</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8]">
              In accordance with the DMCA and other applicable laws, FastEDL maintains a policy of terminating or blocking access for repeat infringers in appropriate circumstances.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

