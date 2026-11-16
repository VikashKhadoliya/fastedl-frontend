"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    totalPages: 0,
    unreadMessages: 0,
    totalMedia: 0,
    recentMessages: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!adminUser) return;

    async function loadDashboardMetrics() {
      try {
        const [
          articlesRes,
          publishedArticlesRes,
          pagesRes,
          unreadMsgRes,
          mediaRes,
          recentMsgRes,
        ] = await Promise.all([
          supabase.from("articles").select("*", { count: "exact", head: true }),
          supabase
            .from("articles")
            .select("*", { count: "exact", head: true })
            .eq("status", "published"),
          supabase.from("pages").select("*", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("status", "unread"),
          supabase.from("media_assets").select("*", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("id, name, email, subject, message, created_at, status")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          totalArticles: articlesRes.count ?? 0,
          publishedArticles: publishedArticlesRes.count ?? 0,
          totalPages: pagesRes.count ?? 0,
          unreadMessages: unreadMsgRes.count ?? 0,
          totalMedia: mediaRes.count ?? 0,
          recentMessages: recentMsgRes.data || [],
        });
      } catch (err) {
        console.error("Failed to load Supabase metrics:", err);
      } finally {
        setLoadingStats(false);
      }
    }

    loadDashboardMetrics();
  }, [adminUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <OxygenIcon name="refresh" size={28} className="animate-spin text-[#635BFF]" />
          <span className="text-xs text-slate-400 font-medium">Verifying Admin Privileges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                Supabase Connected
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {adminUser?.email}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Platform Overview & CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live monitoring for FastEDL downloader, creator tools, educational guides and inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <OxygenIcon name="document-new" className="w-4 h-4" />
              New Guide
            </Link>
            <Link
              href="/admin/messages"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <OxygenIcon name="mail-message-new" className="w-4 h-4 text-cyan-400" />
              View Inquiries ({stats.unreadMessages})
            </Link>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Articles Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Articles</span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-[#635BFF] flex items-center justify-center">
                <OxygenIcon name="document-edit" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {loadingStats ? "..." : stats.totalArticles}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <OxygenIcon name="dialog-ok-apply" className="w-3 h-3" />
              {stats.publishedArticles} published live
            </div>
          </div>

          {/* Unread Inquiries Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-[#06B6D4] flex items-center justify-center">
                <OxygenIcon name="mail-message-new" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {loadingStats ? "..." : stats.unreadMessages}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              From contact form & DMCA submissions
            </div>
          </div>

          {/* Custom Pages Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Custom Pages</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <OxygenIcon name="text-editor" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {loadingStats ? "..." : stats.totalPages}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Dynamic CMS pages under /p/[slug]
            </div>
          </div>

          {/* Media Assets Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Library</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <OxygenIcon name="photo" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {loadingStats ? "..." : stats.totalMedia}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Files in Supabase &apos;media&apos; storage bucket
            </div>
          </div>
        </div>

        {/* Content & Recent Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Messages Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <OxygenIcon name="mail-message-new" className="w-4 h-4 text-[#06B6D4]" />
                  Recent User Inquiries
                </h2>
                <Link href="/admin/messages" className="text-xs text-[#635BFF] hover:underline font-semibold cursor-pointer">
                  View All &rarr;
                </Link>
              </div>

              {stats.recentMessages && stats.recentMessages.length > 0 ? (
                <div className="divide-y divide-slate-800 text-xs">
                  {stats.recentMessages.map((m) => (
                    <div key={m.id} className="py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">
                          {m.name} ({m.email})
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <div className="text-slate-400 font-medium">{m.subject}</div>
                      <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{m.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  {loadingStats ? "Loading inquiries..." : "No contact messages. Your inbox is clear!"}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <Link
                href="/contact"
                target="_blank"
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                Test Contact Form &rarr;
              </Link>
            </div>
          </div>

          {/* Tool Suite Status Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <OxygenIcon name="view-media-album-cover" className="w-4 h-4 text-emerald-400" />
              Creator Tools & Downloader Suite
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Instagram Video & Reels Downloader</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Instagram Reel to MP3 Converter</span>
                <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Instagram Photo & Carousel Downloader</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Instagram Story Downloader</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-300">Content Library (Captions, Hashtags, Bios)</span>
                <span className="font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Admin CMS & Storage Engine</span>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Supabase</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
