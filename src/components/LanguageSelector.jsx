"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../context/I18nContext";
import OxygenIcon from "./OxygenIcon";

export default function LanguageSelector({ className = "", isMobile = false }) {
  const { locale, setLocale, languages, currentLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredLanguages = languages.filter((lang) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    );
  });

  const handleSelect = (code) => {
    setLocale(code);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1.5 h-9 w-9 sm:w-auto px-0 sm:px-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/60 transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#635BFF]/30 active:scale-95"
        title={t("nav.selectLanguage", "Language")}
        aria-label={t("nav.selectLanguage", "Language")}
        aria-expanded={isOpen}
      >
        <OxygenIcon name="globe" size={15} alt="Language" />
        <span className="hidden sm:inline uppercase text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8]">
          {currentLanguage.code}
        </span>
        <span className={`hidden sm:flex items-center transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <OxygenIcon name="arrow-down" size={11} alt="Toggle" />
        </span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobile ? "left-0 right-0" : "right-0"
          } mt-2 w-72 max-w-[85vw] rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150`}
        >
          {/* Header & Search */}
          <div className="p-2.5 border-b border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]">
            <div className="relative flex items-center">
              <span className="absolute left-2.5 pointer-events-none text-[#64748B]">
                <OxygenIcon name="search" size={13} alt="Search" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:border-[#635BFF]"
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white p-0.5 cursor-pointer"
                >
                  <OxygenIcon name="close" size={12} alt="Clear" />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto py-1 px-1 scrollbar-thin">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
                No language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === locale;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                      isSelected
                        ? "bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-[#8B5CF6] font-bold"
                        : "text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <div className="font-semibold">{lang.nativeName}</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">{lang.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {lang.dir === "rtl" && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                          RTL
                        </span>
                      )}
                      {isSelected && (
                        <OxygenIcon name="check" size={14} alt="Selected" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
