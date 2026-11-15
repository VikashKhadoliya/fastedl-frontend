"use client";

import Link from "next/link";
import OxygenIcon from "./OxygenIcon";
import { useTranslation } from "../context/I18nContext";

export default function FeatureShowcase() {
  const { t } = useTranslation();

  const showcases = [
    {
      id: "video",
      icon: "video",
      title: "Instagram Video Downloader",
      badge: "MP4 Feed Videos",
      description:
        "Download standard public Instagram feed videos and clips in original MP4 resolution. Save videos directly to your phone, tablet, or desktop with no added watermarks or quality compression.",
      link: "/video",
      action: "Download Videos",
      image: "/images/fastedl-creative/05-video-downloader.png",
      width: 369,
      height: 160,
      reversed: false,
    },
    {
      id: "photo",
      icon: "image",
      title: "Instagram Photo Downloader",
      badge: "High-Res JPEG",
      description:
        "Access high-resolution JPEG photographs from public posts and single image uploads. FastEDL extracts the original uncompressed image file directly from the content delivery network.",
      link: "/photo",
      action: "Download Photos",
      image: "/images/fastedl-creative/06-photo-downloader.png",
      width: 363,
      height: 160,
      reversed: true,
    },
    {
      id: "reels",
      icon: "reels",
      title: "Instagram Reels Downloader",
      badge: "Vertical 9:16 Format",
      description:
        "Save public vertical Instagram Reels with crystal-clear synchronized audio. Enjoy your favorite comedy sketches, educational reels, fitness tutorials, and trending clips completely offline.",
      link: "/reels",
      action: "Download Reels",
      image: "/images/fastedl-creative/07-reels-downloader.png",
      width: 355,
      height: 160,
      reversed: false,
    },
    {
      id: "story",
      icon: "story",
      title: "Instagram Story Saver",
      badge: "24-Hour Ephemeral Media",
      description:
        "Save active public stories from creators before they disappear at the 24-hour mark. View and archive full-quality story photos and short video clips without leaving traces.",
      link: "/story",
      action: "Save Stories",
      image: "/images/fastedl-creative/08-story-downloader.png",
      width: 369,
      height: 170,
      reversed: true,
    },
    {
      id: "igtv",
      icon: "igtv",
      title: "Instagram IGTV Downloader",
      badge: "Long-Form Video",
      description:
        "Download long-format IGTV broadcasts, series episodes, and interviews directly to your phone or desktop. Watch lengthy videos offline during flights or commutes without buffering.",
      link: "/igtv",
      action: "Download IGTV",
      image: "/images/fastedl-creative/09-igtv-downloader.png",
      width: 363,
      height: 170,
      reversed: false,
    },
    {
      id: "carousel",
      icon: "carousel",
      title: "Carousel / Album Downloader",
      badge: "Multi-Item Slide Posts",
      description:
        "Download multiple photos and videos from album carousel posts. FastEDL extracts each slide so you can review individual items or download the entire collection with a single click.",
      link: "/carousel",
      action: "Download Carousel",
      image: "/images/fastedl-creative/10-carousel-downloader.png",
      width: 355,
      height: 170,
      reversed: true,
    },
  ];

  return (
    <section id="showcase" className="w-full py-10 sm:py-20 bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Media Format Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Comprehensive Instagram Media Tools
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8]">
            Explore tailored download solutions for every format published on Instagram.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-12">
          {showcases.map((item) => (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl border border-[#E2E8F0] dark:border-[#334155] p-4 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#635BFF]/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${
                item.reversed ? "lg:grid-flow-dense" : ""
              }`}
            >
              {/* Text Description Column */}
              <div className={`lg:col-span-7 flex flex-col justify-center ${item.reversed ? "lg:col-start-6" : ""}`}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] dark:bg-[#635BFF]/20 mb-3 self-start">
                  <OxygenIcon name={item.icon} size={14} alt={item.badge} />
                  <span>{item.badge}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-6">
                  {item.description}
                </p>
                <div>
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] shadow-xs shadow-[#635BFF]/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{item.action}</span>
                    <OxygenIcon name="arrow-right" size={14} alt="Go" />
                  </Link>
                </div>
              </div>

              {/* Visual Artwork Column */}
              <div className={`lg:col-span-5 flex items-center justify-center ${item.reversed ? "lg:col-start-1" : ""}`}>
                <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A] p-3 sm:p-4 border border-[#E2E8F0] dark:border-[#334155] shadow-sm hover:shadow-md transition-all duration-300 group/card flex items-center justify-center">
                  <div className="w-full rounded-xl overflow-hidden shadow-sm border border-white dark:border-[#1E293B] bg-white dark:bg-[#1E293B] flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain transform group-hover/card:scale-102 transition-transform duration-300"
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
