"use client";

import { useState, useEffect } from "react";
import OxygenIcon from "./OxygenIcon";
import { fetchInstagramMedia } from "@/lib/api";
import { useTranslation } from "../context/I18nContext";
import MediaPreview from "./MediaPreview";

export function cleanInstagramUrl(rawInput) {
  if (!rawInput) return "";
  let cleaned = rawInput.trim().replace(/^['"<([)]+|['">)\]]+$/g, "");
  
  // Extract link if surrounded by share text
  const match = cleaned.match(/https?:\/\/[^\s]+/i);
  if (match) {
    cleaned = match[0].replace(/[.,;!?)]+$/, "");
  }
  
  // Auto-prepend https:// if missing
  if (!/^https?:\/\//i.test(cleaned)) {
    if (/^(www\.)?(instagram\.com|instagr\.am|ddinstagram\.com)/i.test(cleaned)) {
      cleaned = "https://" + cleaned;
    }
  }
  return cleaned;
}

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
          const cleaned = cleanInstagramUrl(text);
          setUrl(cleaned || text.trim());
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
    const cleaned = cleanInstagramUrl(inputUrl);
    if (!cleaned) {
      return t("form.errorEmpty", "Please enter or paste an Instagram link.");
    }

    try {
      const parsed = new URL(cleaned);
      const host = parsed.hostname.toLowerCase();
      const validHost = host.includes("instagram.com") || host.includes("instagr.am") || host.includes("ddinstagram.com");
      if (!validHost) {
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
      return t("form.errorInvalid", "Please enter a valid Instagram link.");
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const cleanedUrl = cleanInstagramUrl(url);
    const validationError = validateInput(cleanedUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Set normalized URL in input
    setUrl(cleanedUrl);

    setLoading(true);
    setLoadingStep(t("form.connecting", "Fetching media preview..."));

    try {
      await new Promise((r) => setTimeout(r, 150));
      const mediaData = await fetchInstagramMedia(cleanedUrl);
      setResult(mediaData);
    } catch (err) {
      let msg = err?.message || t("form.errorPrefix", "Unable to load media. Please ensure the link is from a public post.");
      if (
        msg.includes("Unexpected token") ||
        msg.includes("is not valid JSON") ||
        msg.includes("The page c") ||
        msg.includes("<!DOCTYPE")
      ) {
        msg = "Unable to connect to the media processing server. Please check your network connection and retry.";
      }
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div id="downloader" className="w-full max-w-3xl mx-auto">
      {/* Category Tabs: Clean Icon Navigation Buttons */}
      <div className="w-full relative mb-3 sm:mb-4 overflow-hidden">
        <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 overflow-x-auto py-1 px-1 scrollbar-none no-scrollbar touch-pan-x">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                aria-label={tab.label}
                className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center cursor-pointer shrink-0 shadow-xs transition-colors duration-150 ${
                  isActive
                    ? "bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25 border border-[#635BFF]"
                    : "bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#635BFF]/40"
                }`}
              >
                <OxygenIcon name={tab.icon} size={18} alt={tab.label} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form Container - Compact, clean, and mobile-first */}
      <div className="w-full bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-lg sm:shadow-xl p-2.5 sm:p-3.5 transition-all">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          {/* Input Box with Adaptive In-Input & Below-Input Actions */}
          <div className="relative flex-1 w-full min-w-0">
            {/* Search/Link Icon */}
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[#94A3B8]">
              <OxygenIcon name="search" size={17} alt="Search" />
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
              className="w-full pl-10 pr-10 sm:pr-36 py-3 sm:py-3.5 text-base sm:text-sm md:text-base text-[#0F172A] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl sm:rounded-2xl placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#635BFF] focus:ring-3 focus:ring-[#635BFF]/15 transition-all truncate"
            />

            {/* Clear Input Button: Always easily accessible when URL is present */}
            {url && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-2 sm:right-32 flex items-center justify-center w-7 h-7 my-auto rounded-lg text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Clear input"
                aria-label="Clear input"
              >
                <OxygenIcon name="close" size={13} alt="Clear" />
              </button>
            )}

            {/* Desktop-only: In-input Paste Button (Clean, no text overlap on wide screens) */}
            <button
              type="button"
              onClick={handlePaste}
              disabled={loading}
              className="hidden sm:inline-flex absolute inset-y-0 right-1.5 my-auto h-9 items-center gap-1.5 px-3 rounded-xl text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/20 active:scale-95 transition-all cursor-pointer"
            >
              <OxygenIcon name="paste" size={14} alt="Paste" />
              <span>{t("form.pasteLink", "Paste Link")}</span>
            </button>
          </div>

          {/* Mobile Action Sub-bar: Dedicated Paste Link + Format Indicator (Visible < sm) */}
          <div className="flex sm:hidden items-center justify-between px-1 pt-0.5 pb-0.5">
            <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] font-medium">
              Reels &bull; Posts &bull; Stories &bull; Slides
            </span>
            <button
              type="button"
              onClick={handlePaste}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 active:bg-[#635BFF]/30 transition-colors cursor-pointer"
            >
              <OxygenIcon name="paste" size={13} alt="Paste" />
              <span>{t("form.pasteLink", "Paste Link")}</span>
            </button>
          </div>

          {/* Primary CTA Button: Download */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[140px] h-12 sm:h-[48px] px-6 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-[0.98] shadow-md shadow-[#635BFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
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
          <div className="mt-2.5 pt-2.5 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center gap-2 text-xs text-[#635BFF] dark:text-[#8B5CF6] font-medium">
            <OxygenIcon name="refresh" size={14} className="animate-spin" alt="Loading" />
            <span>{loadingStep || t("form.connecting", "Fetching media preview...")}</span>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-2.5 text-xs sm:text-sm">
            <OxygenIcon name="close" size={15} className="mt-0.5 shrink-0" alt="Error" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{t("form.errorPrefix", "Unable to load media")}</p>
              <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300 leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-0.5 cursor-pointer shrink-0"
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
