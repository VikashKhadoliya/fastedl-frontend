"use client";

import { useState, useRef, useEffect } from "react";
import OxygenIcon from "./OxygenIcon";
import AnimatedDownloadIcon from "./AnimatedDownloadIcon";
import DownloadProgressCard from "./DownloadProgressCard";
import { cleanInstagramUrl } from "./DownloaderForm";
import { fetchInstagramMedia, buildDownloadMp3ProxyUrl } from "@/lib/api";
import { downloadMediaWithProgress, formatBytes } from "@/lib/downloadStream";
import Link from "next/link";

export default function ReelToMp3Form() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [selectedBitrate, setSelectedBitrate] = useState(192); // 128, 192 (default), 320

  // Download state & progress tracking
  const [downloadState, setDownloadState] = useState("idle"); // 'idle' | 'preparing' | 'downloading' | 'completed' | 'failed'
  const [downloadProgress, setDownloadProgress] = useState({
    receivedBytes: 0,
    totalBytes: 0,
    percent: 0,
    speed: 0,
    remainingSeconds: null,
    indeterminate: false,
    qualityLabel: "192 kbps MP3",
    filename: ""
  });
  const [downloadError, setDownloadError] = useState(null);
  const [currentProxyUrl, setCurrentProxyUrl] = useState("");
  const abortControllerRef = useRef(null);
  const audioRef = useRef(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
        setError("Please enter or paste an Instagram Reel link.");
      }
    } catch (_) {
      setError("Please enter or paste an Instagram Reel link.");
    }
  };

  const handleClear = () => {
    setUrl("");
    setError(null);
    setMediaData(null);
    setDownloadState("idle");
    setDownloadError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const validateInput = (inputUrl) => {
    const cleaned = cleanInstagramUrl(inputUrl);
    if (!cleaned) {
      return "Please enter or paste an Instagram Reel link.";
    }

    try {
      const parsed = new URL(cleaned);
      const host = parsed.hostname.toLowerCase();
      const validHost =
        host.includes("instagram.com") ||
        host.includes("instagr.am") ||
        host.includes("ddinstagram.com");
      if (!validHost) {
        return "Please provide a valid Instagram link (e.g. instagram.com/reel/...).";
      }

      const path = parsed.pathname.trim();
      const isReelOrPost = path.match(/\/(reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
      if (!isReelOrPost) {
        return "Please provide a valid Instagram Reel or video URL.";
      }
    } catch (_) {
      return "Please enter a valid Instagram Reel link.";
    }
    return null;
  };

  const handleFetch = async (e) => {
    e.preventDefault();
    setError(null);
    setMediaData(null);
    setDownloadState("idle");

    const cleanedUrl = cleanInstagramUrl(url);
    const validationError = validateInput(cleanedUrl);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUrl(cleanedUrl);
    setLoading(true);
    setLoadingStep("Connecting to Instagram & extracting audio stream...");

    try {
      await new Promise((r) => setTimeout(r, 150));
      const data = await fetchInstagramMedia(cleanedUrl);

      // Verify that this post has audio or video content
      const firstItem = data?.items?.[0];
      if (!firstItem) {
        throw new Error("Unable to locate media streams for this Instagram Reel.");
      }
      if (firstItem.type !== "video" && !firstItem.audio_url) {
        throw new Error("This Instagram post does not contain a video or audio track.");
      }

      setMediaData(data);
    } catch (err) {
      let msg = err?.message || "Unable to extract audio. Please ensure the Reel is from a public post.";
      if (
        msg.includes("Unexpected token") ||
        msg.includes("is not valid JSON") ||
        msg.includes("<!DOCTYPE")
      ) {
        msg = "Media processing server is currently unreachable. Please check connection and retry.";
      }
      setError(msg);
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  // Trigger MP3 Conversion & Stream Download with Real-Time Progress
  const handleDownloadMp3 = async () => {
    if (!mediaData || !mediaData.items || mediaData.items.length === 0) return;

    const item = mediaData.items[0];
    const shortcode = mediaData.shortcode || "reel";
    // Prefer direct audio stream or progressive video stream with audio track
    const sourceAudioUrl = item.audio_url || item.download_url;

    if (!sourceAudioUrl) {
      setError("No audio stream available for this Reel.");
      return;
    }

    const targetFilename = `fastedl_audio_${shortcode}_${selectedBitrate}k.mp3`;
    const proxyUrl = buildDownloadMp3ProxyUrl(sourceAudioUrl, targetFilename, selectedBitrate, false);
    setCurrentProxyUrl(proxyUrl);

    setDownloadState("preparing");
    setDownloadError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await downloadMediaWithProgress({
        url: proxyUrl,
        filename: targetFilename,
        qualityLabel: `${selectedBitrate} kbps MP3`,
        signal: controller.signal,
        onStateChange: (state, errMsg) => {
          setDownloadState(state);
          if (errMsg) setDownloadError(errMsg);
        },
        onProgress: (prog) => {
          setDownloadProgress(prog);
        }
      });
    } catch (err) {
      if (controller.signal.aborted) {
        setDownloadState("idle");
      } else {
        setDownloadError(err.message || "Failed to convert and download MP3.");
        setDownloadState("failed");
      }
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setDownloadState("idle");
  };

  const currentItem = mediaData?.items?.[0];
  const audioSourceUrl = currentItem ? (currentItem.audio_url || currentItem.download_url) : null;
  const audioPreviewUrl = audioSourceUrl ? buildDownloadMp3ProxyUrl(audioSourceUrl, "preview_audio", 128, true) : null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Downloader Input Card */}
      <div className="w-full bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-lg sm:shadow-xl p-2.5 sm:p-3.5 transition-all">
        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          {/* Input Box */}
          <div className="relative flex-1 w-full min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[#94A3B8]">
              <OxygenIcon name="media-playlist" size={17} alt="Audio" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste Instagram Reel link here (e.g. instagram.com/reel/...)"
              disabled={loading}
              className="w-full pl-10 pr-10 sm:pr-36 py-3 sm:py-3.5 text-base sm:text-sm md:text-base text-[#0F172A] dark:text-[#F8FAFC] bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl sm:rounded-2xl placeholder:text-[#94A3B8] focus:outline-none focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#635BFF] focus:ring-3 focus:ring-[#635BFF]/15 transition-all truncate"
            />

            {/* Clear Input Button */}
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

            {/* Desktop-only Paste Button */}
            <button
              type="button"
              onClick={handlePaste}
              disabled={loading}
              className="hidden sm:inline-flex absolute inset-y-0 right-1.5 my-auto h-9 items-center gap-1.5 px-3 rounded-xl text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/20 active:scale-95 transition-all cursor-pointer"
            >
              <OxygenIcon name="paste" size={14} alt="Paste" />
              <span>Paste Link</span>
            </button>
          </div>

          {/* Mobile Action Sub-bar */}
          <div className="flex sm:hidden items-center justify-between px-1 pt-0.5 pb-0.5">
            <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] font-medium">
              128 kbps &bull; 192 kbps &bull; 320 kbps MP3
            </span>
            <button
              type="button"
              onClick={handlePaste}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 active:bg-[#635BFF]/30 transition-colors cursor-pointer"
            >
              <OxygenIcon name="paste" size={13} alt="Paste" />
              <span>Paste Link</span>
            </button>
          </div>

          {/* Primary Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto min-w-[150px] h-12 sm:h-[48px] px-6 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-[0.98] shadow-md shadow-[#635BFF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <OxygenIcon name="refresh" size={18} className="animate-spin" alt="Loading" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <OxygenIcon name="download" size={18} alt="Download" />
                <span>Convert to MP3</span>
              </>
            )}
          </button>
        </form>

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-2.5 pt-2.5 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center gap-2 text-xs text-[#635BFF] dark:text-[#8B5CF6] font-medium">
            <OxygenIcon name="refresh" size={14} className="animate-spin" alt="Loading" />
            <span>{loadingStep || "Extracting audio from Instagram Reel..."}</span>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start gap-2.5 text-xs sm:text-sm">
            <OxygenIcon name="close" size={15} className="mt-0.5 shrink-0" alt="Error" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Unable to process Reel audio</p>
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

      {/* Media & Audio Result Card */}
      {mediaData && currentItem && (
        <div className="w-full bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-xl overflow-hidden mt-6 transition-all text-left animate-in fade-in slide-in-from-bottom-2">
          {/* Card Header Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
              <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                Audio Extracted Successfully
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
            >
              Convert Another Reel
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Reel Details Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Reel Artwork Thumbnail */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
                <img
                  src={currentItem.thumbnail_url || "/og-image.svg"}
                  alt="Reel thumbnail"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-mono font-bold text-white bg-black/50 px-1.5 py-0.5 rounded">
                    {currentItem.video_duration ? `${Math.round(currentItem.video_duration)}s` : "Reel Audio"}
                  </span>
                </div>
              </div>

              {/* Creator Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] text-[11px] font-bold uppercase tracking-wider">
                    Instagram Reel
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] line-clamp-2 leading-snug">
                  {mediaData.caption || "Instagram Reel Original Audio Track"}
                </h3>

                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Format: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">MP3 (Stereo 44.1 kHz)</strong> &bull; Codec: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">libmp3lame</strong>
                </p>
              </div>
            </div>

            {/* Audio Preview Player */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                  <OxygenIcon name="audio" size={14} alt="Audio" />
                  <span>Audio Preview</span>
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  Listen before downloading
                </span>
              </div>

              {audioPreviewUrl ? (
                <audio
                  ref={audioRef}
                  controls
                  preload="metadata"
                  src={audioPreviewUrl}
                  className="w-full h-10 mt-1 accent-[#635BFF]"
                >
                  Your browser does not support HTML5 audio playback.
                </audio>
              ) : (
                <div className="p-3 text-xs text-slate-500 text-center">
                  Preview playback is not available for this stream. You can still download the full MP3 file below.
                </div>
              )}
            </div>

            {/* Bitrate Selection Chips */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2 uppercase tracking-wider">
                Select Audio Bitrate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { bitrate: 128, label: "128 kbps", desc: "Standard Audio", note: "Compact file" },
                  { bitrate: 192, label: "192 kbps", desc: "High Quality", note: "Recommended", recommended: true },
                  { bitrate: 320, label: "320 kbps", desc: "Studio Quality", note: "Maximum clarity" },
                ].map((tier) => {
                  const isSelected = selectedBitrate === tier.bitrate;
                  return (
                    <button
                      key={tier.bitrate}
                      type="button"
                      onClick={() => setSelectedBitrate(tier.bitrate)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#635BFF] text-white border-[#635BFF] shadow-md shadow-[#635BFF]/20"
                          : "bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] border-[#E2E8F0] dark:border-[#334155] hover:border-[#635BFF]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{tier.label}</span>
                        {tier.recommended && (
                          <span
                            className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full ${
                              isSelected ? "bg-white/20 text-white" : "bg-[#635BFF]/10 text-[#635BFF]"
                            }`}
                          >
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] opacity-80">
                        {tier.desc} &bull; {tier.note}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Download Progress / Action Area */}
            <div className="pt-2">
              {downloadState !== "idle" ? (
                <DownloadProgressCard
                  state={downloadState}
                  progress={downloadProgress}
                  error={downloadError}
                  isVideo={false}
                  directUrl={currentProxyUrl}
                  onCancel={handleCancelDownload}
                  onRetry={handleDownloadMp3}
                  onReset={() => setDownloadState("idle")}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleDownloadMp3}
                  className="w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#635BFF]/25 cursor-pointer"
                >
                  <AnimatedDownloadIcon state="idle" size={18} />
                  <span>Download MP3 ({selectedBitrate} kbps)</span>
                </button>
              )}
            </div>

            {/* Helpful Conversion Notice & Video Shortcut */}
            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <span>
                Files are encoded using FFmpeg LAME at {selectedBitrate} kbps with standard ID3 tags.
              </span>
              <Link
                href="/instagram-reels-downloader"
                className="font-semibold text-[#635BFF] dark:text-[#8B5CF6] hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Download Video (1080p MP4) instead</span>
                <OxygenIcon name="arrow-right" size={11} alt=">" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
