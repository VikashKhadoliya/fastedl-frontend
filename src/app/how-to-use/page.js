import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowToUseSteps from "@/components/HowToUseSteps";
import OxygenIcon from "@/components/OxygenIcon";
import Link from "next/link";
import { getHowToSchema, getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "How to Download from Instagram - FastEDL (Step-by-Step Tutorial)",
  description:
    "Comprehensive tutorial on saving public Instagram reels, videos, photos, and carousels on iPhone, Android, Windows, and Mac using FastEDL.",
  alternates: {
    canonical: "https://fastedl.app/how-to-use",
  },
  openGraph: {
    title: "How to Use FastEDL - Instagram Downloader Tutorial",
    description: "Step-by-step tutorial on how to use FastEDL on mobile and desktop.",
    url: "https://fastedl.app/how-to-use",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use FastEDL - Instagram Downloader Tutorial",
    description: "Step-by-step tutorial on how to use FastEDL on mobile and desktop.",
    images: ["/og-image.svg"],
  },
};

export default function HowToUsePage() {
  const howToSchema = getHowToSchema({
    name: "How to Download Instagram Media with FastEDL",
    description: "Learn how to save public Instagram reels, videos, photos, and albums in 3 simple steps.",
    steps: [
      {
        title: "Copy Instagram Link",
        description: "Open the Instagram app or website, tap Share on any public post or reel, and choose 'Copy link'.",
        image: "/images/fastedl-creative/02-copy-instagram-link.png",
      },
      {
        title: "Paste into FastEDL",
        description: "Open FastEDL in your browser and paste the link into the URL input box.",
        image: "/images/fastedl-creative/03-paste-the-link.png",
      },
      {
        title: "Download Your Media",
        description: "Click Download to inspect the media preview, then save the full quality MP4 or JPEG file.",
        image: "/images/fastedl-creative/04-download-your-media.png",
      },
    ],
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "How to Use", url: "/how-to-use" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] mb-6">
          <Link href="/" className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">How It Works</span>
        </nav>

        {/* Visual 3-Step Workflow Cards */}
        <div className="mb-12">
          <HowToUseSteps />
        </div>

        {/* Header */}
        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Step-by-Step Guide
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            How to Use FastEDL
          </h1>
          <p className="mt-3 text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Follow our straightforward instructions to save public reels, videos, photos, and carousel albums on any device. 
          </p>
        </div>

        {/* Device Guides */}
        <div className="space-y-10">
          {/* iOS / iPhone Section */}
          <section className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center">
                <OxygenIcon name="phone" size={20} alt="iPhone" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Instructions for iPhone &amp; iPad (iOS Safari)
              </h2>
            </div>
            <ol className="space-y-4 text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] mt-4 pl-4 list-decimal marker:font-bold marker:text-[#635BFF]">
              <li>
                <strong>Copy Post Link:</strong> Open the Instagram app on iOS. Locate the Reel or post you wish to download. Tap the <strong>Share</strong> icon and select <strong>Copy Link</strong>.
              </li>
              <li>
                <strong>Paste in Safari:</strong> Launch Safari and open <strong>FastEDL</strong>. Tap the <strong>Paste Link</strong> button in the search field.
              </li>
              <li>
                <strong>Fetch &amp; Download:</strong> Tap the <strong>Download</strong> button. Once the preview appears, tap <strong>Download Video</strong> or <strong>Download Photo</strong>.
              </li>
              <li>
                <strong>Save to Camera Roll:</strong> When Safari prompts &quot;Do you want to download...?&quot;, tap <strong>Download</strong>. Tap the blue arrow in the Safari address bar, open your file, tap the iOS <strong>Share</strong> button, and tap <strong>Save Video</strong> or <strong>Save Image</strong>.
              </li>
            </ol>
          </section>

          {/* Android Section */}
          <section className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center">
                <OxygenIcon name="smartphone" size={20} alt="Android" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Instructions for Android Devices (Chrome)
              </h2>
            </div>
            <ol className="space-y-4 text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] mt-4 pl-4 list-decimal marker:font-bold marker:text-[#635BFF]">
              <li>
                <strong>Copy the Link:</strong> In the Instagram app, tap the three dots (<span className="font-mono">...</span>) or the Share icon on the desired reel/photo and choose <strong>Copy Link</strong>.
              </li>
              <li>
                <strong>Paste in Browser:</strong> Open Google Chrome or your default Android browser and open <strong>FastEDL</strong>. Paste the URL into the input box.
              </li>
              <li>
                <strong>Save to Gallery:</strong> Tap <strong>Download</strong>. Once media resolves, tap the primary download button. The file is saved directly to your device&apos;s <strong>Downloads</strong> folder and will immediately appear in Google Photos or Gallery.
              </li>
            </ol>
          </section>

          {/* PC & Mac Section */}
          <section className="bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center">
                <OxygenIcon name="devices" size={20} alt="Computer" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Instructions for Windows &amp; Mac (Desktop)
              </h2>
            </div>
            <ol className="space-y-4 text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] mt-4 pl-4 list-decimal marker:font-bold marker:text-[#635BFF]">
              <li>
                <strong>Copy URL from Browser:</strong> Navigate to instagram.com in Chrome, Edge, Safari, or Firefox. Click on the reel or post and copy the URL directly from your browser&apos;s address bar.
              </li>
              <li>
                <strong>Submit to Downloader:</strong> Paste the link into the <strong>FastEDL</strong> input field and click <strong>Download</strong>.
              </li>
              <li>
                <strong>Save File:</strong> Click <strong>Download Video</strong> or <strong>Download Photo</strong>. The browser will instantly save the full-resolution MP4 video or JPEG image to your Downloads directory.
              </li>
            </ol>
          </section>

          {/* Limitations Notice */}
          <section className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-2 font-bold text-base">
              <OxygenIcon name="security" size={18} alt="Notice" />
              <span>Platform Limitations</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              Ensure the post you are attempting to download is from a <strong>public Instagram account</strong>. Posts from private profiles, expired Stories (older than 24 hours), or content requiring an active login session cannot be retrieved in order to uphold platform privacy rules.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center pt-8 border-t border-[#E2E8F0] dark:border-[#334155]">
          <Link
            href="/#downloader"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] rounded-xl shadow-xs shadow-[#635BFF]/25 transition-all"
          >
            Launch FastEDL Downloader
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
