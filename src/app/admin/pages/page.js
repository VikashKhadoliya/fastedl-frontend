"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminPagesManagerPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("editor"); // 'editor' | 'preview' | 'seo' | 'history'
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [mainHeading, setMainHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [category, setCategory] = useState("General");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [author, setAuthor] = useState("FastEDL Editorial Team");
  const [status, setStatus] = useState("published");
  const [isSystem, setIsSystem] = useState(0);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [robots, setRobots] = useState("index, follow");

  // Version History
  const [versions, setVersions] = useState([]);
  const [versionNote, setVersionNote] = useState("");

  // Media picker modal in editor
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Content Textarea Ref
  const contentTextareaRef = useRef(null);

  // Load Pages
  const loadPages = async () => {
    const token = localStorage.getItem("fastedl_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err) {
      console.error("Failed to fetch pages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Open Create Page Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setMainHeading("");
    setSubheading("");
    setCategory("General");
    setContent("");
    setFeaturedImage("");
    setAuthor("FastEDL Editorial Team");
    setStatus("draft");
    setIsSystem(0);
    setSeoTitle("");
    setSeoDescription("");
    setFocusKeyword("");
    setCanonicalUrl("");
    setOgTitle("");
    setOgDescription("");
    setOgImage("");
    setRobots("index, follow");
    setVersions([]);
    setVersionNote("Initial creation");
    setErrorMessage("");
    setSaveSuccess(false);
    setActiveTab("editor");
    setIsEditorOpen(true);
  };

  // Open Edit Page Modal
  const handleOpenEdit = async (pageItem) => {
    const token = localStorage.getItem("fastedl_admin_token");
    setEditingId(pageItem.id);
    setTitle(pageItem.title || "");
    setSlug(pageItem.slug || "");
    setMainHeading(pageItem.main_heading || "");
    setSubheading(pageItem.subheading || "");
    setCategory(pageItem.category || "General");
    setContent(pageItem.content || "");
    setFeaturedImage(pageItem.featured_image || "");
    setAuthor(pageItem.author || "FastEDL Editorial Team");
    setStatus(pageItem.status || "draft");
    setIsSystem(pageItem.is_system || 0);
    setSeoTitle(pageItem.seo_title || "");
    setSeoDescription(pageItem.seo_description || "");
    setFocusKeyword(pageItem.focus_keyword || "");
    setCanonicalUrl(pageItem.canonical_url || "");
    setOgTitle(pageItem.og_title || "");
    setOgDescription(pageItem.og_description || "");
    setOgImage(pageItem.og_image || "");
    setRobots(pageItem.robots || "index, follow");
    setVersionNote("");
    setErrorMessage("");
    setSaveSuccess(false);
    setActiveTab("editor");
    setIsEditorOpen(true);

    // Fetch detailed page versions
    try {
      const res = await fetch(`/api/admin/pages/${pageItem.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const detail = await res.json();
        setVersions(detail.versions || []);
      }
    } catch (e) {
      console.error("Failed to load page versions", e);
    }
  };

  // Auto-slugify on title change for new custom pages
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editingId && !isSystem) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(autoSlug);
      if (!seoTitle) setSeoTitle(val ? `${val} | FastEDL` : "");
      if (!mainHeading) setMainHeading(val);
    }
  };

  // Save Page (Draft or Publish)
  const handleSave = async (forcedStatus = null) => {
    const token = localStorage.getItem("fastedl_admin_token");
    const targetStatus = forcedStatus || status;

    if (!title.trim()) {
      setErrorMessage("Please enter a page title.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Please enter a URL slug.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      main_heading: mainHeading,
      subheading: subheading,
      category: category,
      content: content,
      featured_image: featuredImage,
      author: author,
      status: targetStatus,
      seo_title: seoTitle || title,
      seo_description: seoDescription,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl,
      og_title: ogTitle || seoTitle || title,
      og_description: ogDescription || seoDescription,
      og_image: ogImage || featuredImage,
      robots: robots,
      version_note: versionNote || `Update by ${author} on ${new Date().toLocaleDateString()}`
    };

    try {
      const url = editingId ? `/api/admin/pages/${editingId}` : "/api/admin/pages";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setStatus(targetStatus);
        setTimeout(() => setSaveSuccess(false), 3000);
        await loadPages();
        if (!editingId && data.id) {
          setEditingId(data.id);
        }
      } else {
        setErrorMessage(data.detail || "Failed to save page. Please try again.");
      }
    } catch (e) {
      setErrorMessage("Network error saving page.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Page with Confirmation
  const handleDelete = async (id, pageTitle) => {
    if (!confirm(`Are you sure you want to permanently delete "${pageTitle}"? This cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("fastedl_admin_token");
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (editingId === id) setIsEditorOpen(false);
        await loadPages();
      } else {
        const d = await res.json();
        alert(d.detail || "Failed to delete page.");
      }
    } catch (e) {
      alert("Error deleting page.");
    }
  };

  // Insert Rich Text Formatting at Cursor
  const insertFormatting = (prefix, suffix = "", defaultText = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Insert HTML Elements
  const insertHeading = (level) => {
    const tag = `h${level}`;
    insertFormatting(`<${tag} class="text-xl sm:text-2xl font-black text-white mt-8 mb-4">`, `</${tag}>\n`, `Heading ${level}`);
  };

  const insertParagraph = () => {
    insertFormatting(`<p class="text-slate-300 leading-relaxed mb-4">`, `</p>\n`, `Write your paragraph content here...`);
  };

  const insertLead = () => {
    insertFormatting(`<p class="text-lg text-slate-200 font-medium leading-relaxed mb-6">`, `</p>\n`, `Lead introductory highlight text.`);
  };

  const insertBold = () => insertFormatting("<strong>", "</strong>", "bold text");
  const insertItalic = () => insertFormatting("<em>", "</em>", "italic text");

  const insertList = (ordered = false) => {
    const tag = ordered ? "ol" : "ul";
    const snippet = ordered
      ? `<ol class="list-decimal pl-6 space-y-2 text-slate-300 my-4">\n  <li>First step or item</li>\n  <li>Second step or item</li>\n  <li>Third step or item</li>\n</ol>\n`
      : `<ul class="list-disc pl-6 space-y-2 text-slate-300 my-4">\n  <li>Key takeaway bullet</li>\n  <li>Important feature highlight</li>\n  <li>Helpful advice or note</li>\n</ul>\n`;
    insertFormatting(snippet, "");
  };

  const insertLink = () => {
    const url = prompt("Enter the destination URL:", "https://fastedl.app/");
    if (!url) return;
    const label = prompt("Enter link text:", "FastEDL Home");
    insertFormatting(`<a href="${url}" class="text-[#635BFF] hover:underline font-semibold" target="_blank" rel="noopener noreferrer">${label || url}</a>`);
  };

  const insertTable = () => {
    const tableSnippet = `
<div class="overflow-x-auto my-6">
  <table class="w-full text-left border-collapse border border-slate-800 text-sm">
    <thead class="bg-slate-900/80 text-white font-bold">
      <tr>
        <th class="border border-slate-800 p-3">Feature</th>
        <th class="border border-slate-800 p-3">FastEDL</th>
        <th class="border border-slate-800 p-3">Other Tools</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800 text-slate-300">
      <tr>
        <td class="border border-slate-800 p-3 font-medium text-white">Full HD / 4K Support</td>
        <td class="border border-slate-800 p-3 text-emerald-400 font-bold">Yes (Native Quality)</td>
        <td class="border border-slate-800 p-3 text-slate-500">Often Compressed</td>
      </tr>
      <tr>
        <td class="border border-slate-800 p-3 font-medium text-white">No Registration Required</td>
        <td class="border border-slate-800 p-3 text-emerald-400 font-bold">100% Free & Anonymous</td>
        <td class="border border-slate-800 p-3 text-slate-500">Requires Sign In</td>
      </tr>
    </tbody>
  </table>
</div>
`;
    insertFormatting(tableSnippet, "");
  };

  const insertBlockquote = () => {
    const quoteSnippet = `
<blockquote class="border-l-4 border-[#635BFF] pl-4 py-2 my-4 italic text-slate-200 bg-slate-900/50 rounded-r-xl">
  "FastEDL makes high-speed Instagram media downloads simple, reliable and secure for creators everywhere."
  <footer class="text-xs text-slate-400 font-normal mt-2">— FastEDL Architecture Team</footer>
</blockquote>
`;
    insertFormatting(quoteSnippet, "");
  };

  // Open Media Picker for Image Insertion
  const handleOpenMediaPicker = async () => {
    setIsMediaPickerOpen(true);
    setMediaLoading(true);
    const token = localStorage.getItem("fastedl_admin_token");
    try {
      const res = await fetch("/api/admin/media", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setMediaAssets(d.assets || []);
      }
    } catch (e) {
      console.error("Error loading media", e);
    } finally {
      setMediaLoading(false);
    }
  };

  // Upload image directly inside media picker
  const handleDirectUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem("fastedl_admin_token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt_text", file.name.replace(/\.[^/.]+$/, ""));

    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const d = await res.json();
        setMediaAssets((prev) => [d.asset, ...prev]);
      } else {
        alert("Image upload failed. Allowed formats: PNG, JPG, WEBP, GIF, SVG (up to 15MB).");
      }
    } catch (err) {
      alert("Network error uploading image.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Select Image from Media Picker
  const handleSelectMedia = (asset) => {
    const caption = prompt("Enter optional image caption (leave empty for none):", "");
    const imgSnippet = `
<figure class="my-6">
  <img src="${asset.file_path}" alt="${asset.alt_text || title}" class="w-full rounded-2xl border border-slate-800 shadow-xl object-cover" loading="lazy" />
  ${caption ? `<figcaption class="text-xs text-slate-400 text-center mt-2 italic">${caption}</figcaption>` : ""}
</figure>
`;
    insertFormatting(imgSnippet, "");
    setIsMediaPickerOpen(false);
  };

  // Filter & Search Pages
  const filteredPages = pages.filter((p) => {
    const matchesFilter = filterStatus === "all" || p.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate live Google Snippet lengths
  const snippetTitle = seoTitle || title || "Page Title — FastEDL";
  const snippetDesc =
    seoDescription ||
    subheading ||
    "Read this guide and page on FastEDL, your premier Instagram media tools and content platform.";
  const displayUrl = `https://fastedl.app${slug === "home" ? "/" : slug.startsWith("/") ? slug : `/${slug}`}`;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#635BFF]/10 text-[#635BFF] text-[11px] font-bold uppercase tracking-wider border border-[#635BFF]/20">
                Content Management System
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">100% Manually Authored</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pages Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Create, edit, preview and publish legal pages, guides, FAQs, and custom static or dynamic landing pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/media"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shadow-sm"
            >
              <OxygenIcon name="image" className="w-4 h-4 text-[#06B6D4]" />
              Media Library
            </Link>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#4F46E5] hover:from-[#5248EE] hover:to-[#4338CA] text-white text-xs font-bold shadow-lg shadow-[#635BFF]/25 flex items-center gap-2 transition-all"
            >
              <OxygenIcon name="check" className="w-4 h-4" />
              + Create New Page
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2 w-full md:w-auto">
            {["all", "published", "draft"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterStatus === st
                    ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/20"
                    : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60"
                }`}
              >
                {st} {st === "all" ? `(${pages.length})` : `(${pages.filter((p) => p.status === st).length})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug, or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
            <span className="absolute left-3 top-2.5 text-slate-500">
              <OxygenIcon name="search" className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-20 text-center">
              <OxygenIcon name="refresh" className="w-8 h-8 animate-spin text-[#635BFF] mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">Loading FastEDL pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3">
                <OxygenIcon name="document-edit" className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No pages match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                Try adjusting your search query or create a brand new custom page.
              </p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold"
              >
                + Create First Custom Page
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Page Title & Slug</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPages.map((pageItem) => {
                    const isPub = pageItem.status === "published";
                    const pageHref = pageItem.slug === "home" ? "/" : `/${pageItem.slug}`;

                    return (
                      <tr key={pageItem.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm group-hover:text-[#06B6D4] transition-colors">
                            {pageItem.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                            <span>/{pageItem.slug === "home" ? "" : pageItem.slug}</span>
                            {isPub && (
                              <a
                                href={pageHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-white"
                                title="Open Live Page"
                              >
                                <OxygenIcon name="arrow-right" className="w-3 h-3 inline" />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700/60">
                            {pageItem.category || "General"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          {pageItem.is_system ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-bold text-[10px] border border-blue-500/20 uppercase tracking-wide">
                              Core System
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-bold text-[10px] border border-purple-500/20 uppercase tracking-wide">
                              Custom Page
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {isPub ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[11px] border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[11px] border border-amber-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                              Draft
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                          {pageItem.updated_at ? new Date(pageItem.updated_at).toLocaleDateString() : "—"}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(pageItem)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#635BFF] text-slate-200 hover:text-white font-bold transition-all border border-slate-700 hover:border-[#635BFF]"
                              title="Edit Page"
                            >
                              Edit
                            </button>

                            {pageItem.is_system === 0 && (
                              <button
                                onClick={() => handleDelete(pageItem.id, pageItem.title)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all border border-slate-700 hover:border-red-500/30"
                                title="Delete Custom Page"
                              >
                                <OxygenIcon name="close" className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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

      {/* FULL-SCREEN RICH PAGE EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
          {/* Top Bar */}
          <div className="bg-[#1E293B] border-b border-slate-800 px-6 py-3 flex items-center justify-between gap-4 shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center font-bold text-xs border border-[#635BFF]/30">
                <OxygenIcon name="copy-tool" className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  {editingId ? `Editing: ${title || "Untitled"}` : "Create New Custom Page"}
                  {isSystem ? (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      System Page
                    </span>
                  ) : null}
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Slug: /{slug === "home" ? "" : slug}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "editor" ? "bg-[#635BFF] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Visual Editor
              </button>
              <button
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "seo" ? "bg-[#635BFF] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                SEO & Meta Settings
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "preview" ? "bg-[#635BFF] text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                Live Preview
              </button>
              {editingId && (
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "history" ? "bg-[#635BFF] text-white shadow" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Version History ({versions.length})
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  <OxygenIcon name="check" className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
              {errorMessage && (
                <span className="text-xs text-red-400 font-medium max-w-xs truncate bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                  {errorMessage}
                </span>
              )}

              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all disabled:opacity-50"
              >
                Save as Draft
              </button>

              <button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <OxygenIcon name="check" className="w-3.5 h-3.5" />
                Publish Live
              </button>

              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
                title="Close Editor"
              >
                <OxygenIcon name="close" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#0F172A]">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* TAB 1: VISUAL CONTENT EDITOR */}
              {activeTab === "editor" && (
                <div className="space-y-6">
                  {/* Page Metadata Header Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#1E293B] p-5 rounded-2xl border border-slate-800">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Page Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Creator Growth Strategy & Monetization Guide"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            URL Slug *
                          </label>
                          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#635BFF]">
                            <span className="px-2.5 text-xs text-slate-500 font-mono">/</span>
                            <input
                              type="text"
                              required
                              disabled={isSystem === 1}
                              value={slug}
                              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                              placeholder="creator-growth-guide"
                              className="w-full py-2 pr-3 bg-transparent text-white text-xs font-mono focus:outline-none disabled:text-slate-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Category
                          </label>
                          <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Educational / Legal / Guides"
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-800 md:pl-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Author Attribution
                        </label>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Publication Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        >
                          <option value="published">Published (Public)</option>
                          <option value="draft">Draft (Admin Only)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Version Snapshot Note
                        </label>
                        <input
                          type="text"
                          value={versionNote}
                          onChange={(e) => setVersionNote(e.target.value)}
                          placeholder="e.g. Updated terms section 4"
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Heading & Subheading Box */}
                  <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Main Display Heading (H1)
                      </label>
                      <input
                        type="text"
                        value={mainHeading}
                        onChange={(e) => setMainHeading(e.target.value)}
                        placeholder="e.g. Everything You Need to Know About FastEDL"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Subheading / Introductory Summary
                      </label>
                      <textarea
                        rows={2}
                        value={subheading}
                        onChange={(e) => setSubheading(e.target.value)}
                        placeholder="A concise, engaging introductory paragraph highlighting the purpose of this page."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF] resize-none"
                      />
                    </div>
                  </div>

                  {/* RICH TEXT FORMATTING TOOLBAR & EDITOR */}
                  <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                    {/* Visual Toolbar */}
                    <div className="bg-slate-900/90 border-b border-slate-800 p-2.5 flex flex-wrap items-center gap-1.5 sticky top-0 z-10 backdrop-blur">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                        Format:
                      </span>
                      <button
                        type="button"
                        onClick={() => insertHeading(1)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                        title="Heading 1 (H1)"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(2)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                        title="Heading 2 (H2)"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHeading(3)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                        title="Heading 3 (H3)"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={insertLead}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="Lead Highlight Paragraph"
                      >
                        Lead
                      </button>
                      <button
                        type="button"
                        onClick={insertParagraph}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="Standard Paragraph"
                      >
                        ¶ Body
                      </button>

                      <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                        Style:
                      </span>
                      <button
                        type="button"
                        onClick={insertBold}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-black"
                        title="Bold Text"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={insertItalic}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs italic"
                        title="Italic Text"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertList(false)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertList(true)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        title="Numbered List"
                      >
                        1. List
                      </button>

                      <div className="w-[1px] h-5 bg-slate-700 mx-1"></div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">
                        Insert:
                      </span>
                      <button
                        type="button"
                        onClick={insertLink}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#635BFF] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Insert Hyperlink"
                      >
                        <OxygenIcon name="applications-internet" className="w-3 h-3" />
                        Link
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenMediaPicker}
                        className="px-2.5 py-1 rounded-lg bg-[#635BFF]/20 hover:bg-[#635BFF] text-[#635BFF] hover:text-white border border-[#635BFF]/30 text-xs font-bold transition-all flex items-center gap-1"
                        title="Insert Image from Media Library"
                      >
                        <OxygenIcon name="image" className="w-3 h-3" />
                        Insert Image
                      </button>
                      <button
                        type="button"
                        onClick={insertTable}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="Insert Responsive Table"
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        onClick={insertBlockquote}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                        title="Insert Callout Quote"
                      >
                        Quote
                      </button>
                    </div>

                    {/* Textarea for Rich HTML / Prose */}
                    <div className="p-4 bg-slate-950">
                      <textarea
                        ref={contentTextareaRef}
                        rows={18}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your rich page content here using visual toolbar buttons above, or format directly with standard clean HTML..."
                        className="w-full bg-transparent font-mono text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
                      />
                    </div>

                    <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span>Words: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
                        <span className="mx-2">•</span>
                        <span>Characters: {content.length}</span>
                      </div>
                      <div className="text-slate-500">
                        Supports rich semantic HTML tags (h1-h4, p, ul, ol, a, blockquote, img, table)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEO & META SETTINGS */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  {/* Google Search Snippet Card Preview */}
                  <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          Google Search Result Preview
                        </h3>
                      </div>
                      <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`px-2.5 py-1 rounded-md font-bold ${
                            previewDevice === "desktop" ? "bg-slate-800 text-white" : "text-slate-400"
                          }`}
                        >
                          Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`px-2.5 py-1 rounded-md font-bold ${
                            previewDevice === "mobile" ? "bg-slate-800 text-white" : "text-slate-400"
                          }`}
                        >
                          Mobile
                        </button>
                      </div>
                    </div>

                    {/* Google SERP Card */}
                    <div className={`p-4 rounded-xl bg-white text-slate-900 font-sans border border-slate-200 shadow-sm ${
                      previewDevice === "mobile" ? "max-w-sm mx-auto" : "max-w-2xl"
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-[10px] font-black">
                          F
                        </div>
                        <div className="truncate text-xs text-[#202124]">
                          <span className="font-medium">FastEDL</span>
                          <span className="text-slate-400 mx-1">›</span>
                          <span className="text-slate-500 font-mono text-[11px]">{displayUrl}</span>
                        </div>
                      </div>
                      <h4 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer truncate">
                        {snippetTitle}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#4d5156] line-clamp-2 mt-1 leading-normal">
                        {snippetDesc}
                      </p>
                    </div>
                  </div>

                  {/* SEO Form Inputs */}
                  <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          SEO Title Tag
                        </label>
                        <span className={`text-[11px] font-mono ${
                          snippetTitle.length > 60 ? "text-amber-400" : "text-slate-400"
                        }`}>
                          {snippetTitle.length}/60 chars (Recommended: 50-60)
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="e.g. Terms of Service & Acceptable Use Policy | FastEDL"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Meta Description
                        </label>
                        <span className={`text-[11px] font-mono ${
                          snippetDesc.length > 160 ? "text-amber-400" : "text-slate-400"
                        }`}>
                          {snippetDesc.length}/160 chars (Recommended: 140-160)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="A concise, keyword-rich summary explaining the exact value and contents of this page to searchers."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Focus Keyword
                        </label>
                        <input
                          type="text"
                          value={focusKeyword}
                          onChange={(e) => setFocusKeyword(e.target.value)}
                          placeholder="e.g. instagram downloader terms"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Canonical URL
                        </label>
                        <input
                          type="text"
                          value={canonicalUrl}
                          onChange={(e) => setCanonicalUrl(e.target.value)}
                          placeholder={`https://fastedl.app${slug === "home" ? "/" : `/${slug}`}`}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Robots Indexing Directive
                        </label>
                        <select
                          value={robots}
                          onChange={(e) => setRobots(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        >
                          <option value="index, follow">index, follow (Standard Public Indexing)</option>
                          <option value="noindex, follow">noindex, follow (Do not show on Google, crawl links)</option>
                          <option value="noindex, nofollow">noindex, nofollow (Strictly Private / Hide)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Social Sharing Image (OG Image)
                        </label>
                        <input
                          type="text"
                          value={ogImage}
                          onChange={(e) => setOgImage(e.target.value)}
                          placeholder="/uploads/media/og-cover.png or https://..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: LIVE PREVIEW */}
              {activeTab === "preview" && (
                <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                  <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#06B6D4] font-bold uppercase tracking-wider">
                        FastEDL Public Reader Preview
                      </span>
                      <h2 className="text-xl font-black text-white mt-0.5">
                        {mainHeading || title || "Untitled Page"}
                      </h2>
                      {subheading && (
                        <p className="text-xs text-slate-400 mt-1 max-w-2xl">{subheading}</p>
                      )}
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <div>By {author}</div>
                      <div className="text-slate-500">Last updated: Today</div>
                    </div>
                  </div>

                  <div className="p-6 sm:p-10 max-w-4xl mx-auto">
                    {content ? (
                      <div
                        className="prose prose-invert max-w-none text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <div className="py-12 text-center text-slate-500 text-sm">
                        No content written yet. Switch to the <strong>Visual Editor</strong> tab to write content.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: VERSION HISTORY SNAPSHOTS */}
              {activeTab === "history" && (
                <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Automatic Version Snapshots
                  </h3>
                  <p className="text-xs text-slate-400">
                    FastEDL saves an immutable snapshot of page contents and SEO metadata every time you update.
                  </p>

                  {versions.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No previous version snapshots found. Snapshots will be recorded automatically when you click "Save" or "Publish".
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-800">
                      {versions.map((ver, idx) => (
                        <div key={ver.id || idx} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-2">
                              <span>Version #{versions.length - idx}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {ver.created_at ? new Date(ver.created_at).toLocaleString() : ""}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {ver.version_note || "Update snapshot"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Restore content from Version #${versions.length - idx}?`)) {
                                setContent(ver.content || "");
                                setTitle(ver.title || title);
                                setActiveTab("editor");
                              }
                            }}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-[#635BFF] text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700"
                          >
                            Restore Content
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PICKER MODAL */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1E293B] w-full max-w-3xl rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <OxygenIcon name="image" className="w-5 h-5 text-[#635BFF]" />
                <h3 className="text-sm font-black text-white">Select Media to Insert</h3>
              </div>
              <button
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <OxygenIcon name="close" className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/40">
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Search images by name or alt text..."
                className="w-full max-w-sm px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDirectUpload}
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <OxygenIcon name="check" className="w-3.5 h-3.5" />
                  {uploadingImage ? "Uploading..." : "Upload New Image"}
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {mediaLoading ? (
                <div className="py-16 text-center text-xs text-slate-400">Loading images...</div>
              ) : mediaAssets.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  No images in media library yet. Upload an image above to insert it into your article.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaAssets
                    .filter((m) => !mediaSearch || m.filename.toLowerCase().includes(mediaSearch.toLowerCase()) || m.alt_text?.toLowerCase().includes(mediaSearch.toLowerCase()))
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectMedia(item)}
                        className="group relative rounded-xl border border-slate-800 bg-slate-900 overflow-hidden cursor-pointer hover:border-[#635BFF] transition-all hover:shadow-lg"
                      >
                        <div className="aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.file_path}
                            alt={item.alt_text || item.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-2 text-[11px]">
                          <div className="truncate font-semibold text-white">{item.filename}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            {(item.file_size / 1024).toFixed(0)} KB
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

