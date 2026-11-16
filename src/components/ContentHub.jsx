"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function ContentHub({
  sectionKey,
  sectionTitle,
  sectionSubtitle,
  badgeText,
  badgeIcon,
  categories = []
}) {
  const [articles, setArticles] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "published")
          .eq("section", sectionKey)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setArticles(data);
        } else {
          setArticles([]);
        }
      } catch (e) {
        console.error("Failed to load articles from Supabase:", e);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sectionKey]);

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCat === "all" || art.category === selectedCat;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <OxygenIcon name="go-home" className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{sectionTitle}</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-violet-500/20">
            <OxygenIcon name={badgeIcon || "text-editor"} className="w-4 h-4" />
            {badgeText || "FastEDL Content Library"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            {sectionTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {sectionSubtitle}
          </p>
        </div>

        {/* Category Pills & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCat("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCat === "all"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCat === cat.slug
                    ? "bg-[#635BFF] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <OxygenIcon name="search" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${sectionTitle.toLowerCase()}...`}
              className="w-full pl-9 pr-4 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-xs">
            <OxygenIcon name="refresh" className="w-4 h-4 animate-spin mr-2" />
            Loading curated content...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <OxygenIcon name="help" className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {articles.length === 0 ? "No published articles yet" : "No matching articles found"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {articles.length === 0
                ? "Articles published from the Admin CMS will appear here."
                : "Try another category filter or search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/${sectionKey}/${art.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {art.category?.replace("-", " ")}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <OxygenIcon name="chronometer" className="w-3 h-3" />
                      {art.read_time || "5 min read"}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-2 leading-snug">
                    {art.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                    By {art.author || "FastEDL Editorial"}
                  </span>
                  <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform text-xs">
                    View &amp; Copy &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Downloader Integration Card */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#635BFF] via-[#7C3AED] to-[#06B6D4] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Need to download an Instagram post or Reel?
            </h2>
            <p className="text-sm text-violet-100 mb-6 leading-relaxed">
              FastEDL lets you preview and download Instagram Videos, Reels, Carousels, and Photos in native full quality with original audio.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#635BFF] font-bold text-xs shadow hover:bg-slate-100 transition-colors"
            >
              <OxygenIcon name="download" className="w-4 h-4" />
              Try FastEDL Downloader
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

