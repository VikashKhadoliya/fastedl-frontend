"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AdminMediaLibraryPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  // Selected Asset for Details / Alt Text Editing
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [altTextDraft, setAltTextDraft] = useState("");
  const [updatingAlt, setUpdatingAlt] = useState(false);
  const [altSavedMsg, setAltSavedMsg] = useState(false);

  const fileInputRef = useRef(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch media assets", error);
      } else if (data) {
        setAssets(data);
      }
    } catch (e) {
      console.error("Failed to fetch media assets", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadMedia();
    }
  }, [adminUser]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError("");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const ext = file.name.split(".").pop();
        const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("media")
          .upload(cleanFileName, file, { cacheControl: "3600", upsert: false });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(cleanFileName);

        const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        const payload = {
          filename: file.name,
          file_path: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          alt_text: altText,
          created_at: new Date().toISOString()
        };

        const { data: insertedAsset, error: insertErr } = await supabase
          .from("media_assets")
          .insert([payload])
          .select()
          .single();

        if (insertErr) throw insertErr;

        setAssets((prev) => [insertedAsset || payload, ...prev]);
      } catch (err) {
        console.error(err);
        setUploadError(err.message || "Upload failed. Allowed: PNG, JPG, WEBP, GIF, SVG (up to 15MB).");
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopyUrl = (asset) => {
    const fullUrl = asset.file_path?.startsWith("http")
      ? asset.file_path
      : typeof window !== "undefined"
      ? `${window.location.origin}${asset.file_path}`
      : asset.file_path;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setAltTextDraft(asset.alt_text || "");
    setAltSavedMsg(false);
  };

  const handleSaveAltText = async () => {
    if (!selectedAsset) return;
    setUpdatingAlt(true);

    try {
      const { error } = await supabase
        .from("media_assets")
        .update({ alt_text: altTextDraft })
        .eq("id", selectedAsset.id);

      if (error) throw error;

      setAssets((prev) =>
        prev.map((a) => (a.id === selectedAsset.id ? { ...a, alt_text: altTextDraft } : a))
      );
      setSelectedAsset((prev) => (prev ? { ...prev, alt_text: altTextDraft } : null));
      setAltSavedMsg(true);
      setTimeout(() => setAltSavedMsg(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Failed to update image alt text.");
    } finally {
      setUpdatingAlt(false);
    }
  };

  const handleDelete = async (id, filename, filePath = null) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}"? This will remove the image file from storage.`)) {
      return;
    }

    const pathToCheck = filePath || selectedAsset?.file_path;
    try {
      if (pathToCheck && pathToCheck.includes("/storage/v1/object/public/media/")) {
        const storagePath = pathToCheck.split("/storage/v1/object/public/media/")[1];
        if (storagePath) {
          await supabase.storage.from("media").remove([storagePath]);
        }
      }

      const { error } = await supabase.from("media_assets").delete().eq("id", id);
      if (error) throw error;

      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
    } catch (e) {
      console.error(e);
      alert("Error deleting media file.");
    }
  };

  const filteredAssets = assets.filter(
    (a) =>
      !search ||
      a.filename.toLowerCase().includes(search.toLowerCase()) ||
      a.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] text-[11px] font-bold uppercase tracking-wider border border-[#06B6D4]/20">
                Media & Assets Storage
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">PNG, JPG, WEBP, SVG & GIF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Media Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload, organize, inspect and copy high-resolution imagery for FastEDL articles, pages and guides.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pages"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shadow-sm"
            >
              <OxygenIcon name="document-edit" className="w-4 h-4 text-[#635BFF]" />
              Pages Manager
            </Link>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#06B6D4] hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-[#635BFF]/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <OxygenIcon name="check" className="w-4 h-4" />
              {uploading ? "Uploading Images..." : "+ Upload Images"}
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError("")} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by filename or alt text..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
            <span className="absolute left-3 top-2.5 text-slate-500">
              <OxygenIcon name="search" className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Total Assets: <strong className="text-white">{assets.length}</strong>
          </div>
        </div>

        {/* Main Gallery Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grid of Images */}
          <div className="lg:col-span-2">
            <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-xl">
              {loading ? (
                <div className="py-24 text-center">
                  <OxygenIcon name="refresh" className="w-8 h-8 animate-spin text-[#635BFF] mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">Loading media assets...</p>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3 border border-slate-700">
                    <OxygenIcon name="image" className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">No media files found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Upload images to enrich your FastEDL articles, guides and custom pages.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold"
                  >
                    Upload First Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const isCopied = copiedId === asset.id;

                    return (
                      <div
                        key={asset.id}
                        onClick={() => handleSelectAsset(asset)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all bg-slate-900 ${
                          isSelected
                            ? "border-[#635BFF] ring-2 ring-[#635BFF]/30 shadow-lg"
                            : "border-slate-800 hover:border-slate-700 hover:shadow-md"
                        }`}
                      >
                        <div className="aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden relative">
                          <img
                            src={asset.file_path}
                            alt={asset.alt_text || asset.filename}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />

                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(asset);
                              }}
                              className="p-1 rounded-md bg-slate-900/90 text-white hover:bg-[#635BFF] transition-colors"
                              title="Copy URL"
                            >
                              <OxygenIcon name={isCopied ? "check" : "copy"} className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-2.5">
                          <div className="text-xs font-bold text-white truncate">{asset.filename}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                            <span>{(asset.file_size / 1024).toFixed(0)} KB</span>
                            <span>{new Date(asset.uploaded_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Details / Alt Text Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-xl sticky top-6">
              {selectedAsset ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Asset Details
                    </h3>
                    <button
                      onClick={() => setSelectedAsset(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Preview Thumbnail */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden flex items-center justify-center max-h-56">
                    <img
                      src={selectedAsset.file_path}
                      alt={selectedAsset.alt_text || selectedAsset.filename}
                      className="max-h-52 w-auto object-contain rounded-lg"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 font-medium">Filename</span>
                      <span className="text-white font-mono truncate max-w-[180px]">{selectedAsset.filename}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 font-medium">File Size</span>
                      <span className="text-slate-200 font-mono">{(selectedAsset.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 font-medium">MIME Type</span>
                      <span className="text-slate-200 font-mono">{selectedAsset.mime_type}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 font-medium">Uploaded</span>
                      <span className="text-slate-200 font-mono">
                        {new Date(selectedAsset.uploaded_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Copy Link Action */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Direct Asset URL
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl p-1.5">
                      <input
                        type="text"
                        readOnly
                        value={selectedAsset.file_path}
                        className="bg-transparent text-xs text-slate-300 font-mono w-full px-2 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(selectedAsset)}
                        className="px-3 py-1 rounded-lg bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold shrink-0 transition-colors"
                      >
                        {copiedId === selectedAsset.id ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Alt Text Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Image Alt Text (SEO & Accessibility)
                      </label>
                      {altSavedMsg && (
                        <span className="text-[10px] text-emerald-400 font-bold">Saved!</span>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={altTextDraft}
                      onChange={(e) => setAltTextDraft(e.target.value)}
                      placeholder="Descriptive explanation for screen readers and SEO..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#635BFF] resize-none"
                    />
                    <button
                      type="button"
                      disabled={updatingAlt}
                      onClick={handleSaveAltText}
                      className="mt-2 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors disabled:opacity-50"
                    >
                      {updatingAlt ? "Saving..." : "Update Alt Text"}
                    </button>
                  </div>

                  {/* Delete Button */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedAsset.id, selectedAsset.filename)}
                      className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <OxygenIcon name="close" className="w-3.5 h-3.5" />
                      Delete Image Permanently
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-2 border border-slate-700">
                    <OxygenIcon name="image" className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-400">No Asset Selected</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Click any image from the library grid to view details, copy its direct link, or edit its alt text.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

