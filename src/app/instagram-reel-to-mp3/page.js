import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReelToMp3Form from "@/components/ReelToMp3Form";
import FeaturesSection from "@/components/FeaturesSection";
import HowToUseSteps from "@/components/HowToUseSteps";
import FAQSection from "@/components/FAQSection";
import OxygenIcon from "@/components/OxygenIcon";
import { getWebApplicationSchema, getBreadcrumbSchema, getFAQSchema } from "@/lib/seo";

export const metadata = {
  title: "Instagram Reel to MP3 Downloader - FastEDL",
  description:
    "Convert supported Instagram Reels to MP3 audio and download audio files easily with FastEDL. High-speed 128, 192, and 320 kbps MP3 conversion with audio preview.",
  alternates: {
    canonical: "https://fastedl.app/instagram-reel-to-mp3",
  },
  openGraph: {
    title: "Instagram Reel to MP3 Downloader - FastEDL",
    description:
      "Convert supported Instagram Reels to MP3 audio and download audio files easily with FastEDL.",
    url: "https://fastedl.app/instagram-reel-to-mp3",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reel to MP3 Downloader - FastEDL",
    description:
      "Convert supported Instagram Reels to MP3 audio and download audio files easily with FastEDL.",
    images: ["/og-image.svg"],
  },
};

export default function InstagramReelToMp3Page() {
  const schema = getWebApplicationSchema({
    name: "FastEDL Instagram Reel to MP3 Downloader",
    url: "https://fastedl.app/instagram-reel-to-mp3",
    description: "Convert supported Instagram Reels to MP3 audio files with high quality 192k/320k sound.",
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Instagram Reel to MP3 Downloader", url: "/instagram-reel-to-mp3" },
  ]);

  const faqSchema = getFAQSchema([
    {
      q: "How do I convert an Instagram Reel to MP3?",
      a: "Copy the link of any public Instagram Reel, paste it into the input box above, and click Convert to MP3. You can listen to the audio preview and select your preferred bitrate (128k, 192k, or 320k) before downloading.",
    },
    {
      q: "What audio bitrates are supported?",
      a: "FastEDL supports 128 kbps (compact file), 192 kbps (recommended high quality), and 320 kbps (studio clarity), encoded via FFmpeg LAME.",
    },
    {
      q: "Can I preview the audio before saving it?",
      a: "Yes. An integrated HTML5 audio player allows you to listen to the extracted audio track directly in your browser before initiating the MP3 download.",
    },
    {
      q: "Can I extract audio from private Instagram accounts?",
      a: "No. FastEDL only processes content from public Instagram accounts in accordance with platform security and privacy policies.",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <OxygenIcon name="go-home" className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">Instagram Reel to MP3</span>
        </nav>

        {/* Hero Section */}
        <div className="pt-6 pb-2 text-center max-w-4xl mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <OxygenIcon name="media-playlist" className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            Instagram <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#06B6D4]">Reel to MP3</span> Downloader
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Extract and convert audio tracks from public Instagram Reels into crystal-clear MP3 files. Select your bitrate and download in seconds.
          </p>
        </div>

        {/* Reel to MP3 Downloader Form */}
        <div className="px-3.5 sm:px-6 py-6">
          <ReelToMp3Form />
        </div>

        {/* Steps */}
        <HowToUseSteps />

        {/* Features */}
        <FeaturesSection />

        {/* FAQs */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
