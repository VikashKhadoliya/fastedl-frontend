"use client";

import { useTranslation } from "../context/I18nContext";
import OxygenIcon from "./OxygenIcon";

export default function HowToUseSteps() {
  const { t } = useTranslation();

  const steps = [
    {
      num: "1",
      badge: t("steps.step1Badge", "Copy the link"),
      title: t("steps.step1Title", "Copy Instagram Link"),
      description: t("steps.step1Desc", "Open the Instagram app or website, locate the reel, video, or photo, and tap Share to copy its link."),
      image: "/images/fastedl-creative/02-copy-instagram-link.png",
      width: 369,
      height: 415,
      icon: "copy",
    },
    {
      num: "2",
      badge: t("steps.step2Badge", "Paste the link"),
      title: t("steps.step2Title", "Paste into FastEDL"),
      description: t("steps.step2Desc", "Open FastEDL in your browser and paste the copied Instagram URL into the input field above."),
      image: "/images/fastedl-creative/03-paste-the-link.png",
      width: 363,
      height: 415,
      icon: "paste",
    },
    {
      num: "3",
      badge: t("steps.step3Badge", "Download"),
      title: t("steps.step3Title", "Download Your Media"),
      description: t("steps.step3Desc", "Click Download to inspect the preview and save the high-definition MP4 or JPG file directly."),
      image: "/images/fastedl-creative/04-download-your-media.png",
      width: 355,
      height: 415,
      icon: "download",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Simple Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            {t("steps.title", "How to Download from Instagram")}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8]">
            {t("steps.subtitle", "Follow three quick steps to save high-definition videos, reels, and photos to your device.")}
          </p>
        </div>

        {/* 3 Large Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, idx) => {
            return (
              <div
                key={idx}
                className="group bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#635BFF]/40 transition-all duration-300 flex flex-col"
              >
                {/* Step Top Badge */}
                <div className="pt-6 px-6 flex justify-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#635BFF] shadow-sm shadow-[#635BFF]/20">
                    <OxygenIcon name={item.icon} size={16} alt={item.badge} />
                    <span>{item.badge}</span>
                  </div>
                </div>

                {/* Visual Artwork Card Container */}
                <div className="p-4 sm:p-5 pb-2">
                  <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] shadow-inner flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain object-center group-hover:scale-102 transition-transform duration-300 rounded-lg"
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 pt-3 flex-1 flex flex-col justify-between text-center">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
