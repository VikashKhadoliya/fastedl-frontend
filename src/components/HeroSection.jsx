"use client";

import FastEDLLogo from "./FastEDLLogo";
import DownloaderForm from "./DownloaderForm";
import { useTranslation } from "../context/I18nContext";

export default function HeroSection({ initialTab = "video" }) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 px-4 sm:px-6 lg:px-8 text-center bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <div className="relative max-w-4xl mx-auto flex flex-col items-center z-10">
        {/* FastEDL Prominent Brand Logo */}
        <div className="mb-5 sm:mb-7 flex items-center justify-center">
          <FastEDLLogo size="xl" />
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight leading-[1.15]">
          {t("hero.title", "Instagram Downloader")}
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto leading-relaxed font-normal">
          {t("hero.subtitle", "Save Instagram videos, reels, photos and carousel posts in a few simple steps.")}
        </p>

        {/* Main Downloader Interface */}
        <div className="w-full mt-7 sm:mt-9">
          <DownloaderForm initialTab={initialTab} />
        </div>

        {/* Hero Product Ecosystem Banner Artwork */}
        <div className="w-full mt-12 sm:mt-14">
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
