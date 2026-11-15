"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GuidesHubPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fallback seed articles in case backend is loading
  const fallbackArticles = [
    {
      id: 1,
      slug: "how-to-download-instagram-reels-in-1080p",
      title: "How to Download Instagram Reels in Full 1080p HD with Audio",
      excerpt: "Step-by-step masterclass on saving high-definition Instagram Reels with crystal-clear synchronized audio without watermarks.",
      category: "reels-tips",
      author: "FastEDL Technical Team",
      read_time: "5 min read",
      created_at: "2026-03-15"
    },
    {
      id: 2,
      slug: "instagram-hashtag-strategy-guide",
      title: "The 2026 Instagram Hashtag Algorithm: Reach & Best Practices",
      excerpt: "Why 30 random hashtags hurt your reach and how the 3x3 niche hashtag strategy accelerates discovery on Explore.",
      category: "hashtag-guides",
      author: "FastEDL Growth Lab",
      read_time: "7 min read",
      created_at: "2026-03-20"
    },
    {
      id: 3,
      slug: "how-to-fix-instagram-download-errors",
      title: "Troubleshooting FastEDL: Why Instagram Downloads Fail & How to Fix Them",
      excerpt: "Resolving rate limits, expired media tokens, private account restrictions, and browser cache issues effortlessly.",
      category: "troubleshooting",
      author: "FastEDL Support",
      read_time: "4 min read",
      created_at: "2026-03-25"
    },
    {
      id: 4,
      slug: "instagram-carousel-complete-guide",
      title: "Instagram Carousel Masterclass: Highest Engaging Post Format",
      excerpt: "How to structure multi-slide carousel albums that maximize saves, shares, and watch time in the modern algorithm.",
      category: "creator-tutorials",
      author: "FastEDL Content Team",
      read_time: "6 min read",
      created_at: "2026-04-01"
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [artsRes, catsRes] = await Promise.all([
          fetch("/api/content/articles"),
          fetch("/api/content/categories")
        ]);

        if (artsRes.ok) {
          const artsData = await artsRes.json();
          if (artsData.articles && artsData.articles.length > 0) {
            setArticles(artsData.articles);
          } else {
            setArticles(fallbackArticles);
          }
        } else {
          setArticles(fallbackArticles);
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (catsData.categories) {
            setCategories(catsData.categories);
          }
        }
      } catch (e) {
        console.warn("Using fallback articles data:", e);
        setArticles(fallbackArticles);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-primary font-medium">Guides & Creator Resources</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-violet-500/20">
            <OxygenIcon name="help-contents" className="w-4 h-4" />
            FastEDL Academy
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Instagram <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#06B6D4]">Guides & Tutorials</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Actionable strategies, download troubleshooting, algorithm guides, and creator best practices verified by social media architects.
          </p>
        </div>

        {/* Search and Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedCat("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === "all"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              All Topics
            </button>
            <button
              type="button"
              onClick={() => setSelectedCat("reels-tips")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === "reels-tips"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Reels Tips
            </button>
            <button
              type="button"
              onClick={() => setSelectedCat("hashtag-guides")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === "hashtag-guides"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Hashtags
            </button>
            <button
              type="button"
              onClick={() => setSelectedCat("troubleshooting")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === "troubleshooting"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Troubleshooting
            </button>
            <button
              type="button"
              onClick={() => setSelectedCat("creator-tutorials")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCat === "creator-tutorials"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              Tutorials
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <OxygenIcon name="edit-find" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-9 pr-4 py-2 text-base sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
            <OxygenIcon name="view-refresh" className="w-5 h-5 animate-spin mr-2" />
            Loading verified guides...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <OxygenIcon name="dialog-warning" className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200">No guides match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/guides/${art.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                      {art.category.replace("-", " ")}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <OxygenIcon name="chronometer" className="w-3.5 h-3.5" />
                      {art.read_time || "5 min read"}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors mb-2">
                    {art.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    By {art.author}
                  </span>
                  <span className="text-primary font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Guide &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Downloader CTA Banner */}
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#635BFF] via-[#7C3AED] to-[#06B6D4] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Need to download an Instagram post right now?
            </h2>
            <p className="text-sm sm:text-base text-violet-100 mb-6">
              Use FastEDL&apos;s lightning-fast downloader for Videos, Reels, Carousels, and Photos with genuine resolution selection.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#635BFF] font-bold text-sm shadow hover:bg-slate-100 transition-colors"
            >
              <OxygenIcon name="download" className="w-4 h-4" />
              Go to FastEDL Downloader
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

