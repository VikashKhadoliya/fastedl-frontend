import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import FastEDLLogo from "@/components/FastEDLLogo";
import { getCmsPage } from "@/lib/cmsClient";

export const dynamic = "force-dynamic";

async function getPageData(slug) {
  return await getCmsPage(slug);
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const page = await getPageData(slug);

  if (!page) {
    return {
      title: "Page Not Found — FastEDL",
      description: "The requested page does not exist or is currently in draft."
    };
  }

  const title = page.seo_title || `${page.title} — FastEDL`;
  const description = page.seo_description || page.subheading || "FastEDL Instagram tools and resources.";
  const canonical = page.canonical_url || `https://fastedl.app/p/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: page.robots || "index, follow",
    openGraph: {
      title: page.og_title || title,
      description: page.og_description || description,
      url: canonical,
      siteName: "FastEDL",
      images: page.og_image ? [{ url: page.og_image }] : [{ url: "/og-image.svg" }]
    },
    twitter: {
      card: "summary_large_image",
      title: page.og_title || title,
      description: page.og_description || description,
      images: page.og_image ? [page.og_image] : ["/og-image.svg"]
    }
  };
}

export default async function CustomCmsPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const page = await getPageData(slug);

  if (!page) {
    notFound();
  }

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fastedl.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": page.category || "Pages",
        "item": `https://fastedl.app/p/${slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": page.title,
        "item": `https://fastedl.app/p/${slug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.main_heading || page.title,
    "description": page.seo_description || page.subheading,
    "author": {
      "@type": "Organization",
      "name": page.author || "FastEDL Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FastEDL",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fastedl.app/icon.svg"
      }
    },
    "datePublished": page.published_at || page.created_at,
    "dateModified": page.updated_at || page.published_at || page.created_at
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] mb-6">
          <Link href="/" className="hover:text-[#635BFF] transition-colors flex items-center gap-1.5">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-slate-400">{page.category || "General"}</span>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold truncate max-w-[200px]">
            {page.title}
          </span>
        </nav>

        {/* Page Header */}
        <header className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] text-xs font-bold uppercase tracking-wider border border-[#635BFF]/20">
              {page.category || "FastEDL Library"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Updated {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : "Recently"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight">
            {page.main_heading || page.title}
          </h1>

          {page.subheading && (
            <p className="mt-4 text-base sm:text-lg text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
              {page.subheading}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <div className="w-8 h-8 rounded-full bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center font-bold">
              F
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{page.author || "FastEDL Editorial Team"}</div>
              <div className="text-[11px] text-slate-400">Independent Instagram Media & Creator Tools</div>
            </div>
          </div>
        </header>

        {/* Featured Image if Present */}
        {page.featured_image && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
            <img
              src={page.featured_image}
              alt={page.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Main Content Body */}
        <article className="prose prose-slate dark:prose-invert max-w-none text-[#1E293B] dark:text-slate-200 leading-relaxed text-sm sm:text-base">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>

        {/* Back to Tools Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#635BFF]/10 to-[#06B6D4]/10 border border-[#635BFF]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ready to download Instagram media?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Save high-resolution Reels, Videos, Photos, and Carousels instantly with FastEDL.
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold shadow-lg shadow-[#635BFF]/25 whitespace-nowrap transition-all"
          >
            Launch Downloader &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
