"use client";

/**
 * Premium Animated Download Icon for FastEDL
 * Pure SVG with fluid hardware-accelerated animations reflecting real download states.
 */
export default function AnimatedDownloadIcon({ state = "idle", size = 20, className = "" }) {
  if (state === "preparing") {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          className="animate-spin text-[#635BFF] dark:text-[#8B5CF6]"
          viewBox="0 0 24 24"
          fill="none"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (state === "downloading") {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width={size}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#635BFF] dark:text-[#8B5CF6]"
        >
          {/* Base download tray */}
          <path
            d="M4 17V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V17"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          />
          {/* Animated vertical arrow downward motion */}
          <g className="animate-bounce">
            <path
              d="M12 3V15M12 15L7.5 10.5M12 15L16.5 10.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width={Math.round(size * 0.75)}
          height={Math.round(size * 0.75)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 13L9.5 17.5L19 7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-rose-500/15 text-rose-500 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width={Math.round(size * 0.75)}
          height={Math.round(size * 0.75)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // Idle default icon
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 4V15M12 15L7.5 10.5M12 15L16.5 10.5M4 18V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
