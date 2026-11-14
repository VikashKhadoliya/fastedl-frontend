import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloaderForm from "@/components/DownloaderForm";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import OxygenIcon from "@/components/OxygenIcon";
import { getWebApplicationSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

export const metadata = {
  title: "Instagram Downloader for PC, Mac & Laptop - FastEDL (Windows & macOS)",
  description:
    "Download Instagram videos, reels, photos, and carousel galleries directly on Windows 11/10, macOS, and Linux. No software or browser extensions needed.",
  alternates: {
    canonical: "https://fastedl.app/instagram-downloader-pc",
  },
  openGraph: {
    title: "Instagram Downloader for PC, Mac & Laptop - FastEDL",
    description: "Save Instagram media in high-definition MP4 directly to your PC or Mac downloads folder.",
    url: "https://fastedl.app/instagram-downloader-pc",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Downloader for PC, Mac & Laptop - FastEDL",
    description: "Download high definition Instagram media to your computer without installing software.",
    images: ["/og-image.svg"],
  },
};

export default function PCDownloaderPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Downloader for PC",
    url: "https://fastedl.app/instagram-downloader-pc",
    description: "Web-based Instagram downloader for Windows, macOS, and Linux desktop browsers.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Downloader for PC", url: "/instagram-downloader-pc" },
  ]);

  const pcFaqs = [
    {
      q: "Do I need to install desktop software or Chrome extensions?",
      a: "No software, installer (.exe / .dmg), or browser extension is required. FastEDL runs natively inside any modern desktop browser including Google Chrome, Microsoft Edge, Safari, Firefox, Brave, and Opera.",
    },
    {
      q: "Where does my browser save downloaded files on PC and Mac?",
      a: "By default, files are saved in your user 'Downloads' folder (C:\\Users\\<Username>\\Downloads on Windows, or /Users/<Username>/Downloads on macOS). You can configure your browser settings to ask where to save each file before downloading.",
    },
    {
      q: "Can I download multiple slides from a carousel post at once?",
      a: "Yes. When you paste a carousel post link, FastEDL loads every slide thumbnail with individual download buttons and a 'Download All' batch option.",
    },
  ];

  const faqSchema = getFAQSchema(pcFaqs);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Instagram Downloader for PC</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="devices" size={14} alt="PC" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Desktop &amp; Laptop</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">Windows, macOS &amp; Linux</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Downloader for <span className="text-[#635BFF] dark:text-[#8B5CF6]">PC &amp; Mac</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Download full 1080p Instagram videos, reels, photos, and albums directly to your computer with no software installation.
          </p>

          {/* Downloader Form */}
          <div className="mt-8">
            <DownloaderForm initialTab="video" />
          </div>
        </section>

        {/* 3 Step Visual Workflow */}
        <HowToUseSteps />

        {/* Desktop Tutorial Content */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center gap-2">
              <OxygenIcon name="devices" size={24} alt="Desktop" />
              How to Save Instagram Media on PC &amp; Mac Browsers
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                FastEDL operates natively across all major desktop web browsers including Chrome, Edge, Safari, Firefox, Opera, and Brave.
              </p>

              <ol className="list-decimal pl-5 space-y-3 mt-3 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                <li>
                  <span className="font-bold">Copy Link from Address Bar:</span> Open instagram.com on your desktop, view any post or reel, and copy its link from the browser URL address bar.
                </li>
                <li>
                  <span className="font-bold">Paste into FastEDL:</span> Paste the link into the FastEDL input bar and click <span className="text-[#635BFF] font-bold">Download</span>.
                </li>
                <li>
                  <span className="font-bold">Save Directly:</span> Click the download button on the preview card. The high-definition MP4 or JPEG file will be saved directly into your PC or Mac Downloads folder.
                </li>
              </ol>

              <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-start gap-3">
                <OxygenIcon name="security" size={20} alt="Security" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <strong className="text-[#0F172A] dark:text-[#F8FAFC]">Clean Desktop Experience:</strong> FastEDL does not require third-party browser extensions or intrusive executables. Everything runs safely within your standard web browser.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <FeaturesSection />

        {/* PC FAQ */}
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              PC &amp; Mac Downloader FAQs
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Common questions about saving Instagram content on desktop computers.
            </p>
          </div>

          <div className="space-y-3">
            {pcFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-5 shadow-sm"
              >
                <h3 className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
