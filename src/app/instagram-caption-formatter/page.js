"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";

export default function CaptionFormatterPage() {
  const [inputText, setInputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("clean");
  const [formattedText, setFormattedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const styles = [
    { id: "clean", label: "Clean Spacing", desc: "No collapsed line breaks (Instagram-ready)" },
    { id: "bold_sans", label: "Bold Sans", desc: "𝗕𝗼𝗹𝗱 𝗺𝗼𝗱𝗲𝗿𝗻 𝘀𝘁𝘆𝗹𝗲" },
    { id: "italic_serif", label: "Italic Serif", desc: "𝐼𝓉𝒶𝓁𝒾𝒸 𝒶𝑒𝓈𝓉𝒽𝑒𝓉𝒾𝒸" },
    { id: "typewriter", label: "Typewriter", desc: "𝚃𝚢𝚙𝚎𝚠𝚛𝚒𝚝𝚎𝚛 𝚖𝚘𝚗𝚘" },
    { id: "script", label: "Cursive Script", desc: "𝒮𝒸𝓇𝒾𝓅𝓉 𝒸𝒶𝓁𝓁𝒾𝑔𝓇𝒶𝓅𝒽𝓎" },
    { id: "spaced", label: "W i d e", desc: "S p a c e d   o u t" }
  ];

  const handleFormat = async (text, style) => {
    if (!text.trim()) {
      setFormattedText("");
      setCharCount(0);
      setWordCount(0);
      return;
    }

    try {
      const res = await fetch("/api/creator/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style })
      });
      const data = await res.json();
      if (data.formatted_text !== undefined) {
        setFormattedText(data.formatted_text);
        setCharCount(data.char_count);
        setWordCount(data.word_count);
      }
    } catch (e) {
      console.error("Format error:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFormat(inputText, selectedStyle);
    }, 150);
    return () => clearTimeout(timer);
  }, [inputText, selectedStyle]);

  const handleCopy = () => {
    if (!formattedText) return;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: "Why do Instagram line breaks collapse without formatting?",
      a: "Instagram automatically strips ordinary empty lines unless you use invisible Unicode spacing characters (like braille patterns). FastEDL automatically embeds clean invisible spaces so your paragraphs stay perfectly spaced on both iOS and Android."
    },
    {
      q: "Will these custom fonts display on everyone's phone?",
      a: "Yes. FastEDL uses universal Unicode mathematical and typographical symbols supported across modern iOS, Android, macOS, and Windows operating systems."
    },
    {
      q: "What is the maximum character limit for Instagram captions?",
      a: "Instagram allows up to 2,200 characters and up to 30 hashtags per post. FastEDL includes a real-time character counter so you never exceed the limit."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200">Creator Tools</span>
          <span>/</span>
          <span className="text-primary font-medium">Caption Formatter</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-violet-500/20">
            <OxygenIcon name="text-editor" className="w-4 h-4" />
            FastEDL Creator Studio
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Instagram <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] via-[#8B5CF6] to-[#06B6D4]">Caption Formatter</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Fix collapsed line breaks, format aesthetic Unicode fonts, and make your captions effortless to read on mobile.
          </p>
        </div>

        {/* Tool Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Editor Column */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <OxygenIcon name="document-edit" className="w-4 h-4 text-primary" />
                Raw Caption Text
              </label>
            </div>

            <textarea
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your caption here. Use empty lines where you want clean breaks..."
              className="w-full flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF] text-base sm:text-sm leading-relaxed resize-none"
            />

            {/* Style Selector Chips */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Choose Typography Style:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStyle(s.id)}
                    className={`px-3 py-2 rounded-xl text-left border text-xs font-medium transition-all ${
                      selectedStyle === s.id
                        ? "bg-[#635BFF]/10 border-[#635BFF] text-[#635BFF] dark:text-violet-300 font-semibold ring-1 ring-[#635BFF]"
                        : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-bold">{s.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Formatted Output Preview Column */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <OxygenIcon name="dialog-ok-apply" className="w-4 h-4 text-[#06B6D4]" />
                  Instagram-Ready Preview
                </label>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-semibold ${charCount > 2200 ? "text-red-500" : "text-slate-500 dark:text-slate-400"}`}>
                    {charCount}/2200 chars
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 dark:text-slate-400">{wordCount} words</span>
                </div>
              </div>

              <div className="w-full min-h-[260px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm whitespace-pre-wrap leading-relaxed select-all font-sans overflow-y-auto max-h-[380px]">
                {formattedText ? (
                  formattedText
                ) : (
                  <span className="text-slate-400 italic">
                    Formatted text with clean spacing and selected style will appear here...
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Line breaks won&apos;t get squashed on Instagram
              </span>

              <button
                type="button"
                disabled={!formattedText}
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#635BFF] hover:bg-[#5248EE] text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                }`}
              >
                <OxygenIcon name={copied ? "dialog-ok-apply" : "edit-copy"} className="w-4 h-4" />
                {copied ? "Copied to Clipboard!" : "Copy Formatted"}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3">
              <OxygenIcon name="text-editor" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Zero Squished Paragraphs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Injects invisible space dividers so Instagram preserves your intentional double-spacing and formatting on all mobile screens.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <OxygenIcon name="favorite" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Universal Font Symbols</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transforms headlines into aesthetic Bold Sans, Script, or Typewriter without breaking compatibility across operating systems.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <OxygenIcon name="security-high" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Character & Word Guard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitors the 2,200 character ceiling in real-time so your captions never truncate awkwardly or get rejected when publishing.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <FAQSection items={faqs} />
      </main>

      <Footer />
    </div>
  );
}

