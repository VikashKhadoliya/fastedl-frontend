"use client";

import { useState } from "react";
import OxygenIcon from "./OxygenIcon";
import { useTranslation } from "../context/I18nContext";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();

  const faqs = [
    {
      q: t("faq.q1", "How do I download an Instagram video?"),
      a: t("faq.a1", "Copy the share link of any public Instagram video, paste it into the input box above, and click Download. Once the preview loads, click Download Video to save the file.")
    },
    {
      q: t("faq.q2", "Can I download Instagram Reels?"),
      a: t("faq.a2", "Yes. Paste the link of any public Instagram Reel to preview and save the vertical MP4 video with synchronized audio.")
    },
    {
      q: t("faq.q3", "Can I download carousel posts?"),
      a: t("faq.a3", "Yes. When you enter a carousel link, FastEDL displays each photo and video slide so you can download them individually or all at once.")
    },
    {
      q: t("faq.q4", "Where are downloaded files saved?"),
      a: t("faq.a4", "Files are saved to your device's default download folder, camera roll on iPhone, or browser downloads library on PC and Mac.")
    },
    {
      q: t("faq.q5", "Why is my link not working?"),
      a: t("faq.a5", "Make sure the link is from a public account and copied in full. Content from private profiles cannot be retrieved.")
    }
  ];

  return (
    <section id="faq" className="w-full max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
          Got Questions?
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
          {t("faq.title", "Frequently Asked Questions")}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8]">
          {t("faq.subtitle", "Common questions about downloading Instagram media with FastEDL.")}
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <OxygenIcon name="arrow-down" size={14} alt="Toggle" />
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-0 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed border-t border-[#E2E8F0] dark:border-[#334155]">
                  <div className="pt-3">{faq.a}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
