import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import FastEDLLogo from "@/components/FastEDLLogo";
import OxygenIcon from "@/components/OxygenIcon";
import { getBreadcrumbSchema } from "@/lib/seo";
import { getCmsPage } from "@/lib/cmsClient";

export async function generateMetadata() {
  const cms = await getCmsPage("about");
  if (cms) {
    return {
      title: cms.seo_title || "About FastEDL - Fast Easy Download Link",
      description: cms.seo_description || cms.subheading,
      alternates: {
        canonical: cms.canonical_url || "https://fastedl.app/about",
      },
      robots: cms.robots || "index, follow",
      openGraph: {
        title: cms.og_title || cms.seo_title || "About FastEDL",
        description: cms.og_description || cms.seo_description,
        url: cms.canonical_url || "https://fastedl.app/about",
        siteName: "FastEDL",
        images: cms.og_image ? [{ url: cms.og_image }] : [{ url: "/og-image.svg", width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: "About FastEDL - Fast Easy Download Link",
    description:
      "Learn about FastEDL, an independent web utility built to provide fast, secure, and straightforward access to downloadable public Instagram media.",
    alternates: {
      canonical: "https://fastedl.app/about",
    },
    openGraph: {
      title: "About FastEDL - Fast Easy Download Link",
      description: "Learn about FastEDL's mission, values, and engineering standards.",
      url: "https://fastedl.app/about",
      siteName: "FastEDL",
      images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "About FastEDL",
      description: "Learn about FastEDL's mission, values, and engineering standards.",
      images: ["/og-image.svg"],
    },
  };
}

export default async function AboutPage() {
  const cms = await getCmsPage("about");

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About FastEDL", url: "/about" },
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
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">About</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-6 mb-8">
          <div className="mb-4">
            <FastEDLLogo size="lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            {cms?.main_heading || "About FastEDL"}
          </h1>
          <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
            {cms?.subheading || "Fast Easy Download Link • Built for Speed, Privacy, and Simplicity"}
          </p>
        </div>

        {cms?.content ? (
          <article className="prose prose-slate dark:prose-invert max-w-none text-[#1E293B] dark:text-slate-200 leading-relaxed text-sm sm:text-base">
            <div dangerouslySetInnerHTML={{ __html: cms.content }} />
          </article>
        ) : (
          <div className="space-y-8 text-[#0F172A] dark:text-[#F8FAFC] leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold mb-3 text-[#0F172A] dark:text-[#F8FAFC]">
                Our Mission
              </h2>
              <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                FastEDL (Fast Easy Download Link) was created with a clear objective: to provide a lightweight, clean, and reliable tool for accessing downloadable public Instagram media. We believe essential web utilities should be simple, mobile-friendly, and free from intrusive pop-ups, misleading ads, or forced software installations.
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center mb-3">
                  <OxygenIcon name="speed" size={20} alt="Speed" />
                </div>
                <h3 className="font-bold text-base mb-1">Direct CDN Parsing</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  We query publicly available media delivery streams directly to retrieve original 1080p MP4 videos and high-resolution JPEG files in seconds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center mb-3">
                  <OxygenIcon name="security" size={20} alt="Security" />
                </div>
                <h3 className="font-bold text-base mb-1">Privacy by Design</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Zero Instagram password collection, zero tracking cookies, and zero permanent media storage. Everything operates transiently in your browser session.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
