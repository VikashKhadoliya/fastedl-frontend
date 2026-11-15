"use client";

import Link from "next/link";
import FastEDLLogo from "./FastEDLLogo";
import { useTranslation } from "../context/I18nContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const toolLinks = [
    { label: "Instagram Video Downloader", href: "/instagram-video-downloader" },
    { label: "Instagram Reels Downloader", href: "/instagram-reels-downloader" },
    { label: "Instagram Photo Downloader", href: "/instagram-photo-downloader" },
    { label: "Instagram Carousel Downloader", href: "/instagram-carousel-downloader" },
    { label: "Instagram Story Saver", href: "/instagram-story-downloader" },
  ];

  const libraryLinks = [
    { label: "Instagram Captions Hub", href: "/instagram-captions" },
    { label: "Mood Captions", href: "/instagram-captions/mood-instagram-captions" },
    { label: "Attitude Captions", href: "/instagram-captions/attitude-captions" },
    { label: "Travel Captions", href: "/instagram-captions/travel-captions" },
    { label: "Instagram Hashtags Directory", href: "/instagram-hashtags" },
    { label: "Instagram Bio Ideas", href: "/instagram-bio-ideas" },
    { label: "Boys Instagram Bios", href: "/instagram-bio-ideas/boys-instagram-bio" },
    { label: "Content & Reel Ideas", href: "/instagram-ideas" },
  ];

  const platformLinks = [
    { label: "Creator Guides Hub", href: "/guides" },
    { label: "Step-by-Step Tutorial", href: "/how-to-use" },
    { label: "Android Downloader", href: "/instagram-downloader-android" },
    { label: "iPhone & iPad Guide", href: "/instagram-downloader-iphone" },
    { label: "PC & Mac Downloader", href: "/instagram-downloader-pc" },
  ];

  const legalLinks = [
    { label: "About FastEDL", href: "/about" },
    { label: "Contact & Support", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "DMCA Policy", href: "/dmca" },
    { label: "Admin Portal", href: "/admin/login" },
  ];

  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#334155] mt-auto text-[#64748B] dark:text-[#94A3B8] transition-colors duration-200 pb-safe px-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 pb-10 border-b border-[#E2E8F0] dark:border-[#334155]">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <FastEDLLogo size="md" />
            </Link>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
              Fast Easy Download Link. High-speed media extraction, curated Instagram content library and educational guides. Download. Create. Grow.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] dark:bg-[#635BFF]/20 text-[11px] font-semibold">
              <span>Fast &bull; Private &bull; 100% Free</span>
            </div>
          </div>

          {/* Download Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-3">
              Download Tools
            </h3>
            <ul className="space-y-2 text-xs">
              {toolLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Library */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-3">
              Content Library
            </h3>
            <ul className="space-y-2 text-xs">
              {libraryLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides & Platforms */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-3">
              Guides &amp; Help
            </h3>
            <ul className="space-y-2 text-xs">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC] mb-3">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-2 text-xs">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] gap-3 text-center sm:text-left">
          <div>
            <p>&copy; {currentYear} FastEDL (Fast Easy Download Link). All rights reserved.</p>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Icons by{" "}
              <a
                href="https://github.com/KDE/oxygen-icons"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#635BFF] dark:hover:text-[#8B5CF6]"
              >
                KDE Oxygen Icons
              </a>{" "}
              (GNU LGPL v3).
            </p>
          </div>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] max-w-md">
            Independent software tool. FastEDL is not affiliated with or endorsed by Instagram or Meta Platforms, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
