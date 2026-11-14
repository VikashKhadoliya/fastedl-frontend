import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DownloaderForm from "@/components/DownloaderForm";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import OxygenIcon from "@/components/OxygenIcon";
import { getWebApplicationSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

export const metadata = {
  title: "Instagram Downloader for Android - FastEDL (No APK Required)",
  description:
    "Download Instagram reels, videos, and photos directly on Android smartphones and tablets. Works via Chrome, Samsung Internet, and Brave without installing APKs.",
  alternates: {
    canonical: "https://fastedl.app/instagram-downloader-android",
  },
  openGraph: {
    title: "Instagram Downloader for Android - FastEDL",
    description: "Save Instagram videos, reels, and photos on any Android phone directly in your browser.",
    url: "https://fastedl.app/instagram-downloader-android",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Downloader for Android - FastEDL",
    description: "Save Instagram reels and videos to your Android gallery with no app installation.",
    images: ["/og-image.svg"],
  },
};

export default function AndroidDownloaderPage() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Downloader for Android",
    url: "https://fastedl.app/instagram-downloader-android",
    description: "Web-based Instagram downloader optimized for Android Chrome and mobile browsers without APKs.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Downloader for Android", url: "/instagram-downloader-android" },
  ]);

  const androidFaqs = [
    {
      q: "Do I need to install an APK file on my Android phone?",
      a: "No. FastEDL is 100% web-based and runs directly inside Google Chrome, Samsung Internet, Firefox, Opera, or Brave. You do not need to download risky third-party APKs or grant system permissions.",
    },
    {
      q: "Where are downloaded Instagram videos stored on Android?",
      a: "Downloaded files are automatically saved to your internal storage 'Download' folder (/storage/emulated/0/Download). You can immediately view them in Google Photos, Samsung Gallery, or your device's Files app.",
    },
    {
      q: "Does FastEDL work on Samsung, Google Pixel, Xiaomi, and OnePlus?",
      a: "Yes. FastEDL is universally compatible with all Android devices running Android 7.0 and newer through any modern web browser.",
    },
  ];

  const faqSchema = getFAQSchema(androidFaqs);

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
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Instagram Downloader for Android</span>
        </nav>

        {/* Hero Section */}
        <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold mb-6 shadow-xs">
            <OxygenIcon name="smartphone" size={14} alt="Android" />
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Android Device Guide</span>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#635BFF] dark:text-[#8B5CF6] font-semibold">Direct Browser Download</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
            Instagram Downloader for <span className="text-[#635BFF] dark:text-[#8B5CF6]">Android</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Save Instagram Reels, videos, photos, and carousel galleries directly to your Android device with zero app downloads or account logins.
          </p>

          {/* Downloader Form */}
          <div className="mt-8">
            <DownloaderForm initialTab="reels" />
          </div>
        </section>

        {/* How It Works on Android */}
        <HowToUseSteps />

        {/* Android Specific Editorial Guide */}
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center gap-2">
              <OxygenIcon name="folder" size={24} alt="Folder" />
              How to Save Instagram Media on Android Phones
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                Unlike unofficial Android downloader apps that frequently request invasive phone permissions, access to your contacts, or Instagram login credentials, FastEDL operates strictly inside your mobile browser.
              </p>

              <ol className="list-decimal pl-5 space-y-2.5 mt-3 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                <li>
                  <span className="font-bold">Copy the Link:</span> In the Instagram Android app, tap the paper airplane <span className="text-[#635BFF]">Share</span> icon on the reel or post, then select <span className="underline">Copy link</span>.
                </li>
                <li>
                  <span className="font-bold">Paste into Chrome:</span> Switch to your mobile browser, navigate to FastEDL, and paste the URL into the input field above.
                </li>
                <li>
                  <span className="font-bold">Download Directly:</span> Tap <span className="text-[#635BFF] font-bold">Download</span>, view the media preview, and tap the save button. Your browser will immediately download the high-definition MP4 or JPEG file.
                </li>
              </ol>

              <div className="mt-6 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-start gap-3">
                <OxygenIcon name="security" size={20} alt="Security" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  <strong className="text-[#0F172A] dark:text-[#F8FAFC]">Zero Security Risks:</strong> By using our web interface instead of installing unknown .APK files from third-party sites, your Android device remains 100% protected against malware and background tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <FeaturesSection />

        {/* Android FAQ */}
        <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Android Downloader FAQs
            </h2>
            <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Frequently asked questions about downloading Instagram media on Android devices.
            </p>
          </div>

          <div className="space-y-3">
            {androidFaqs.map((faq, idx) => (
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
