"use client";

import Link from "next/link";
import FastEDLLogo from "./FastEDLLogo";
import DownloaderForm from "./DownloaderForm";
import OxygenIcon from "./OxygenIcon";
import { useTranslation } from "../context/I18nContext";

export default function HeroSection({ initialTab = "video" }) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-14 sm:pb-18 px-3.5 sm:px-6 lg:px-8 text-center bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <div className="relative max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* FastEDL Brand Logo - Single prominent component */}
        <div className="mb-2 sm:mb-3 flex items-center justify-center">
          <FastEDLLogo size="xl" />
        </div>

        {/* Reel to MP3 Announcement Badge */}
        <Link
          href="/instagram-reel-to-mp3"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 mb-2.5 sm:mb-3 rounded-full text-xs font-bold bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] hover:bg-[#635BFF]/20 border border-[#635BFF]/20 transition-all shadow-xs group cursor-pointer"
        >
          <OxygenIcon name="multimedia" size={14} alt="MP3" />
          <span>New: Instagram Reel to MP3 Downloader</span>
          <OxygenIcon name="arrow-right" size={11} className="group-hover:translate-x-0.5 transition-transform" alt="Go" />
        </Link>

        {/* Main Heading with clamp() fluid scaling */}
        <h1 className="text-[clamp(1.75rem,5.5vw,3.5rem)] font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.18] max-w-3xl mx-auto">
          {t("hero.title", "Instagram Downloader")}
        </h1>

        {/* Optimized Subtitle */}
        <p className="mt-2 sm:mt-3 text-xs sm:text-base text-[#64748B] dark:text-[#94A3B8] max-w-sm sm:max-w-xl mx-auto leading-relaxed font-normal">
          {t("hero.subtitle", "Save Instagram videos, reels, photos and carousel posts in a few simple steps.")}
        </p>

        {/* Main Downloader Interface */}
        <div className="w-full mt-4 sm:mt-8">
          <DownloaderForm initialTab={initialTab} />
        </div>

        {/* Hero Product Ecosystem Banner Artwork */}
        <div className="w-full mt-8 sm:mt-14">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E2E8F0] dark:border-[#334155] shadow-xl bg-white dark:bg-[#1E293B] p-2 sm:p-3 transition-all duration-300">
            <img
              src="/images/fastedl-creative/01-hero-banner.png"
              alt="FastEDL - Instagram Downloader Multi-Device Ecosystem"
              className="w-full h-auto object-cover object-center rounded-xl sm:rounded-2xl"
              width={1169}
              height={380}
              priority="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
