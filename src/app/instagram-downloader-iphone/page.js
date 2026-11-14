import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloaderForm from "@/components/DownloaderForm";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import OxygenIcon from "@/components/OxygenIcon";
import { getWebApplicationSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

export const metadata = {
  title: "Instagram Downloader for iPhone & iPad - FastEDL (iOS Safari)",
  description:
    "Save Instagram videos, reels, and photos directly to your iPhone Camera Roll using Safari. No App Store app or jailbreak required. Works on iOS 13+.",
  alternates: {
    canonical: "https://fastedl.app/instagram-downloader-iphone",
  },
  openGraph: {
    title: "Instagram Downloader for iPhone & iPad - FastEDL",
    description: "Save Instagram reels, videos, and photos directly to your iPhone Camera Roll using Safari.",
    url: "https://fastedl.app/instagram-downloader-iphone",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Downloader for iPhone & iPad - FastEDL",
    description: "Save Instagram media to your iPhone Photos app without installing third-party apps.",
    images: ["/og-image.svg"],
  },
};

export default function IPhoneDownloaderPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Downloader for iPhone",
    url: "https://fastedl.app/instagram-downloader-iphone",
    description: "Web-based Instagram downloader optimized for iOS Safari and iPhone Camera Roll saving.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Downloader for iPhone", url: "/instagram-downloader-iphone" },
  ]);

  const iphoneFaqs = [
    {
      q: "How do I save downloaded videos to my iPhone Camera Roll?",
      a: "When Safari finishes downloading your MP4 file, tap the Download Manager icon (the down-arrow in the Safari address bar), tap the downloaded video, tap the iOS Share icon at the bottom left, and select 'Save Video'. It will immediately appear in your Photos app.",
    },
    {
      q: "Do I need to install any app from the App Store?",
      a: "No app, shortcut, or jailbreak is required. Modern iOS Safari has native file downloading built directly into the browser.",
    },
    {
      q: "Which iOS versions are supported?",
      a: "FastEDL works on all iPhones and iPads running iOS 13 through iOS 18+ (iPhone 8 through iPhone 16 Pro Max and newer).",
    },
  ];

  const faqSchema = getFAQSchema(iphoneFaqs);

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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Instagram Downloader for iPhone</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="phone" size={14} alt="iPhone" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">iOS &amp; iPadOS Guide</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">Native Safari Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Downloader for <span className="text-[#635BFF] dark:text-[#8B5CF6]">iPhone</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Save Instagram Reels, high-definition videos, and photos straight to your iPhone Camera Roll without third-party apps or shortcuts.
          </p>

          {/* Downloader Form */}
          <div className="mt-8">
            <DownloaderForm initialTab="reels" />
          </div>
        </section>

        {/* 3 Step Visual Workflow */}
        <HowToUseSteps />

        {/* iPhone Camera Roll Step-by-Step Tutorial */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center gap-2">
              <OxygenIcon name="download" size={24} alt="Download" />
              How to Save Instagram Media to iPhone Camera Roll
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Apple&apos;s iOS ecosystem provides a secure built-in Download Manager within Safari. Follow these quick steps to move files from Safari into your Photos app:
              </p>

              <ol className="list-decimal pl-5 space-y-3 mt-3 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                <li>
                  <span className="font-bold">Copy Link in Instagram:</span> Tap the Share button on the Instagram reel or post and choose <span className="underline">Copy link</span>.
                </li>
                <li>
                  <span className="font-bold">Paste in Safari:</span> Open FastEDL in Safari, paste your link, and tap <span className="text-[#635BFF] font-bold">Download</span>.
                </li>
                <li>
                  <span className="font-bold">Confirm Download:</span> When Safari asks &ldquo;Do you want to download this file?&rdquo;, tap <span className="text-[#635BFF] font-bold">Download</span>.
                </li>
                <li>
                  <span className="font-bold">Save to Camera Roll:</span> Tap the blue download circle icon in the Safari address bar, tap the file, tap the <span className="underline">Share button</span> (square with arrow pointing up), and tap <span className="text-[#635BFF] font-bold">Save Video</span> or <span className="text-[#635BFF] font-bold">Save Image</span>.
                </li>
              </ol>

              <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-start gap-3">
                <OxygenIcon name="security" size={20} alt="Security" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <strong className="text-[#0F172A] dark:text-[#F8FAFC]">iOS Sandbox Security:</strong> FastEDL operates 100% within the browser. We never prompt you to install custom configuration profiles, test flight apps, or unverified certificates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <FeaturesSection />

        {/* iPhone FAQ */}
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              iPhone Downloader FAQs
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Common questions about saving Instagram content on iOS and iPadOS.
            </p>
          </div>

          <div className="space-y-3">
            {iphoneFaqs.map((faq, idx) => (
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
