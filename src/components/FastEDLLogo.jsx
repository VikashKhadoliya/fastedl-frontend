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
    xl: 56,
    "2xl": 68,
  };

  const currentDim = pixelDimensions[size] || pixelDimensions.md;

  const wordmarkSizes = {
    sm: "text-base",
    md: "text-lg sm:text-xl",
    lg: "text-xl sm:text-2xl",
    xl: "text-2xl sm:text-4xl",
    "2xl": "text-3xl sm:text-5xl",
  };

  const dotSizes = {
    sm: "4px",
    md: "5px",
    lg: "6px",
    xl: "7px",
    "2xl": "9px",
  };

  const gapSizes = {
    sm: "gap-2",
    md: "gap-2.5",
    lg: "gap-3",
    xl: "gap-3.5",
    "2xl": "gap-4",
  };

  const isWhite = variant === "white";

  return (
    <div className={`inline-flex items-center ${gapSizes[size] || "gap-2.5"} ${className}`}>
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
                width: dotSizes[size] || "5px",
                height: dotSizes[size] || "5px",
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
