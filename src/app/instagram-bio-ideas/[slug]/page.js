"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ContentArticleReader from "@/components/ContentArticleReader";
import OxygenIcon from "@/components/OxygenIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function InstagramBioArticlePage() {
  const params = useParams();
  const slug = params?.slug;

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadArticle() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (!error && data) {
          setArticle(data);
          const { data: relData } = await supabase
            .from("articles")
            .select("id, slug, title, read_time, category")
            .eq("section", "instagram-bio-ideas")
            .eq("status", "published")
            .neq("id", data.id)
            .limit(4);
          setRelated(relData || []);
          return;
        }
        setNotFound(true);
      } catch (e) {
        console.error("Failed to load bio article", e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center">
          <OxygenIcon name="refresh" className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-xs text-slate-500">Loading bio ideas...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-24 text-center">
          <OxygenIcon name="help" className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bio Collection Not Found</h1>
          <p className="text-xs text-slate-500 mb-6">The bio collection you requested could not be located.</p>
          <Link
            href="/instagram-bio-ideas"
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow"
          >
            Browse All Bio Ideas &rarr;
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ContentArticleReader
      article={article}
      related={related}
      sectionKey="instagram-bio-ideas"
      sectionLabel="Instagram Bio Ideas"
      sectionBaseUrl="/instagram-bio-ideas"
    />
  );
}

