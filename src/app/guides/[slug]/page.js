"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import { supabase } from "@/lib/supabaseClient";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);

  // Fallback article map if backend is offline
  const fallbackMap = {
    "how-to-download-instagram-reels-in-1080p": {
      title: "How to Download Instagram Reels in Full 1080p HD with Audio",
      excerpt: "Step-by-step masterclass on saving high-definition Instagram Reels with crystal-clear synchronized audio without watermarks.",
      category: "reels-tips",
      author: "FastEDL Technical Team",
      read_time: "5 min read",
      created_at: "2026-03-15",
      updated_at: "2026-03-15",
      content: `<h2>Understanding Instagram Reels Video Encoding</h2><p>Instagram encodes uploaded Reels using adaptive bitrate streaming (DASH). Depending on user bandwidth and connection quality, the Instagram player can deliver streams ranging from low-bandwidth 360p up to full 1080x1920 HD.</p><p>Crucially, Instagram often splits the high-definition video track from the AAC audio track. Standard browser downloaders only grab the mute video track. FastEDL automatically parses the DASH manifest and merges the pristine video stream with the synchronized stereo audio stream into a single MP4 file.</p><h2>Step-by-Step: Saving Reels on Mobile & Desktop</h2><ol><li><strong>Locate the Reel:</strong> Open Instagram and find the Reel you wish to save.</li><li><strong>Copy Share Link:</strong> Tap the paper airplane icon (Share) and select <em>Copy Link</em>.</li><li><strong>Paste into FastEDL:</strong> Open FastEDL in Safari, Chrome, or any browser, paste the URL into the input field and hit <strong>Download</strong>.</li><li><strong>Choose Quality:</strong> If multiple genuine resolutions are available, pick your desired format (e.g., 1080p Full HD) and download immediately.</li></ol><h2>Why Other Downloaders Deliver Blurry or Muted Videos</h2><p>Many online tools attempt to upscale 480p videos to 1080p falsely or fail to mux DASH audio. FastEDL adheres to strict technical transparency: we only present genuine bitstreams directly from source CDNs, ensuring pristine clarity without fake re-encoding.</p>`,
      faqs: [
        {
          q: "Does FastEDL add watermarks to downloaded Reels?",
          a: "No. FastEDL saves the original video stream without adding any logos, usernames, or watermarks."
        },
        {
          q: "Can I download Reels from private Instagram accounts?",
          a: "No. FastEDL strictly respects creator privacy and Meta access controls. Only publicly accessible media can be retrieved."
        }
      ]
    },
    "instagram-hashtag-strategy-guide": {
      title: "The 2026 Instagram Hashtag Algorithm: Reach & Best Practices",
      excerpt: "Why 30 random hashtags hurt your reach and how the 3x3 niche hashtag strategy accelerates discovery on Explore.",
      category: "hashtag-guides",
      author: "FastEDL Growth Lab",
      read_time: "7 min read",
      created_at: "2026-03-20",
      updated_at: "2026-03-20",
      content: `<h2>The Evolution of Instagram Discovery</h2><p>Instagram's search and recommendation engine has transitioned from keyword matching to contextual semantic classification. Dropping 30 generic hashtags like #love, #instagood, or #fashion now confuses the topic classifier rather than helping it.</p><h2>The 3x3 Category Strategy</h2><p>Top creators now use 5 to 9 highly targeted tags broken into three tiers:</p><ul><li><strong>Broad Category (2 tags):</strong> Defines the industry (e.g., #webdesign, #fitnessjourney).</li><li><strong>Niche Community (3 tags):</strong> Defines the sub-community with 50k–500k posts (e.g., #minimalistbranding, #calisthenicsworkout).</li><li><strong>Post Specific (2-3 tags):</strong> Explains the exact content of this post (e.g., #landingpagedesign, #handstandprogression).</li></ul><h2>Hashtag Placement: Caption vs Comments</h2><p>Internal tests and statements from Instagram leadership confirm that hashtags placed directly in the main caption provide stronger immediate indexing signals for the explore algorithm compared to delayed comment placement.</p>`,
      faqs: [
        {
          q: "Should I use all 30 hashtags allowed by Instagram?",
          a: "No. Instagram officially recommends between 3 and 8 relevant hashtags. Using all 30 can flag the post for spammy behavior."
        }
      ]
    },
    "how-to-fix-instagram-download-errors": {
      title: "Troubleshooting FastEDL: Why Instagram Downloads Fail & How to Fix Them",
      excerpt: "Resolving rate limits, expired media tokens, private account restrictions, and browser cache issues effortlessly.",
      category: "troubleshooting",
      author: "FastEDL Support",
      read_time: "4 min read",
      created_at: "2026-03-25",
      updated_at: "2026-03-25",
      content: `<h2>Common Download Failures & Solutions</h2><p>When an Instagram media extraction fails, it is usually due to one of four verifiable causes:</p><h3>1. Private or Restricted Account</h3><p>FastEDL cannot access media from private accounts or accounts gated behind age/location restrictions. Verify that the creator's profile is open to the public without requiring an Instagram login.</p><h3>2. Tracking Parameters in URL</h3><p>Sometimes copying a link from the Instagram mobile app adds long tracking parameters (e.g., <code>?igsh=...</code> or <code>?utm_source=...</code>). FastEDL automatically sanitizes these, but if an error occurs, try trimming everything after the question mark.</p><h3>3. Expired CDN Tokens</h3><p>Instagram's media URLs contain temporary time-limited security signatures. If you leave the preview open for over 30 minutes before clicking download, the token may expire. Simply click <strong>Try Another Link</strong> and re-paste.</p>`,
      faqs: [
        {
          q: "Why do I see 'Unable to retrieve media' error?",
          a: "This happens when the post is deleted, private, or Instagram's rate limit temporarily throttled extraction. Waiting a minute and trying again usually resolves it."
        }
      ]
    },
    "instagram-carousel-complete-guide": {
      title: "Instagram Carousel Masterclass: Highest Engaging Post Format",
      excerpt: "How to structure multi-slide carousel albums that maximize saves, shares, and watch time in the modern algorithm.",
      category: "creator-tutorials",
      author: "FastEDL Content Team",
      read_time: "6 min read",
      created_at: "2026-04-01",
      updated_at: "2026-04-01",
      content: `<h2>Why Carousels Beat Single Images in 2026</h2><p>Instagram carousels hold a significant algorithmic advantage: if a user scrolls past your post without engaging, Instagram will often show the post a second time on their feed featuring the <em>second slide</em> instead of the first.</p><h2>The 7-Slide High Retention Blueprint</h2><ol><li><strong>Slide 1 (The Hook):</strong> High-contrast title and bold proposition.</li><li><strong>Slide 2 (The Problem):</strong> Agitate the pain point.</li><li><strong>Slide 3-5 (The Solution Steps):</strong> Actionable, bite-sized value.</li><li><strong>Slide 6 (The Summary):</strong> One clean diagram or checklist.</li><li><strong>Slide 7 (The Call to Action):</strong> Encourage saving and sharing.</li></ol>`,
      faqs: [
        {
          q: "Can I download all carousel photos at once on FastEDL?",
          a: "Yes. FastEDL includes a 'Download All' button that retrieves every image and video slide from the carousel album."
        }
      ]
    }
  };

  useEffect(() => {
    if (!slug) return;

    async function fetchArticle() {
      try {
        const { data, error: sbErr } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (!sbErr && data) {
          const faqs = Array.isArray(data.faq_json) ? data.faq_json : [];
          setArticle({ ...data, faqs });
          extractToc(data.content);

          const { data: relData } = await supabase
            .from("articles")
            .select("id, slug, title, read_time")
            .eq("category", data.category)
            .neq("id", data.id)
            .limit(3);

          if (relData) {
            setRelated(relData);
          }
          return;
        }

        // Fallback
        if (fallbackMap[slug]) {
          const fb = fallbackMap[slug];
          setArticle(fb);
          extractToc(fb.content);
        } else {
          setError("Article not found");
        }
      } catch (e) {
        console.warn("Falling back to local article map:", e);
        if (fallbackMap[slug]) {
          const fb = fallbackMap[slug];
          setArticle(fb);
          extractToc(fb.content);
        } else {
          setError("Failed to load article");
        }
      } finally {
        setLoading(false);
      }
    }

    function extractToc(html) {
      if (!html) return;
      const matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
      const headings = matches.map((m, idx) => {
        const text = m.replace(/<\/?[^>]+(>|$)/g, "");
        const id = `heading-${idx}`;
        return { text, id };
      });
      setToc(headings);
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <OxygenIcon name="view-refresh" className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-slate-500">Loading guide...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center">
          <OxygenIcon name="dialog-warning" className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Guide Not Found</h1>
          <p className="text-slate-500 mb-6">The article you requested could not be located.</p>
          <Link href="/guides" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm">
            Browse All Guides
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-primary font-medium truncate max-w-xs">{article.title}</span>
        </div>

        {/* Article Header */}
        <header className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider border border-violet-500/20">
              {article.category?.replace("-", " ") || "Guide"}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <OxygenIcon name="chronometer" className="w-3.5 h-3.5" />
              {article.read_time || "5 min read"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#635BFF]/10 text-primary flex items-center justify-center font-bold">
                FE
              </div>
              <span>Written by <strong className="text-slate-700 dark:text-slate-200">{article.author || "FastEDL Editorial"}</strong></span>
            </div>
            <span>Published {article.created_at?.slice(0, 10)}</span>
          </div>
        </header>

        {/* Main Content & Table of Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Article Body (8 cols) */}
          <article className="lg:col-span-8 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#635BFF] prose-img:rounded-xl">
            <div
              className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-base"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Quick Action Box */}
            <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <OxygenIcon name="download" className="w-4 h-4 text-primary" />
                Try FastEDL Video & Reels Downloader
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                Test genuine format selection with FastEDL. Fast, 100% free, and no account needed.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#635BFF] text-white text-xs font-bold shadow hover:bg-[#5248EE] transition-colors"
              >
                Go to Downloader &rarr;
              </Link>
            </div>

            {/* Article FAQs */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{f.q}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <OxygenIcon name="format-list-ordered" className="w-4 h-4 text-primary" />
                  Table of Contents
                </h3>
                <nav className="space-y-2 text-xs">
                  {toc.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors cursor-pointer py-0.5 line-clamp-1"
                    >
                      {item.text}
                    </div>
                  ))}
                </nav>
              </div>
            )}

            {/* Creator Tools Quick Access */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <OxygenIcon name="applications-system" className="w-4 h-4 text-[#06B6D4]" />
                Popular Creator Tools
              </h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/instagram-caption-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  ✨ Caption Generator (EN/HI)
                </Link>
                <Link
                  href="/instagram-hashtag-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  #️⃣ Hashtag Generator
                </Link>
                <Link
                  href="/instagram-bio-generator"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  👤 Bio Generator
                </Link>
                <Link
                  href="/instagram-caption-formatter"
                  className="block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium text-slate-700 dark:text-slate-200"
                >
                  📝 Caption Linebreak Cleaner
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Related Creator Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-primary transition-all flex flex-col justify-between"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-primary font-semibold">
                    Read Guide &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

