"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminArticlesCMSPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("builder"); // 'builder' | 'raw' | 'preview' | 'seo'

  // Section & Category definitions
  const sectionOptions = [
    { id: "instagram-captions", label: "Instagram Captions", urlPrefix: "/instagram-captions" },
    { id: "instagram-hashtags", label: "Instagram Hashtags", urlPrefix: "/instagram-hashtags" },
    { id: "instagram-bio-ideas", label: "Instagram Bio Ideas", urlPrefix: "/instagram-bio-ideas" },
    { id: "instagram-ideas", label: "Instagram Ideas", urlPrefix: "/instagram-ideas" },
    { id: "guides", label: "Guides & Help Center", urlPrefix: "/guides" }
  ];

  const categoryMap = {
    "instagram-captions": [
      { id: "mood-captions", label: "Mood Captions" },
      { id: "attitude-captions", label: "Attitude Captions" },
      { id: "love-captions", label: "Love Captions" },
      { id: "funny-captions", label: "Funny Captions" },
      { id: "self-love-captions", label: "Self-Love Captions" },
      { id: "travel-captions", label: "Travel Captions" },
      { id: "birthday-captions", label: "Birthday Captions" },
      { id: "friendship-captions", label: "Friendship Captions" },
      { id: "aesthetic-captions", label: "Aesthetic Captions" },
      { id: "sad-captions", label: "Sad Captions" },
      { id: "mirror-selfie-captions", label: "Mirror Selfie Captions" }
    ],
    "instagram-hashtags": [
      { id: "fashion-hashtags", label: "Fashion Hashtags" },
      { id: "travel-hashtags", label: "Travel Hashtags" },
      { id: "fitness-hashtags", label: "Fitness Hashtags" },
      { id: "photography-hashtags", label: "Photography Hashtags" },
      { id: "business-hashtags", label: "Business Hashtags" },
      { id: "food-hashtags", label: "Food Hashtags" }
    ],
    "instagram-bio-ideas": [
      { id: "boys-instagram-bios", label: "Boys Instagram Bios" },
      { id: "girls-instagram-bios", label: "Girls Instagram Bios" },
      { id: "attitude-bios", label: "Attitude Bios" },
      { id: "business-bios", label: "Business Bios" },
      { id: "creator-bios", label: "Creator Bios" }
    ],
    "instagram-ideas": [
      { id: "instagram-reel-ideas", label: "Instagram Reel Ideas" },
      { id: "instagram-post-ideas", label: "Instagram Post Ideas" },
      { id: "instagram-story-ideas", label: "Instagram Story Ideas" }
    ],
    "guides": [
      { id: "downloader-guides", label: "Downloader Guides" },
      { id: "reels-tips", label: "Reels & Video Growth" },
      { id: "creator-strategy", label: "Creator Strategy" }
    ]
  };

  // Form state
  const [section, setSection] = useState("instagram-captions");
  const [category, setCategory] = useState("mood-captions");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("FastEDL Editorial Team");
  const [status, setStatus] = useState("published");
  const [readTime, setReadTime] = useState("5 min read");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [faqs, setFaqs] = useState([{ q: "", a: "" }]);

  // Easy Content Builder helper states
  const [blockHeading, setBlockHeading] = useState("");
  const [blockDesc, setBlockDesc] = useState("");
  const [blockItems, setBlockItems] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filterSection, setFilterSection] = useState("all");

  const loadArticles = async () => {
    const token = localStorage.getItem("fastedl_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/articles", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setSection("instagram-captions");
    setCategory("mood-captions");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("<p class=\"lead\">Introductory summary for this collection...</p>\n\n<h2>First Section Title</h2>\n<p>Explain the vibe or context for these captions:</p>\n\n<ul class=\"caption-group\" data-title=\"First Section Title\">\n  <li>First caption idea here. ✨</li>\n  <li>Second caption idea here. 🔥</li>\n  <li>Third caption idea here. 🚀</li>\n</ul>");
    setAuthor("FastEDL Editorial Team");
    setStatus("published");
    setReadTime("5 min read");
    setSeoTitle("");
    setSeoDescription("");
    setFaqs([
      { q: "How do I copy these captions?", a: "Click the Copy button beside any individual caption, or tap Copy All to copy the full list." }
    ]);
    setErrorMsg("");
    setActiveTab("builder");
    setIsModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingId(art.id);
    const sec = art.section || "instagram-captions";
    setSection(sec);
    setCategory(art.category || (categoryMap[sec]?.[0]?.id || "mood-captions"));
    setTitle(art.title);
    setSlug(art.slug);
    setExcerpt(art.excerpt || "");
    setContent(art.content || "");
    setAuthor(art.author || "FastEDL Editorial Team");
    setStatus(art.status || "published");
    setReadTime(art.read_time || "5 min read");
    setSeoTitle(art.seo_title || "");
    setSeoDescription(art.seo_description || "");
    
    if (art.faq_json) {
      try {
        setFaqs(JSON.parse(art.faq_json));
      } catch (e) {
        setFaqs([{ q: "", a: "" }]);
      }
    } else {
      setFaqs([{ q: "", a: "" }]);
    }

    setErrorMsg("");
    setActiveTab("builder");
    setIsModalOpen(true);
  };

  // Helper to insert a formatted caption list block without needing code
  const handleInsertCaptionBlock = () => {
    if (!blockHeading.trim() && !blockItems.trim()) return;

    const headingHtml = blockHeading.trim() ? `\n<h2>${blockHeading.trim()}</h2>\n` : "";
    const descHtml = blockDesc.trim() ? `<p>${blockDesc.trim()}</p>\n` : "";
    
    const lines = blockItems
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const titleAttr = blockHeading.trim() ? ` data-title="${blockHeading.trim()}"` : "";
    const listHtml = `<ul class="caption-group"${titleAttr}>\n` +
      lines.map((item) => `  <li>${item}</li>`).join("\n") +
      "\n</ul>\n";

    setContent((prev) => prev + headingHtml + descHtml + listHtml);
    setBlockHeading("");
    setBlockDesc("");
    setBlockItems("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    const token = localStorage.getItem("fastedl_admin_token");

    const validFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());

    const payload = {
      title,
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
      section,
      category,
      excerpt,
      content,
      author,
      status,
      read_time: readTime,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      faq_json: JSON.stringify(validFaqs)
    };

    try {
      const url = editingId ? `/api/admin/articles/${editingId}` : "/api/admin/articles";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        loadArticles();
      } else {
        setErrorMsg(resData.detail || "Failed to save article");
      }
    } catch (err) {
      setErrorMsg("Network error saving article");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (art) => {
    const token = localStorage.getItem("fastedl_admin_token");
    const newStatus = art.status === "published" ? "draft" : "published";

    try {
      const res = await fetch(`/api/admin/articles/${art.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadArticles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id, artTitle) => {
    if (!confirm(`Are you sure you want to permanently delete "${artTitle}"?`)) return;
    const token = localStorage.getItem("fastedl_admin_token");

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadArticles();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredArticles = articles.filter((art) => {
    if (filterSection === "all") return true;
    return (art.section || "instagram-captions") === filterSection;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Content Library CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manually manage, write, and publish SEO-optimized Instagram Captions, Hashtags, Bios &amp; Ideas.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
          >
            <OxygenIcon name="document-new" className="w-4 h-4" />
            + New Article
          </button>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs scrollbar-none">
          <button
            onClick={() => setFilterSection("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              filterSection === "all"
                ? "bg-[#635BFF] text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Sections ({articles.length})
          </button>
          {sectionOptions.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterSection(s.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterSection === s.id
                  ? "bg-[#635BFF] text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <OxygenIcon name="refresh" className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
              Loading articles...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No articles match this section filter. Click <strong>+ New Article</strong> to create one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Article Title &amp; URL</th>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredArticles.map((art) => {
                    const sec = art.section || "instagram-captions";
                    const fullUrl = `/${sec}/${art.slug}`;

                    return (
                      <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-white text-sm line-clamp-1">{art.title}</div>
                          <div className="text-[11px] text-cyan-400 font-mono mt-0.5 truncate max-w-md">
                            {fullUrl}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                            {sectionOptions.find((s) => s.id === sec)?.label || sec}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-medium text-[11px]">
                            {art.category?.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(art)}
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase cursor-pointer transition-all ${
                              art.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                            }`}
                            title="Click to toggle publish status"
                          >
                            {art.status}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                          <Link
                            href={fullUrl}
                            target="_blank"
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white inline-block"
                          >
                            View Live
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(art)}
                            className="px-2.5 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(art.id, art.title)}
                            className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================== */}
      {/* EDITORIAL ARTICLE CMS MODAL                              */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-4xl p-6 shadow-2xl my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Edit Content Collection" : "Create New Content Collection"}
                </h2>
                <p className="text-xs text-slate-400">
                  Write, organize headings, and add copyable caption groups.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {errorMsg && (
              <div className="my-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs shrink-0">
                {errorMsg}
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pt-3 pb-2 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  activeTab === "builder" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Content &amp; List Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  activeTab === "raw" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Raw HTML / Markdown
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  activeTab === "seo" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                SEO &amp; Metadata
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg cursor-pointer ${
                  activeTab === "preview" ? "bg-[#06B6D4] text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Preview Reader
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
              {/* Core Details (Always visible) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => {
                      const newSec = e.target.value;
                      setSection(newSec);
                      const defaultCat = categoryMap[newSec]?.[0]?.id || "mood-captions";
                      setCategory(defaultCat);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {sectionOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    {(categoryMap[section] || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. 100+ Best Mood Instagram Captions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 bg-slate-800 border border-r-0 border-slate-700 text-slate-400 rounded-l-xl text-[11px] font-mono">
                      /{section}/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="mood-instagram-captions"
                      className="w-full px-3 py-2 rounded-r-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Introduction / Meta Excerpt
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary for search engines and the article opening..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* TAB 1: Easy List Builder */}
              {activeTab === "builder" && (
                <div className="space-y-4">
                  {/* Tool to Add Caption Group Without Coding */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-violet-500/30">
                    <h3 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                      <OxygenIcon name="text-editor" className="w-3.5 h-3.5 text-primary" />
                      Add Heading &amp; Caption List (No Coding Required)
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Type or paste captions (one per line). They will automatically be converted into interactive cards with individual <strong>Copy</strong> and <strong>Copy All</strong> buttons.
                    </p>

                    <div className="space-y-2 mb-3">
                      <input
                        type="text"
                        value={blockHeading}
                        onChange={(e) => setBlockHeading(e.target.value)}
                        placeholder="Section Heading (e.g. Chill & Low-Key Captions)"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={blockDesc}
                        onChange={(e) => setBlockDesc(e.target.value)}
                        placeholder="Short intro paragraph (optional)"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <textarea
                        rows={4}
                        value={blockItems}
                        onChange={(e) => setBlockItems(e.target.value)}
                        placeholder="Paste captions here, one per line:&#10;Living in soft focus today. ☕&#10;Quiet mind, peaceful soul. 🌿&#10;Too blessed to be stressed. ✨"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleInsertCaptionBlock}
                      className="px-4 py-1.5 rounded-lg bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Append Caption List to Content
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400 font-bold uppercase tracking-wider">
                        Full Article HTML Preview
                      </label>
                      <span className="text-[10px] text-slate-500">
                        Edit below or switch to Raw HTML tab
                      </span>
                    </div>
                    <textarea
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Raw HTML Tab */}
              {activeTab === "raw" && (
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Raw Article Markup
                  </label>
                  <textarea
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed"
                  />
                </div>
              )}

              {/* TAB 3: SEO Tab */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || "Custom search engine title"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || "Search card summary (150-160 characters)"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                    />
                  </div>

                  {/* FAQs Builder */}
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-400 font-bold uppercase tracking-wider">
                        Frequently Asked Questions (FAQ Schema)
                      </label>
                      <button
                        type="button"
                        onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                        className="text-xs text-primary hover:underline font-bold"
                      >
                        + Add Question
                      </button>
                    </div>

                    <div className="space-y-3">
                      {faqs.map((f, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <input
                            type="text"
                            value={f.q}
                            onChange={(e) => {
                              const copy = [...faqs];
                              copy[i].q = e.target.value;
                              setFaqs(copy);
                            }}
                            placeholder="Question..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                          />
                          <textarea
                            rows={2}
                            value={f.a}
                            onChange={(e) => {
                              const copy = [...faqs];
                              copy[i].a = e.target.value;
                              setFaqs(copy);
                            }}
                            placeholder="Answer..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Live Preview */}
              {activeTab === "preview" && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-700 text-slate-800 dark:text-slate-100 max-h-[500px] overflow-y-auto">
                  <h1 className="text-2xl font-black mb-3">{title || "Untitled Article"}</h1>
                  <p className="text-xs text-slate-500 mb-6">{excerpt}</p>
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                <div className="text-[11px] text-slate-400">
                  Target URL: <span className="font-mono text-cyan-400">/{section}/{slug || "..."}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    {saving ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
