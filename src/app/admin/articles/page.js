"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AdminArticlesCMSPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase loadArticles error:", error);
      } else if (data) {
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadArticles();
    }
  }, [adminUser]);

  const openCreateModal = () => {
    setEditingId(null);
    setSection("instagram-captions");
    setCategory("mood-captions");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setAuthor("FastEDL Editorial Team");
    setStatus("published");
    setReadTime("5 min read");
    setSeoTitle("");
    setSeoDescription("");
    setFaqs([{ q: "", a: "" }]);
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
        const parsed = typeof art.faq_json === "string" ? JSON.parse(art.faq_json) : art.faq_json;
        setFaqs(Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ q: "", a: "" }]);
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

    const validFaqs = faqs.filter((f) => f.q.trim() && f.a.trim());
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");

    const payload = {
      title,
      slug: cleanSlug,
      section,
      category,
      excerpt,
      content,
      author,
      status,
      read_time: readTime,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      faq_json: validFaqs,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        payload.created_at = new Date().toISOString();
        const { error } = await supabase
          .from("articles")
          .insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      loadArticles();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save article to Supabase");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (art) => {
    const newStatus = art.status === "published" ? "draft" : "published";

    try {
      const { error } = await supabase
        .from("articles")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", art.id);

      if (!error) {
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (!error) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredArticles = filterSection === "all"
    ? articles
    : articles.filter((a) => a.section === filterSection);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center">
        <OxygenIcon name="refresh" size={28} className="animate-spin text-[#635BFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Articles & Guides CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create, edit, and organize editorial guides, captions collections, and growth articles.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <OxygenIcon name="document-new" className="w-4 h-4 text-white" />
            Create Article
          </button>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none text-xs">
          <button
            onClick={() => setFilterSection("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterSection === "all"
                ? "bg-[#635BFF] text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Sections ({articles.length})
          </button>
          {sectionOptions.map((sec) => {
            const count = articles.filter((a) => a.section === sec.id).length;
            return (
              <button
                key={sec.id}
                onClick={() => setFilterSection(sec.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filterSection === sec.id
                    ? "bg-[#635BFF] text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {sec.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Articles Table */}
        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <OxygenIcon name="view-refresh" className="w-4 h-4 animate-spin text-[#635BFF]" />
              Loading articles from Supabase...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No articles found in this section. Click &ldquo;Create Article&rdquo; to add one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Section / Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100 text-sm">{art.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">/{art.section}/{art.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {art.section}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{art.category}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(art)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            art.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {art.status}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{art.author}</td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {art.created_at ? new Date(art.created_at).toLocaleDateString() : ""}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(art)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <OxygenIcon name="document-edit" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(art.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <OxygenIcon name="close" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-[#1E293B] border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center">
                  <OxygenIcon name="document-edit" className="w-4 h-4" />
                </div>
                <h2 className="font-bold text-white text-base">
                  {editingId ? "Edit Article" : "Create New Article"}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId && !slug) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
                      }
                    }}
                    placeholder="e.g. 100+ Best Attitude Captions for Instagram"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. attitude-captions"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                </div>
              </div>

              {/* Section & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => {
                      const newSec = e.target.value;
                      setSection(newSec);
                      setCategory(categoryMap[newSec]?.[0]?.id || "general");
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  >
                    {sectionOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  >
                    {(categoryMap[section] || []).map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Excerpt (Meta Summary)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description for preview cards and search engines..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                />
              </div>

              {/* Content Mode Tabs */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("builder")}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        activeTab === "builder" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Block Helper
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("raw")}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        activeTab === "raw" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Raw HTML Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("seo")}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        activeTab === "seo" ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      SEO &amp; FAQs
                    </button>
                  </div>
                </div>

                {activeTab === "builder" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <OxygenIcon name="text-editor" className="w-3.5 h-3.5 text-cyan-400" />
                        Quick Insert: Captions / Item List Block
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <input
                          type="text"
                          value={blockHeading}
                          onChange={(e) => setBlockHeading(e.target.value)}
                          placeholder="Section Heading (e.g. Savage Attitude Captions)"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={blockDesc}
                          onChange={(e) => setBlockDesc(e.target.value)}
                          placeholder="Context paragraph (optional)"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={blockItems}
                        onChange={(e) => setBlockItems(e.target.value)}
                        placeholder="Paste list of items (one per line)..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleInsertCaptionBlock}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Append Block to Article
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Current Content HTML
                      </label>
                      <textarea
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "raw" && (
                  <div>
                    <textarea
                      rows={12}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                    />
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Custom SEO Title
                        </label>
                        <input
                          type="text"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder="Overrides default title for search engines"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Reading Time
                        </label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          placeholder="e.g. 5 min read"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Custom Meta Description
                      </label>
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Snippet appearing on Google search results..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                      />
                    </div>

                    {/* FAQ Items */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Structured FAQ Schema Items
                        </label>
                        <button
                          type="button"
                          onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                          className="text-xs text-[#635BFF] hover:underline font-bold"
                        >
                          + Add FAQ
                        </button>
                      </div>
                      <div className="space-y-2">
                        {faqs.map((faq, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => {
                                const copy = [...faqs];
                                copy[idx].q = e.target.value;
                                setFaqs(copy);
                              }}
                              placeholder="Question (e.g. How do I use these captions?)"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                            />
                            <textarea
                              rows={2}
                              value={faq.a}
                              onChange={(e) => {
                                const copy = [...faqs];
                                copy[idx].a = e.target.value;
                                setFaqs(copy);
                              }}
                              placeholder="Answer..."
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status & Author Footer Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving to Supabase..." : editingId ? "Update Article" : "Publish Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
