"use client";

import AnimatedDownloadIcon from "./AnimatedDownloadIcon";
import OxygenIcon from "./OxygenIcon";
import { formatBytes, formatSpeed, formatETA } from "@/lib/downloadStream";

export default function DownloadProgressCard({
  state = "idle",
  progress = {},
  error = null,
  isVideo = true,
  onCancel,
  onRetry,
  onReset,
  directUrl
}) {
  if (state === "idle") {
    return null;
  }

  const {
    receivedBytes = 0,
    totalBytes = 0,
    percent = 0,
    speed = 0,
    remainingSeconds = null,
    indeterminate = false,
    qualityLabel = "",
    filename = "fastedl_download"
  } = progress;

  const titleText = (() => {
    switch (state) {
      case "preparing":
        return isVideo ? "Preparing video stream..." : "Preparing photo download...";
      case "downloading":
        return isVideo ? "Downloading your video..." : "Downloading your photo...";
      case "completed":
        return "Download completed successfully";
      case "failed":
        return "Download failed";
      default:
        return "Processing download...";
    }
  })();

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] p-3.5 sm:p-4 shadow-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
    >
      {/* Top Row: Animated Icon + Title + Quality Badge + Percentage / Status */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <AnimatedDownloadIcon state={state} size={22} />
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate leading-tight">
              {titleText}
            </h4>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5 font-mono">
              {filename} {qualityLabel ? `• ${qualityLabel}` : ""}
            </p>
          </div>
        </div>

        {/* Live Percentage or State Indicator */}
        <div className="text-right shrink-0">
          {state === "preparing" && (
            <span className="text-xs font-semibold text-[#635BFF] dark:text-[#8B5CF6] animate-pulse">
              Connecting...
            </span>
          )}

          {state === "downloading" && (
            <div className="flex items-baseline gap-1">
              {indeterminate ? (
                <span className="text-xs font-bold text-[#06B6D4] font-mono">
                  Streaming
                </span>
              ) : (
                <span className="text-sm sm:text-base font-black font-mono text-[#635BFF] dark:text-[#8B5CF6]">
                  {percent}%
                </span>
              )}
            </div>
          )}

          {state === "completed" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <OxygenIcon name="check" size={13} alt="Done" />
              <span>Saved</span>
            </span>
          )}

          {state === "failed" && (
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              Error
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative mb-2.5">
        <div
          className={`h-full rounded-full transition-all duration-150 ease-out ${
            state === "completed"
              ? "bg-emerald-500 w-full"
              : state === "failed"
              ? "bg-rose-500 w-full"
              : state === "preparing" || indeterminate
              ? "w-full bg-gradient-to-r from-[#635BFF] via-[#06B6D4] to-[#635BFF] bg-[length:200%_100%] animate-pulse"
              : "bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#06B6D4]"
          }`}
          style={{
            width:
              state === "downloading" && !indeterminate
                ? `${Math.max(3, Math.min(100, percent))}%`
                : undefined,
          }}
        />
      </div>

      {/* Live Stream Telemetry Metrics: Size | Speed | ETA */}
      {state === "downloading" && (
        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
          {/* Downloaded / Total Size */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-sans font-semibold">Size:</span>
            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {formatBytes(receivedBytes)}
              {totalBytes > 0 ? ` / ${formatBytes(totalBytes)}` : ""}
            </span>
          </div>

          {/* Transfer Speed */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-sans font-semibold">Speed:</span>
            <span className="font-semibold text-[#635BFF] dark:text-[#8B5CF6]">
              {formatSpeed(speed)}
            </span>
          </div>

          {/* ETA */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-sans font-semibold">ETA:</span>
            <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              {formatETA(remainingSeconds)}
            </span>
          </div>
        </div>
      )}

      {/* Completed Success Action Bar */}
      {state === "completed" && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate mr-2">
            Downloaded <strong className="text-[#0F172A] dark:text-[#F8FAFC] font-mono">{formatBytes(receivedBytes || totalBytes)}</strong> to device.
          </div>
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-95 transition-all cursor-pointer shrink-0 shadow-xs"
          >
            Download Again
          </button>
        </div>
      )}

      {/* Failed Error Message & Retry Action Bar */}
      {state === "failed" && (
        <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
          <p className="text-xs text-rose-700 dark:text-rose-300 mb-2 leading-relaxed">
            {error || "Unable to complete stream download. Please try again."}
          </p>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <OxygenIcon name="refresh" size={12} alt="Retry" />
              <span>Retry Download</span>
            </button>
            {directUrl && (
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#635BFF] dark:text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
              >
                <span>Direct Download</span>
                <OxygenIcon name="arrow-right" size={11} alt="Go" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Cancel Action while downloading or preparing */}
      {(state === "downloading" || state === "preparing") && onCancel && (
        <div className="flex justify-end pt-1.5 mt-1 border-t border-slate-200/40 dark:border-slate-800/40">
          <button
            type="button"
            onClick={onCancel}
            className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            Cancel Download
          </button>
        </div>
      )}
    </div>
  );
}
