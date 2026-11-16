"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { supabase } from "@/lib/supabaseClient";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);

  function extractToc(html) {
    if (!html) return;
    const matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    const headings = matches.map((m, idx) => {
      const text = m.replace(/<\/?[^>]+(>|$)/g, "");
      const id = `heading-${idx}`;
      return { text, id };
    });
    setToc(headings);
  }

  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      try {
        const { data, error: sbErr } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (!sbErr && data) {
          const faqs = Array.isArray(data.faq_json) ? data.faq_json : [];
          setArticle({ ...data, faqs });
          extractToc(data.content);

          const { data: relData } = await supabase
            .from("articles")
            .select("id, slug, title, read_time")
            .eq("category", data.category)
            .eq("status", "published")
            .neq("id", data.id)
            .limit(3);

          if (relData) {
            setRelated(relData);
          }
          return;
        }

        setError("Article not found");
      } catch (e) {
        console.error("Failed to load article:", e);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <OxygenIcon name="view-refresh" className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-slate-500">Loading guide...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <OxygenIcon name="dialog-warning" className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Guide Not Found</h1>
          <p className="text-slate-500 mb-6">The article you requested could not be located.</p>
          <Link href="/guides" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm">
            Browse All Guides
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-primary font-medium truncate max-w-xs">{article.title}</span>
        </div>

        {/* Article Header */}
        <header className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
              {article.category?.replace("-", " ") || "Guide"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <OxygenIcon name="chronometer" className="w-3.5 h-3.5" />
              {article.read_time || "5 min read"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#635BFF]/10 text-primary flex items-center justify-center font-bold">
                FE
              </div>
              <span>Written by <strong className="text-slate-700 dark:text-slate-200">{article.author || "FastEDL Editorial"}</strong></span>
            </div>
            <span>Published {article.created_at?.slice(0, 10)}</span>
          </div>
        </header>

        {/* Main Content & Table of Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Article Body (8 cols) */}
          <article className="lg:col-span-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#635BFF] prose-img:rounded-xl">
            <div
              className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-base"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Quick Action Box */}
            <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <OxygenIcon name="download" className="w-4 h-4 text-primary" />
                Try FastEDL Video & Reels Downloader
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                Test genuine format selection with FastEDL. Fast, 100% free, and no account needed.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold shadow hover:bg-[#5248EE] transition-colors"
              >
                Go to Downloader &rarr;
              </Link>
            </div>

            {/* Article FAQs */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{f.q}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <OxygenIcon name="format-list-ordered" className="w-4 h-4 text-primary" />
                  Table of Contents
                </h3>
                <nav className="space-y-2 text-xs">
                  {toc.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer py-0.5 line-clamp-1"
                    >
                      {item.text}
                    </div>
                  ))}
                </nav>
              </div>
            )}

            {/* Creator Tools Quick Access */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <OxygenIcon name="applications-system" className="w-4 h-4 text-[#06B6D4]" />
                Popular Creator Tools
              </h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/instagram-caption-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  ✨ Caption Generator (EN/HI)
                </Link>
                <Link
                  href="/instagram-hashtag-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  #️⃣ Hashtag Generator
                </Link>
                <Link
                  href="/instagram-bio-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  👤 Bio Generator
                </Link>
                <Link
                  href="/instagram-caption-formatter"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  📝 Caption Linebreak Cleaner
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Related Creator Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col justify-between"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-primary font-semibold">
                    Read Guide &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

