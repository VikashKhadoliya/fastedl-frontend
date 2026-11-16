"use client";

import { useState, useRef, useEffect } from "react";
import OxygenIcon from "./OxygenIcon";
import AnimatedDownloadIcon from "./AnimatedDownloadIcon";
import DownloadProgressCard from "./DownloadProgressCard";
import { buildDownloadProxyUrl, buildDownloadMp3ProxyUrl } from "@/lib/api";
import { downloadMediaWithProgress } from "@/lib/downloadStream";
import { useTranslation } from "../context/I18nContext";

export default function MediaPreview({ data, activeTab = "video", onReset }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [selectedQualityBySlide, setSelectedQualityBySlide] = useState({});
  const [selectedBitrate, setSelectedBitrate] = useState(192);
  const [downloadState, setDownloadState] = useState("idle"); // 'idle' | 'preparing' | 'downloading' | 'completed' | 'failed'
  const [downloadProgress, setDownloadProgress] = useState({
    receivedBytes: 0,
    totalBytes: 0,
    percent: 0,
    speed: 0,
    remainingSeconds: null,
    indeterminate: false,
    qualityLabel: "",
    filename: ""
  });
  const [downloadError, setDownloadError] = useState(null);
  const [currentProxyUrl, setCurrentProxyUrl] = useState("");
  const abortControllerRef = useRef(null);
  const { t } = useTranslation();

  // Cleanup active stream on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // When changing slides, if state is completed or failed, return to idle
  useEffect(() => {
    if (downloadState === "completed" || downloadState === "failed") {
      setDownloadState("idle");
      setDownloadError(null);
    }
  }, [activeSlide]);

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const isCarousel = data.type === "carousel" && data.items.length > 1;
  const isViewer = data.type === "viewer";
  const currentItem = isCarousel ? data.items[activeSlide] : data.items[0];

  // Video qualities resolution logic
  const isVideo = currentItem.type === "video";
  const availableQualities = isVideo && currentItem.qualities && currentItem.qualities.length > 0
    ? currentItem.qualities
    : null;

  const currentQuality = availableQualities
    ? availableQualities.find((q) => q.id === selectedQualityBySlide[activeSlide]) || availableQualities[0]
    : null;

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setDownloadState("idle");
    setDownloadingIndex(null);
  };

  const handleDownload = async (item, idx) => {
    setDownloadingIndex(idx);
    setDownloadError(null);
    setDownloadState("preparing");

    const downloadUrl = (isVideo && currentQuality && currentQuality.download_url)
      ? currentQuality.download_url
      : item.download_url;

    const audioUrl = (isVideo && currentQuality && currentQuality.audio_url)
      ? currentQuality.audio_url
      : null;

    const qualityLabel = isVideo && currentQuality ? currentQuality.label : (item.dimensions_label || "Original HD");
    const formatId = isVideo && currentQuality ? (currentQuality.format_id || currentQuality.id) : null;

    let targetFilename = item.filename || "fastedl_download";
    if (isVideo && currentQuality && currentQuality.id && targetFilename) {
      const extIdx = targetFilename.lastIndexOf(".");
      if (extIdx !== -1) {
        targetFilename = `${targetFilename.slice(0, extIdx)}_${currentQuality.id}${targetFilename.slice(extIdx)}`;
      } else {
        targetFilename = `${targetFilename}_${currentQuality.id}.mp4`;
      }
    } else if (!targetFilename.includes(".")) {
      targetFilename = `${targetFilename}.${isVideo ? "mp4" : "jpg"}`;
    }

    const proxyUrl = buildDownloadProxyUrl(downloadUrl, targetFilename, audioUrl, qualityLabel, formatId);
    setCurrentProxyUrl(proxyUrl);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await downloadMediaWithProgress({
        url: proxyUrl,
        filename: targetFilename,
        qualityLabel,
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
        setDownloadError(err.message || "Failed to download media.");
        setDownloadState("failed");
      }
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleDownloadMp3 = async (item, bitrate = 192) => {
    if (!item) return;
    setDownloadingIndex("mp3");
    setDownloadError(null);
    setDownloadState("preparing");

    const sourceAudio = item.audio_url || item.download_url;
    const shortcode = data.shortcode || "audio";
    const targetFilename = `fastedl_${shortcode}_${bitrate}k.mp3`;
    const proxyUrl = buildDownloadMp3ProxyUrl(sourceAudio, targetFilename, bitrate, false);
    setCurrentProxyUrl(proxyUrl);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await downloadMediaWithProgress({
        url: proxyUrl,
        filename: targetFilename,
        qualityLabel: `${bitrate} kbps MP3 Audio`,
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
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleDownloadAll = async () => {
    if (!data.items || data.items.length === 0) return;
    setDownloadingIndex("all");
    setDownloadError(null);
    setDownloadState("preparing");

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      for (let i = 0; i < data.items.length; i++) {
        if (controller.signal.aborted) break;

        const itm = data.items[i];
        const isItmVid = itm.type === "video";
        const itmQualities = isItmVid && itm.qualities && itm.qualities.length > 0 ? itm.qualities : null;
        const q = itmQualities
          ? (itmQualities.find((x) => x.id === selectedQualityBySlide[i]) || itmQualities[0])
          : null;

        const dlUrl = (isItmVid && q && q.download_url) ? q.download_url : itm.download_url;
        const aUrl = (isItmVid && q && q.audio_url) ? q.audio_url : null;
        const qLbl = isItmVid && q ? q.label : (itm.dimensions_label || "Original HD");
        const fId = isItmVid && q ? (q.format_id || q.id) : null;

        let targetFn = itm.filename || `fastedl_slide_${i + 1}.${isItmVid ? "mp4" : "jpg"}`;
        if (isItmVid && q && q.id && targetFn) {
          const extIdx = targetFn.lastIndexOf(".");
          if (extIdx !== -1) {
            targetFn = `${targetFn.slice(0, extIdx)}_${q.id}${targetFn.slice(extIdx)}`;
          }
        }

        const proxyUrl = buildDownloadProxyUrl(dlUrl, targetFn, aUrl, qLbl, fId);
        setCurrentProxyUrl(proxyUrl);

        await downloadMediaWithProgress({
          url: proxyUrl,
          filename: targetFn,
          qualityLabel: `Slide ${i + 1} of ${data.items.length}`,
          signal: controller.signal,
          onStateChange: (state, errMsg) => {
            if (state === "failed" && errMsg) {
              setDownloadError(errMsg);
            }
          },
          onProgress: (prog) => {
            setDownloadProgress(prog);
          }
        });

        if (i < data.items.length - 1) {
          await new Promise((r) => setTimeout(r, 600));
        }
      }

      setDownloadState("completed");
    } catch (err) {
      if (controller.signal.aborted) {
        setDownloadState("idle");
      } else {
        setDownloadError(err.message || "Failed to download slides.");
        setDownloadState("failed");
      }
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] shadow-xl overflow-hidden mt-4 sm:mt-6 transition-all text-left">
      {/* Top Banner / Metadata */}
      <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center shrink-0">
            <OxygenIcon name={isVideo ? "video" : isCarousel ? "carousel" : "photo"} size={16} alt="Media" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] truncate">
              {isVideo ? "Instagram Video" : isCarousel ? "Instagram Carousel" : "Instagram Photo"}
            </div>
            {(data.timestamp || (data.likes !== null && data.likes !== undefined)) && (
              <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                {data.timestamp && (
                  <span>{new Date(data.timestamp).toLocaleDateString()}</span>
                )}
                {data.likes !== null && data.likes !== undefined && (
                  <span>{data.timestamp ? "• " : ""}{data.likes.toLocaleString()} likes</span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] transition-colors cursor-pointer shrink-0"
        >
          <OxygenIcon name="refresh" size={13} alt="Reset" />
          <span className="hidden xs:inline">{t("preview.tryAnotherLink", "Try Another Link")}</span>
          <span className="xs:hidden">Reset</span>
        </button>
      </div>

      {/* Error Alert if download failed */}
      {downloadError && (
        <div className="mx-3.5 sm:mx-5 mt-3 sm:mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <OxygenIcon name="dialog-warning" size={14} className="text-red-500 shrink-0" />
            <span>{downloadError}</span>
          </div>
          <button
            onClick={() => setDownloadError(null)}
            className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Body: Preview & Download Actions */}
      <div className="p-3.5 sm:p-5 flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: Media Player / Image Viewer */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-sm mx-auto aspect-[4/5] sm:aspect-square bg-[#0F172A] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
            {currentItem.type === "video" ? (
              <video
                key={currentQuality?.download_url || currentItem.download_url}
                controls
                playsInline
                poster={currentItem.thumbnail_url}
                className="w-full h-full object-contain"
              >
                <source src={currentQuality?.download_url || currentItem.download_url} type="video/mp4" />
                Your browser does not support HTML5 video preview.
              </video>
            ) : (
              <img
                key={currentItem.download_url}
                src={currentItem.thumbnail_url || currentItem.download_url}
                alt="Media preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            )}

            {/* Carousel navigation overlay */}
            {isCarousel && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : data.items.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <OxygenIcon name="arrow-left" size={14} alt="Prev" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev < data.items.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <OxygenIcon name="arrow-right" size={14} alt="Next" />
                </button>
                <div className="absolute bottom-2.5 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[11px] font-medium">
                  {activeSlide + 1} / {data.items.length}
                </div>
              </>
            )}
          </div>

          {/* Carousel thumbnails */}
          {isCarousel && (
            <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 max-w-sm overflow-x-auto py-1 px-1 no-scrollbar">
              {data.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`relative flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeSlide === idx
                    ? "border-[#635BFF] ring-2 ring-[#635BFF]/30 scale-105"
                    : "border-[#E2E8F0] dark:border-[#334155] opacity-60 hover:opacity-100"
                    }`}
                >
                  <img
                    src={item.thumbnail_url || item.download_url}
                    alt={`Slide ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <OxygenIcon name="video" size={12} alt="Video" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Profile Viewer Stats & Recent Posts */}
          {isViewer && (
            <div className="w-full max-w-sm mt-4 border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {data.followers ? Number(data.followers).toLocaleString() : "—"}
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Followers</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {data.following ? Number(data.following).toLocaleString() : "—"}
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Following</div>
                </div>
                <div className="p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {data.media_count ? Number(data.media_count).toLocaleString() : "—"}
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Posts</div>
                </div>
              </div>

              {data.recent_posts && data.recent_posts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-2 flex items-center gap-1.5">
                    <OxygenIcon name="carousel" size={13} alt="Posts" />
                    <span>Recent Posts</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5">
                    {data.recent_posts.map((post, pIdx) => (
                      <div key={pIdx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={post.thumbnail_url}
                          alt="Post thumbnail"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Download Buttons & Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Caption / Bio Section */}
            {data.full_caption && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                <p className="font-semibold text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  {isViewer ? "Bio" : "Caption"}
                </p>
                <p className="whitespace-pre-line leading-relaxed text-xs">
                  {showFullCaption
                    ? data.full_caption
                    : data.caption || data.full_caption.slice(0, 140)}
                </p>
                {data.full_caption.length > 140 && (
                  <button
                    onClick={() => setShowFullCaption(!showFullCaption)}
                    className="text-[11px] font-medium text-[#635BFF] dark:text-[#8B5CF6] hover:underline mt-1 cursor-pointer"
                  >
                    {showFullCaption ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Media Details & Dynamic Quality Selector Panel */}
            <div className="p-3 sm:p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC]/70 dark:bg-[#0F172A]/70 text-xs text-[#64748B] dark:text-[#94A3B8] space-y-2.5">
              {/* Media Format */}
              <div className="flex items-center justify-between">
                <span>Format:</span>
                <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {isVideo ? "MP4 Video" : "JPG Image"}
                </span>
              </div>

              {/* Dimensions / Resolutions Display */}
              <div className="flex items-center justify-between">
                <span>{isVideo ? "Resolution:" : "Dimensions:"}</span>
                <span className="font-mono text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {isVideo
                    ? (currentQuality?.resolution || currentItem.dimensions_label || currentItem.resolution || "Original")
                    : (currentItem.dimensions_label || (currentItem.width && currentItem.height ? `${currentItem.width} × ${currentItem.height} px` : "Original HD"))}
                </span>
              </div>

              {/* Dynamic Video Quality Selector */}
              {isVideo && (
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Quality Options:</span>
                    <span className="text-[11px] font-bold text-[#06B6D4]">
                      {currentQuality?.label || "Original HD"}
                    </span>
                  </div>

                  {availableQualities && availableQualities.length > 1 ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
                      {availableQualities.map((q) => {
                        const isSelected = (currentQuality?.id === q.id);
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setSelectedQualityBySlide((prev) => ({ ...prev, [activeSlide]: q.id }))}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${isSelected
                              ? "bg-[#635BFF] text-white border-[#635BFF] shadow-xs shadow-[#635BFF]/30 font-bold"
                              : "bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:border-[#635BFF]/50 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
                              }`}
                          >
                            <span className="truncate">{q.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0 ml-1">
                              {q.filesize_formatted && (
                                <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#94A3B8] dark:text-[#64748B]"}`}>
                                  {q.filesize_formatted}
                                </span>
                              )}
                              {isSelected ? (
                                <OxygenIcon name="check" size={12} className="shrink-0" alt="Selected" />
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B] dark:text-[#94A3B8]">Quality:</span>
                        <span className="font-bold text-[#635BFF] dark:text-[#8B5CF6] flex items-center gap-1">
                          <OxygenIcon name="check" size={12} alt="Verified" />
                          {currentQuality?.label || currentItem.dimensions_label || "Original HD"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 pt-1 border-t border-[#E2E8F0] dark:border-[#334155]/60">
                        <OxygenIcon name="check" size={12} className="text-[#06B6D4] shrink-0" alt="Info" />
                        <span>Only original source quality is available for this video.</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Photo High Resolution Notice */}
              {!isVideo && (
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
                  <span>Image Quality:</span>
                  <span className="font-semibold text-[#635BFF] dark:text-[#8B5CF6] flex items-center gap-1">
                    <OxygenIcon name="check" size={12} alt="Original" />
                    Original High Resolution
                  </span>
                </div>
              )}

              {/* MP3 Audio Track Options & In-Browser Audio Player */}
              {(isVideo || currentItem.audio_url) && (
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                      <OxygenIcon name="multimedia" size={14} alt="Audio" />
                      <span>Audio Track (MP3)</span>
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-[#0F172A] p-0.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                      {[128, 192, 320].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBitrate(b)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                            selectedBitrate === b
                              ? "bg-[#635BFF] text-white"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {b}k
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Preview Stream Player */}
                  <audio
                    controls
                    preload="none"
                    src={buildDownloadMp3ProxyUrl(currentItem.audio_url || currentItem.download_url, "preview", 128, true)}
                    className="w-full h-8 accent-[#635BFF]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="space-y-2.5 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
            {/* If actively downloading, preparing, completed, or failed: Show Live Real-Time Download Progress Card */}
            {downloadState !== "idle" ? (
              <DownloadProgressCard
                state={downloadState}
                progress={downloadProgress}
                error={downloadError}
                isVideo={downloadingIndex !== "mp3" && isVideo}
                directUrl={currentProxyUrl}
                onCancel={handleCancelDownload}
                onRetry={() => (downloadingIndex === "mp3" ? handleDownloadMp3(currentItem, selectedBitrate) : handleDownload(currentItem, activeSlide))}
                onReset={() => setDownloadState("idle")}
              />
            ) : (
              <>
                {/* When activeTab is MP3: Primary button is Download MP3 */}
                {activeTab === "mp3" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDownloadMp3(currentItem, selectedBitrate)}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#635BFF]/20"
                    >
                      <AnimatedDownloadIcon state="idle" size={17} />
                      <span>Download MP3 Audio ({selectedBitrate} kbps)</span>
                    </button>
                    {isVideo && (
                      <button
                        type="button"
                        onClick={() => handleDownload(currentItem, activeSlide)}
                        className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/20 border border-[#635BFF]/25 transition-colors cursor-pointer"
                      >
                        <OxygenIcon name="video" size={15} alt="Video" />
                        <span>Download Full Video ({currentQuality?.label || "MP4"})</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {/* Standard Mode: Primary Video / Photo download button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(currentItem, activeSlide)}
                      className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-98 transition-all cursor-pointer shadow-md shadow-[#635BFF]/20"
                    >
                      <AnimatedDownloadIcon state="idle" size={17} />
                      <span>
                        {isVideo
                          ? `Download Video (${currentQuality?.label || "MP4"})`
                          : isCarousel
                          ? `Download Photo (Slide ${activeSlide + 1} of ${data.items.length})`
                          : currentItem.dimensions_label
                          ? `Download Photo (${currentItem.dimensions_label})`
                          : t("preview.downloadPhoto", "Download Photo")}
                      </span>
                    </button>

                    {/* Prominent MP3 Audio Download Button for any Video/Reel */}
                    {(isVideo || currentItem.audio_url) && (
                      <button
                        type="button"
                        onClick={() => handleDownloadMp3(currentItem, selectedBitrate)}
                        className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/25 border border-[#635BFF]/30 active:scale-98 transition-colors cursor-pointer shadow-xs"
                      >
                        <OxygenIcon name="multimedia" size={15} alt="MP3" />
                        <span>Download MP3 Audio ({selectedBitrate} kbps)</span>
                      </button>
                    )}
                  </>
                )}
              </>
            )}

            {/* If Carousel and Idle: Download All button */}
            {isCarousel && downloadState === "idle" && (
              <button
                type="button"
                onClick={handleDownloadAll}
                className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 dark:bg-[#635BFF]/20 hover:bg-[#635BFF]/20 border border-[#635BFF]/25 transition-colors cursor-pointer"
              >
                <OxygenIcon name="carousel" size={16} alt="All Slides" />
                <span>Download All ({data.items.length} items)</span>
              </button>
            )}

            {/* Direct Link */}
            <a
              href={(isVideo && currentQuality && currentQuality.download_url) ? currentQuality.download_url : currentItem.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors"
            >
              <OxygenIcon name="arrow-right" size={13} alt="Open" />
              <span>Open Source URL</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
