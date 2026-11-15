"use client";

import { useTranslation } from "../context/I18nContext";
import OxygenIcon from "./OxygenIcon";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t("benefits.fastTitle", "Fast Processing"),
      description: t("benefits.fastDesc", "Directly queries public media streams to deliver your download links within seconds."),
      icon: "speed",
    },
    {
      title: t("benefits.qualityTitle", "Original Quality"),
      description: t("benefits.qualityDesc", "Preserves the original 1080p video bitrate and high-resolution JPEG clarity without compression."),
      icon: "download",
    },
    {
      title: t("benefits.deviceTitle", "Universal Device Support"),
      description: t("benefits.deviceDesc", "Runs smoothly on iOS Safari, Android Chrome, and desktop browsers without installing apps."),
      icon: "devices",
    },
    {
      title: t("benefits.secureTitle", "Safe & Private"),
      description: t("benefits.secureDesc", "No Instagram password, authentication tokens, or account credentials required."),
      icon: "security",
    },
  ];

  return (
    <section id="features" className="w-full py-10 sm:py-20 bg-white dark:bg-[#0F172A] border-y border-[#E2E8F0] dark:border-[#334155] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Why Choose FastEDL
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Built for Speed and Reliability
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8]">
            An intuitive media tool engineered to make saving Instagram content effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl sm:rounded-3xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:border-[#635BFF]/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center mb-4 shadow-xs">
                    <OxygenIcon name={item.icon} size={24} alt={item.title} />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
