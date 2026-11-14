import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "FastEDL Help Center & Complete Guide (Instagram Media Access)",
  description:
    "Comprehensive guides and troubleshooting for downloading Instagram videos, reels, photos, and carousels. Learn link copying, storage locations, and security policies.",
  alternates: {
    canonical: "https://fastedl.app/guide",
  },
  openGraph: {
    title: "FastEDL Help Center & Complete Guide",
    description: "Learn how to save, preview, and archive authorized Instagram media safely.",
    url: "https://fastedl.app/guide",
    siteName: "FastEDL",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastEDL Help Center & Complete Guide",
    description: "Learn how to save and troubleshoot Instagram media downloads.",
    images: ["/og-image.svg"],
  },
};

export default function GuideHubPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides & Help Center", url: "/guide" },
  ]);

  const guides = [
    {
      id: "copy-links",
      icon: "copy",
      title: "How to Copy Instagram Links",
      summary: "Step-by-step instructions for copying clean share URLs on iOS, Android, and Desktop without tracking parameters.",
      content: [
        "In the Instagram mobile app, locate the video, reel, or photo you wish to save.",
        "Tap the paper airplane Share icon (or the three dots '...' on older app versions).",
        "Select 'Copy link' from the share sheet menu. A confirmation 'Link copied to clipboard' will appear.",
        "On desktop web browsers, you can either click the three dots '...' at the top-right of the post and click 'Copy link', or copy the URL directly from the address bar (e.g. instagram.com/p/SHORTCODE/ or instagram.com/reel/SHORTCODE/).",
      ],
    },
    {
      id: "authorized-videos",
      icon: "video",
      title: "Downloading Authorized Instagram Videos",
      summary: "Guidelines on saving public feed videos in original MP4 resolution for personal backup or offline review.",
      content: [
        "Paste the copied video link into the FastEDL input bar and click 'Download'.",
        "Our engine validates the URL and queries public media streams to locate the original CDN video file.",
        "Once the video card renders, verify the video duration and preview thumbnail.",
        "Click 'Download Video' to save the uncompressed 1080p MP4 file to your local device.",
        "Remember to only download videos for personal use or with express permission from the copyright owner.",
      ],
    },
    {
      id: "save-reels",
      icon: "reels",
      title: "How to Save Instagram Reels with Audio",
      summary: "How FastEDL extracts synchronized audio tracks with 9:16 vertical video streams.",
      content: [
        "Public Instagram Reels contain both a video stream and an audio track (original sound or licensed track).",
        "FastEDL automatically parses the container to ensure the downloaded MP4 contains synchronized high-bitrate audio.",
        "Reels from private accounts cannot be retrieved because Instagram blocks unauthenticated access to private media.",
      ],
    },
    {
      id: "carousel-photos",
      icon: "carousel",
      title: "Downloading Carousel Albums & Multi-Posts",
      summary: "How to extract individual slides or batch download entire gallery posts containing mixed photos and videos.",
      content: [
        "Instagram allows users to post up to 10 photos or videos in a single carousel album.",
        "When you paste a carousel URL into FastEDL, each slide item is extracted with a dedicated preview.",
        "You can download individual photos as high-resolution JPEGs, download specific video slides as MP4, or download the entire set.",
      ],
    },
    {
      id: "troubleshooting",
      icon: "settings",
      title: "Troubleshooting Invalid or Failed Links",
      summary: "Common causes for 'Unable to load media' and how to resolve them immediately.",
      content: [
        "Private Accounts: FastEDL only operates with publicly accessible content. If an account is set to private, third-party tools cannot retrieve the media.",
        "Expired Stories: Stories disappear after 24 hours. If a story has expired on Instagram, its CDN link is deleted and cannot be loaded.",
        "Malformed URLs: Ensure you pasted the full URL (e.g. https://www.instagram.com/reel/...). Avoid truncated links or links copied from inside private direct messages.",
        "Temporary Platform Rate Limits: Rarely, Instagram temporarily rate-limits specific IP addresses. Waiting 60 seconds and retrying resolves most transient issues.",
      ],
    },
    {
      id: "android-storage",
      icon: "folder",
      title: "Android Download Location Guide",
      summary: "Where downloaded files are saved on Samsung, Google Pixel, Xiaomi, and other Android devices.",
      content: [
        "By default, Android Chrome and mobile browsers save downloads directly to your device's '/storage/emulated/0/Download' folder.",
        "Open your device's built-in 'Files' or 'My Files' app and navigate to the 'Downloads' category.",
        "Media also automatically appears in Google Photos or Samsung Gallery under the 'Downloads' album tab.",
      ],
    },
    {
      id: "iphone-storage",
      icon: "download",
      title: "iPhone & iPad Download Location Guide",
      summary: "How to find downloaded files in iOS Files and transfer them directly to Photos Camera Roll.",
      content: [
        "In iOS Safari, tap the download arrow in the address bar to view recent downloads.",
        "Tap the downloaded MP4 or JPEG file to preview it in Safari's quick look viewer.",
        "Tap the Share button (square with arrow up) at the bottom left corner.",
        "Select 'Save Video' or 'Save Image' from the action list. The media will immediately appear in your native Photos app.",
      ],
    },
    {
      id: "formats-quality",
      icon: "speed",
      title: "Supported Media Formats & Bitrates",
      summary: "Technical breakdown of supported video resolutions, audio codecs, and image formats.",
      content: [
        "Video Format: MP4 container with H.264 (AVC) or HEVC compression and AAC stereo audio.",
        "Video Resolutions: Standard 1080 × 1920 (9:16 vertical reels), 1080 × 1350 (4:5 portrait), and 1080 × 1080 (1:1 square).",
        "Photo Format: Uncompressed JPEG (.jpg) in full original CDN upload dimensions (up to 1440px width).",
        "No Added Watermarks: FastEDL never overlays logos, text, or watermarks onto your downloaded media.",
      ],
    },
    {
      id: "privacy-security",
      icon: "security",
      title: "Privacy, Security & Ethical Guidelines",
      summary: "Our strict zero-credential storage policy and ethical usage compliance.",
      content: [
        "Zero Account Login: We never request, log, or store your Instagram credentials, passwords, or session cookies.",
        "No Permanent File Storage: FastEDL acts as a transient pass-through proxy. Media files are streamed directly to your browser and not retained on our servers.",
        "Fair Use Notice: Users must respect intellectual property rights. Downloaded media should only be used for personal archiving, educational review, or with proper authorization from the original creator.",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] mb-8">
          <Link href="/" className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] flex items-center gap-1.5 transition-colors">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Help Center &amp; Guides</span>
        </nav>

        {/* Hub Header */}
        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] text-xs font-bold mb-3">
            <OxygenIcon name="help" size={16} alt="Help" />
            Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            FastEDL Help Center &amp; Guides
          </h1>
          <p className="mt-3 text-base text-[#64748B] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Everything you need to know about saving Instagram media, troubleshooting links, device storage paths, and security policies.
          </p>
        </div>

        {/* Guide Topics Grid */}
        <div className="space-y-10">
          {guides.map((guide, idx) => {
            return (
              <article
                key={guide.id}
                id={guide.id}
                className="bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] border border-[#635BFF]/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <OxygenIcon name={guide.icon} size={24} alt={guide.title} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#635BFF] dark:text-[#8B5CF6] uppercase tracking-wider">
                      Guide #{idx + 1}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                      {guide.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#E2E8F0] dark:border-[#334155]">
                  <ul className="space-y-3">
                    {guide.content.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed">
                        <OxygenIcon name="check" size={14} className="flex-shrink-0 mt-0.5" alt="Check" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA to Downloader */}
        <div className="mt-14 p-8 rounded-3xl bg-[#635BFF] text-white text-center shadow-xl shadow-[#635BFF]/20">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Download Instagram Media?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 max-w-lg mx-auto">
            Try our high-speed downloader now. No registration, no apps, and no watermarks.
          </p>
          <div className="mt-6">
            <Link
              href="/#downloader"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#635BFF] font-bold text-sm shadow-md hover:bg-slate-50 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Go to Downloader</span>
              <OxygenIcon name="arrow-right" size={14} alt="Go" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
