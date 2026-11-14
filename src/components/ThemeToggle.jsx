"use client";

import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/I18nContext";
import OxygenIcon from "./OxygenIcon";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { t } = useTranslation();

  const isDark = theme === "dark";
  const label = isDark ? t("nav.lightMode", "Switch to Light Mode") : t("nav.darkMode", "Switch to Dark Mode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30 active:scale-95 ${
        isDark
          ? "bg-[#1E293B] text-amber-300 border-[#334155] hover:bg-[#334155]/60 hover:text-amber-200"
          : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#635BFF] hover:border-[#635BFF]/40"
      } ${className}`}
      title={label}
      aria-label={label}
    >
      {mounted ? (
        isDark ? (
          <OxygenIcon name="sun" size={18} alt="Light Mode" className="transition-transform duration-200" />
        ) : (
          <OxygenIcon name="moon" size={18} alt="Dark Mode" className="transition-transform duration-200" />
        )
      ) : (
        <span className="w-4 h-4" />
      )}
    </button>
  );
}
