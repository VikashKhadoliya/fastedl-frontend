"use client";

import { useState, useEffect } from "react";
import OxygenIcon from "./OxygenIcon";
import { fetchInstagramMedia } from "@/lib/api";
import { useTranslation } from "../context/I18nContext";
import MediaPreview from "./MediaPreview";

export default function DownloaderForm({ initialTab = "video" }) {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: "video", label: t("tabs.video", "Video"), icon: "video" },
    { id: "photo", label: t("tabs.photo", "Photo"), icon: "photo" },
    { id: "reels", label: t("tabs.reels", "Reels"), icon: "reels" },
    { id: "story", label: t("tabs.story", "Story"), icon: "story" },
    { id: "igtv", label: t("tabs.igtv", "IGTV"), icon: "igtv" },
    { id: "carousel", label: t("tabs.carousel", "Carousel"), icon: "carousel" },
    { id: "viewer", label: t("tabs.viewer", "Viewer"), icon: "viewer" },
  ];

  const handlePaste = async () => {
    setError(null);
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
        }
      } else {
        setError(t("form.errorEmpty", "Please enter or paste an Instagram link."));
      }
    } catch (err) {
      setError(t("form.errorEmpty", "Please enter or paste an Instagram link."));
    }
  };

  const handleClear = () => {
    setUrl("");
    setError(null);
    setResult(null);
  };

  const validateInput = (inputUrl) => {
    if (!inputUrl || !inputUrl.trim()) {
      return t("form.errorEmpty", "Please enter or paste an Instagram link.");
    }

    try {
      const parsed = new URL(inputUrl.trim());
      const host = parsed.hostname.toLowerCase();
      if (!host.includes("instagram.com")) {
        return t("form.errorInvalid", "Please provide a valid Instagram link (e.g. instagram.com/reel/...).");
      }
      
      const path = parsed.pathname.trim();
      const isPostOrReelOrTv = path.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
      const isStory = path.match(/\/stories\/([A-Za-z0-9_.-]+)/i);
      const isProfile = path.match(/^\/([A-Za-z0-9_.-]{1,30})\/?$/i);

      if (!isPostOrReelOrTv && !isStory && !isProfile) {
        return t("form.errorInvalid", "Please provide a valid Instagram post, reel, story, or profile link.");
      }
    } catch (e) {
      return t("form.errorInvalid", "Please enter a valid URL starting with https://");
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const validationError = validateInput(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setLoadingStep(t("form.connecting", "Fetching media preview..."));

    try {
      await new Promise((r) => setTimeout(r, 150));
      const mediaData = await fetchInstagramMedia(url.trim());
      setResult(mediaData);
    } catch (err) {
      setError(err.message || t("form.errorPrefix", "Unable to load media. Please ensure the link is from a public post."));
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div id="downloader" className="w-full max-w-3xl mx-auto">
      {/* Category Tabs: Clean Segmented Bar */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto py-1 px-1 scrollbar-none no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25 font-bold"
                  : "bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]"
              }`}
            >
              <OxygenIcon name={tab.icon} size={16} alt={tab.label} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Input Form Container */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-xl p-3 sm:p-4 transition-all">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          {/* Input Box with Paste & Clear */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
              <OxygenIcon name="search" size={18} alt="Search" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder={t("form.placeholder", "Paste your Instagram link here")}
              disabled={loading}
              className="w-full pl-11 pr-36 sm:pr-40 py-3.5 sm:py-4 text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl sm:rounded-2xl placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#635BFF] focus:ring-4 focus:ring-[#635BFF]/15 transition-all"
            />

            {/* Inner actions: Clear & Paste */}
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
              {url && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer"
                  title="Clear input"
                  aria-label="Clear input"
                >
                  <OxygenIcon name="close" size={14} alt="Clear" />
                </button>
              )}
              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/20 transition-colors cursor-pointer"
              >
                <OxygenIcon name="paste" size={14} alt="Paste" />
                <span>{t("form.pasteLink", "Paste Link")}</span>
              </button>
            </div>
          </div>

          {/* Primary CTA Button: Download */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[145px] px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-98 shadow-md shadow-[#635BFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <>
                <OxygenIcon name="refresh" size={18} className="animate-spin" alt="Loading" />
                <span>{t("form.loading", "Loading...")}</span>
              </>
            ) : (
              <>
                <OxygenIcon name="download" size={18} alt="Download" />
                <span>{t("form.download", "Download")}</span>
              </>
            )}
          </button>
        </form>

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center gap-2 text-xs text-[#635BFF] dark:text-[#8B5CF6] font-medium">
            <OxygenIcon name="refresh" size={14} className="animate-spin" alt="Loading" />
            <span>{loadingStep || t("form.connecting", "Fetching media preview...")}</span>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="mt-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs sm:text-sm">
            <OxygenIcon name="close" size={16} className="mt-0.5 shrink-0" alt="Error" />
            <div className="flex-1">
              <p className="font-semibold">{t("form.errorPrefix", "Unable to load media")}</p>
              <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-0.5 cursor-pointer"
              aria-label="Dismiss alert"
            >
              <OxygenIcon name="close" size={12} alt="Dismiss" />
            </button>
          </div>
        )}
      </div>

      {/* Media Preview Result */}
      {result && (
        <MediaPreview data={result} onReset={handleClear} />
      )}
    </div>
  );
}
