"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OxygenIcon from "./OxygenIcon";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("fastedl_cookie_consent");
      if (!consent) {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage access restricted (e.g. strict incognito)
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("fastedl_cookie_consent", "accepted");
    } catch {}
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("fastedl_cookie_consent", "essential_only");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] dark:border-[#334155] shadow-2xl shadow-black/10 text-[#0F172A] dark:text-[#F8FAFC]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#635BFF] text-white flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
            <OxygenIcon name="security" size={18} alt="Security" />
          </div>

          <div className="flex-1 pr-1">
            <h3 className="text-sm font-bold tracking-tight">
              Privacy &amp; Cookie Notice
            </h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              FastEDL uses cookies and lightweight analytics to ensure site reliability, measure traffic, and serve non-intrusive ads. Learn more in our{" "}
              <Link
                href="/privacy-policy"
                className="text-[#635BFF] dark:text-[#8B5CF6] underline font-semibold hover:opacity-80"
              >
                Privacy Policy
              </Link>.
            </p>

            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] rounded-xl shadow-xs shadow-[#635BFF]/20 transition-transform active:scale-95 cursor-pointer"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="px-3 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] rounded-xl transition-colors cursor-pointer"
              >
                Essential Only
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDecline}
            aria-label="Dismiss cookie notice"
            className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <OxygenIcon name="close" size={14} alt="Close" />
          </button>
        </div>
      </div>
    </aside>
  );
}
