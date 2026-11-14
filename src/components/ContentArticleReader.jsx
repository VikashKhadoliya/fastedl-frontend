"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContentArticleReader({
  article,
  related = [],
  sectionKey = "instagram-captions",
  sectionLabel = "Instagram Captions",
  sectionBaseUrl = "/instagram-captions"
}) {
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState("");
  const [copiedKey, setCopiedKey] = useState(null);
  const [copiedGroupKey, setCopiedGroupKey] = useState(null);
  const [parsedSections, setParsedSections] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    if (!article || !article.content) return;

    // Parse the HTML content into structured sections for Later.com editorial reading experience
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = article.content;

    const headings = [];
    const sections = [];
    let currentSection = {
      id: "intro",
      title: "Introduction",
      paragraphs: [],
      captionGroups: []
    };

    const childNodes = Array.from(tempDiv.children);

    childNodes.forEach((node, idx) => {
      if (node.tagName.toLowerCase() === "h2") {
        if (currentSection.paragraphs.length > 0 || currentSection.captionGroups.length > 0) {
          sections.push(currentSection);
        }
        const text = node.textContent.trim();
        const id = `section-${headings.length}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        headings.push({ id, text });
        currentSection = {
          id,
          title: text,
          paragraphs: [],
          captionGroups: []
        };
      } else if (
        node.classList?.contains("caption-group") ||
        (node.tagName.toLowerCase() === "ul" && !node.classList?.contains("normal-list"))
      ) {
        // Caption list group
        const groupTitle = node.getAttribute("data-title") || currentSection.title || "Captions";
        const items = Array.from(node.querySelectorAll("li")).map((li) => li.textContent.trim());
        if (items.length > 0) {
          currentSection.captionGroups.push({
            groupTitle,
            items
          });
        }
      } else {
        // Regular HTML element (p, h3, blockquote, etc.)
        currentSection.paragraphs.push(node.outerHTML);
      }
    });

    if (currentSection.paragraphs.length > 0 || currentSection.captionGroups.length > 0) {
      sections.push(currentSection);
    }

    setToc(headings);
    setParsedSections(sections);
  }, [article]);

  // ScrollSpy for Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveHeading(toc[i].id);
          return;
        }
      }
      if (toc.length > 0) {
        setActiveHeading(toc[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handleCopySingle = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyGroup = (items, groupKey) => {
    const combined = items.join("\n\n");
    navigator.clipboard.writeText(combined);
    setCopiedGroupKey(groupKey);
    setTimeout(() => setCopiedGroupKey(null), 2200);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <OxygenIcon name="go-home" className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <Link href={sectionBaseUrl} className="hover:text-primary transition-colors">
            {sectionLabel}
          </Link>
          <span>/</span>
          <span className="text-primary font-medium truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* 3-Column Editorial Grid (Later.com Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: Table of Contents (Sticky on Desktop)       */}
          {/* ======================================================== */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <OxygenIcon name="format-list-ordered" className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Table of Contents
                </h3>
              </div>

              {toc.length > 0 ? (
                <nav className="space-y-1.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
                  {toc.map((item) => {
                    const isActive = activeHeading === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-all text-xs leading-snug line-clamp-2 ${
                          isActive
                            ? "bg-primary/10 text-primary font-bold border-l-2 border-primary"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {item.text}
                      </button>
                    );
                  })}
                </nav>
              ) : (
                <div className="text-xs text-slate-400 italic">Sections list will appear here...</div>
              )}
            </div>

            {/* Quick FastEDL Downloader Access */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#635BFF]/10 via-[#8B5CF6]/10 to-[#06B6D4]/10 border border-[#635BFF]/20">
              <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center mb-2.5 shadow-sm">
                <OxygenIcon name="download" className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white mb-1">
                Download Instagram Posts
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Save HD videos, Reels & carousels directly with original sound.
              </p>
              <Link
                href="/#downloader"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover"
              >
                Open Downloader &rarr;
              </Link>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* CENTER: Main Editorial Article Content                   */}
          {/* ======================================================== */}
          <article className="lg:col-span-6 w-full bg-white dark:bg-[#1E293B] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header Metadata */}
            <header className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link
                  href={`${sectionBaseUrl}?cat=${article.category}`}
                  className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                >
                  {article.category?.replace("-", " ") || "Editorial"}
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                  <OxygenIcon name="chronometer" className="w-3.5 h-3.5" />
                  {article.read_time || "5 min read"}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Updated {article.updated_at ? article.updated_at.slice(0, 10) : article.created_at?.slice(0, 10)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {article.excerpt}
                </p>
              )}

              {/* Author Row */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#635BFF]/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  FE
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {article.author || "FastEDL Editorial Team"}
                  </span>
                  <span className="text-slate-400 text-[11px]">Curated & verified for Instagram</span>
                </div>
              </div>
            </header>

            {/* Mobile Table of Contents Accordion */}
            {toc.length > 0 && (
              <div className="lg:hidden mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <details className="text-xs group">
                  <summary className="font-bold text-slate-900 dark:text-white cursor-pointer flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <OxygenIcon name="format-list-ordered" className="w-4 h-4 text-primary" />
                      Table of Contents ({toc.length} sections)
                    </span>
                    <span className="text-slate-400 text-xs transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <nav className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                    {toc.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className="block w-full text-left py-1 text-slate-600 dark:text-slate-300 hover:text-primary"
                      >
                        {item.text}
                      </button>
                    ))}
                  </nav>
                </details>
              </div>
            )}

            {/* Main Content Body with Later.com Structured Caption Cards */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
              {parsedSections.map((sec, secIdx) => (
                <section key={secIdx} id={sec.id} className="scroll-mt-24 space-y-4">
                  {sec.title && sec.id !== "intro" && (
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-4 pb-1 border-b border-slate-100 dark:border-slate-800">
                      {sec.title}
                    </h2>
                  )}

                  {/* Prose Paragraphs */}
                  {sec.paragraphs.map((pMarkup, pIdx) => (
                    <div key={pIdx} dangerouslySetInnerHTML={{ __html: pMarkup }} />
                  ))}

                  {/* Curated Caption Groups (Interactive Cards with Copy & Copy All) */}
                  {sec.captionGroups.map((group, gIdx) => {
                    const groupKey = `${sec.id}-group-${gIdx}`;
                    const isGroupCopied = copiedGroupKey === groupKey;

                    return (
                      <div
                        key={gIdx}
                        className="my-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs"
                      >
                        {/* Group Header Bar with Copy All Button */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <OxygenIcon name="text-editor" className="w-3.5 h-3.5 text-primary" />
                            {group.groupTitle} ({group.items.length})
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyGroup(group.items, groupKey)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
                              isGroupCopied
                                ? "bg-emerald-600 text-white"
                                : "bg-[#635BFF] hover:bg-[#5248EE] text-white"
                            }`}
                          >
                            <OxygenIcon name={isGroupCopied ? "dialog-ok-apply" : "edit-copy"} className="w-3.5 h-3.5" />
                            {isGroupCopied ? "Copied All!" : "Copy All"}
                          </button>
                        </div>

                        {/* List of Individual Caption Cards */}
                        <div className="space-y-2">
                          {group.items.map((captionText, cIdx) => {
                            const itemKey = `${groupKey}-item-${cIdx}`;
                            const isSingleCopied = copiedKey === itemKey;

                            return (
                              <div
                                key={cIdx}
                                className="group flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 hover:border-primary/50 transition-all"
                              >
                                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 select-all leading-relaxed">
                                  {captionText}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleCopySingle(captionText, itemKey)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                                    isSingleCopied
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white"
                                  }`}
                                  title="Copy to clipboard"
                                >
                                  <OxygenIcon name={isSingleCopied ? "dialog-ok-apply" : "edit-copy"} className="w-3 h-3" />
                                  <span>{isSingleCopied ? "Copied!" : "Copy"}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>

            {/* Article FAQ Section */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <OxygenIcon name="help" className="w-5 h-5 text-primary" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1.5">
                        {faq.q}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR: Related & Newsletter (Later.com Style)     */}
          {/* ======================================================== */}
          <aside className="lg:col-span-3 space-y-6 sticky top-24">
            {/* Related Collections Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                <OxygenIcon name="view-media-album-cover" className="w-4 h-4 text-cyan-500" />
                Related Collections
              </h3>

              {related.length > 0 ? (
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/${rel.section || sectionKey}/${rel.slug}`}
                      className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all group"
                    >
                      <div className="text-[10px] font-bold text-primary uppercase mb-1">
                        {rel.category?.replace("-", " ")}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <Link
                    href="/instagram-captions/mood-instagram-captions"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    ✨ 120+ Mood Captions
                  </Link>
                  <Link
                    href="/instagram-captions/attitude-captions"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    🔥 80+ Attitude Captions
                  </Link>
                  <Link
                    href="/instagram-captions/travel-captions"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    ✈️ 75+ Travel Captions
                  </Link>
                  <Link
                    href="/instagram-bio-ideas/boys-instagram-bio"
                    className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    👑 120+ Boys Bios
                  </Link>
                </div>
              )}
            </div>

            {/* Newsletter Subscription Card (Later.com Style) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-[#635BFF] flex items-center justify-center mb-3">
                <OxygenIcon name="mail-message-new" className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white mb-1.5">
                Weekly Instagram Drops
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Get fresh hand-picked captions, bio ideas, and algorithm guides sent to your inbox every Sunday.
              </p>

              {newsletterSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                  <OxygenIcon name="dialog-ok-apply" className="w-4 h-4 shrink-0" />
                  <span>You are subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}

