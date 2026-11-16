"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import FastEDLLogo from "./FastEDLLogo";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import OxygenIcon from "./OxygenIcon";
import { useTranslation } from "../context/I18nContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [libraryDropdownOpen, setLibraryDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const downloadTools = [
    { name: "Video Downloader", href: "/instagram-video-downloader", icon: "video-x-generic", desc: "Full HD 1080p MP4 with sound" },
    { name: "Reels Downloader", href: "/instagram-reels-downloader", icon: "media-playlist", desc: "Shorts & vertical reels saver" },
    { name: "Reel to MP3", href: "/instagram-reel-to-mp3", icon: "audio", desc: "Extract audio tracks in 192k/320k MP3" },
    { name: "Photo Downloader", href: "/instagram-photo-downloader", icon: "image-x-generic", desc: "Original high-res JPG images" },
    { name: "Carousel Downloader", href: "/instagram-carousel-downloader", icon: "view-media-album-cover", desc: "Batch download all slides" },
    { name: "Story Downloader", href: "/instagram-story-downloader", icon: "chronometer", desc: "Stories & highlights anonymously" },
  ];

  const contentLibrary = [
    { name: "Instagram Captions", href: "/instagram-captions", icon: "text-editor", desc: "Mood, Attitude, Love, Travel & 10+ categories" },
    { name: "Instagram Hashtags", href: "/instagram-hashtags", icon: "help-contents", desc: "Targeted tags for Fashion, Travel & Niche" },
    { name: "Instagram Bio Ideas", href: "/instagram-bio-ideas", icon: "favorite", desc: "Boys, Girls, VIP & Aesthetic bios" },
    { name: "Content & Reel Ideas", href: "/instagram-ideas", icon: "applications-system", desc: "Reel concepts, post ideas & story prompts" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".nav-dropdown")) {
        setDownloadDropdownOpen(false);
        setLibraryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155] transition-colors duration-200 pt-safe px-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* FastEDL Brand Logo - Single clean responsive component */}
          <Link href="/" className="flex items-center group shrink-0">
            <FastEDLLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Download Tools Dropdown */}
            <div className="relative nav-dropdown">
              <button
                type="button"
                onClick={() => {
                  setDownloadDropdownOpen(!downloadDropdownOpen);
                  setLibraryDropdownOpen(false);
                }}
                onMouseEnter={() => setDownloadDropdownOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors duration-150 py-2 cursor-pointer"
              >
                <span>Download Tools</span>
                <span className={`text-[10px] transition-transform ${downloadDropdownOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {downloadDropdownOpen && (
                <div
                  onMouseLeave={() => setDownloadDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-72 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  {downloadTools.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setDownloadDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#635BFF]/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                        <OxygenIcon name={t.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Content Library Dropdown */}
            <div className="relative nav-dropdown">
              <button
                type="button"
                onClick={() => {
                  setLibraryDropdownOpen(!libraryDropdownOpen);
                  setDownloadDropdownOpen(false);
                }}
                onMouseEnter={() => setLibraryDropdownOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors duration-150 py-2 cursor-pointer"
              >
                <span>Content Library</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-[#06B6D4] text-[9px] font-black border border-cyan-500/20">NEW</span>
                <span className={`text-[10px] transition-transform ${libraryDropdownOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {libraryDropdownOpen && (
                <div
                  onMouseLeave={() => setLibraryDropdownOpen(false)}
                  className="absolute left-0 mt-1 w-80 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  {contentLibrary.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setLibraryDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-[#06B6D4] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#06B6D4] group-hover:text-white transition-colors">
                        <OxygenIcon name={t.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/guides"
              className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors duration-150"
            >
              Guides
            </Link>

            <Link
              href="/#faq"
              className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors duration-150"
            >
              FAQ
            </Link>

            <Link
              href="/about"
              className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors duration-150"
            >
              About
            </Link>
          </nav>

          {/* Right Actions: Theme Toggle, Language Selector, and Download CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            <ThemeToggle />
            <LanguageSelector />

            <Link
              href="/#downloader"
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] rounded-xl shadow-xs shadow-[#635BFF]/20 transition-all duration-150 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <OxygenIcon name="download" size={15} alt="Download" />
              <span>{t("nav.download", "Download")}</span>
            </Link>
          </div>

          {/* Mobile Right Bar (Theme + Lang + Hamburger) */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <ThemeToggle />
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] focus:outline-none cursor-pointer active:scale-95 transition-transform"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <OxygenIcon name={mobileMenuOpen ? "close" : "menu"} size={16} alt="Menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E8F0] dark:border-[#334155] bg-white/98 dark:bg-[#0F172A]/98 backdrop-blur-md px-3.5 pt-3 pb-6 pb-safe shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="space-y-4 mb-5">
            {/* Download Tools */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2 mb-2">
                Download Tools
              </span>
              <div className="grid grid-cols-1 gap-1">
                {downloadTools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#635BFF]/10 text-primary flex items-center justify-center shrink-0">
                      <OxygenIcon name={t.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Content Library */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2 mb-2">
                Content Library
              </span>
              <div className="grid grid-cols-1 gap-1">
                {contentLibrary.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-[#06B6D4] flex items-center justify-center shrink-0">
                      <OxygenIcon name={t.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{t.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* General Navigation Links */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <Link
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
              >
                Guides
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-primary transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/#downloader"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] shadow-md shadow-[#635BFF]/25 active:scale-98 transition-all"
          >
            <OxygenIcon name="download" size={16} alt="Download" />
            <span>{t("nav.download", "Download Media")}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
