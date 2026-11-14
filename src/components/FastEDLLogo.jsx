"use client";

import FastEDLEmblem from "@/components/FastEDLEmblem";

export default function FastEDLLogo({
  size = "md",
  iconOnly = false,
  showTagline = false,
  showFullName = false,
  variant = "default",
  className = "",
}) {
  const pixelDimensions = {
    sm: 28,
    md: 36,
    lg: 44,
    xl: 52,
  };

  const currentDim = pixelDimensions[size] || pixelDimensions.md;

  const wordmarkSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const isWhite = variant === "white";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Modern Geometric Speed Emblem */}
      <FastEDLEmblem size={currentDim} isWhite={isWhite} />

      {/* Unified FastEDL Typography Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col text-left">
          <div
            className={`font-black tracking-tight leading-none ${wordmarkSizes[size] || wordmarkSizes.md} ${
              isWhite ? "text-white" : "text-[#0F172A] dark:text-[#F8FAFC]"
            }`}
          >
            Fast
            <span
              className={
                isWhite
                  ? "text-white"
                  : "text-[#635BFF] dark:text-[#8B5CF6]"
              }
            >
              EDL
            </span>
            <span
              className="inline-block rounded-full ml-1 mb-0.5 align-baseline"
              style={{
                width: size === "sm" ? "4px" : "5px",
                height: size === "sm" ? "4px" : "5px",
                backgroundColor: "#06B6D4",
              }}
            />
          </div>

          {showFullName && (
            <span
              className={`font-mono text-[9px] font-semibold tracking-wider uppercase mt-1 ${
                isWhite ? "text-white/80" : "text-[#64748B] dark:text-[#94A3B8]"
              }`}
            >
              Fast Easy Download Link
            </span>
          )}

          {showTagline && (
            <span
              className={`font-medium tracking-wide mt-0.5 text-[10px] ${
                isWhite ? "text-white/80" : "text-[#64748B] dark:text-[#94A3B8]"
              }`}
            >
              Instagram Media Downloader
            </span>
          )}
        </div>
      )}
    </div>
  );
}
