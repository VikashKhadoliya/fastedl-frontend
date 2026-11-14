export default function ReelDLLogo({ 
  size = "md", 
  showTagline = false,
  showWordmark = true,
  className = "" 
}) {
  const iconSizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-14 h-14 rounded-2xl",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  const taglineSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem */}
      <div 
        className={`${iconSizes[size] || iconSizes.md} bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-500/25 flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Reel accents */}
          <circle cx="10" cy="10" r="2" fill="#ffffff" fillOpacity="0.4" />
          <circle cx="38" cy="10" r="2" fill="#ffffff" fillOpacity="0.4" />
          <circle cx="10" cy="38" r="2" fill="#ffffff" fillOpacity="0.4" />
          <circle cx="38" cy="38" r="2" fill="#ffffff" fillOpacity="0.4" />

          {/* Download Arrow */}
          <line
            x1="24"
            y1="12"
            x2="24"
            y2="28"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M17 21.5 L24 28.5 L31 21.5"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Base plate */}
          <path
            d="M14 34 C14 34 18 35.5 24 35.5 C30 35.5 34 34 34 34"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark and Tagline */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className={`font-black tracking-tight leading-none text-slate-900 ${textSizes[size] || textSizes.md}`}>
            Reel<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500">DL</span>
          </div>
          {showTagline && (
            <span className={`font-semibold tracking-wider text-slate-500 uppercase mt-1 ${taglineSizes[size] || taglineSizes.md}`}>
              Download. Save. Enjoy.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

