"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fastedl_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function loadAnalytics() {
      try {
        const res = await fetch("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error("Failed to load analytics", e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
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
              className="px-4 py-2 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
            >
              <OxygenIcon name="document-new" className="w-4 h-4" />
              New Guide
            </Link>
            <Link
              href="/admin/messages"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <OxygenIcon name="mail-message-new" className="w-4 h-4 text-cyan-400" />
              View Inquiries
            </Link>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Articles</span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-[#635BFF] flex items-center justify-center">
                <OxygenIcon name="document-edit" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats?.total_articles ?? 4}</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <OxygenIcon name="dialog-ok-apply" className="w-3 h-3" />
              {stats?.published_articles ?? 4} published live
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unread Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-[#06B6D4] flex items-center justify-center">
                <OxygenIcon name="mail-message-new" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats?.unread_messages ?? 0}</div>
            <div className="text-[11px] text-slate-400 mt-2">
              From contact form & DMCA submissions
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Creator Tools</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <OxygenIcon name="applications-system" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">7</div>
            <div className="text-[11px] text-slate-400 mt-2">
              Captions, Hashtags, Bios, Hooks & Formatter
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Invocations</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <OxygenIcon name="chronometer" className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{stats?.total_tool_invocations ?? 142}</div>
            <div className="text-[11px] text-slate-400 mt-2">
              Tracked across all platform modules
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
                <Link href="/admin/messages" className="text-xs text-[#635BFF] hover:underline font-semibold">
                  View All &rarr;
                </Link>
              </div>

              {stats?.recent_messages && stats.recent_messages.length > 0 ? (
                <div className="divide-y divide-slate-800 text-xs">
                  {stats.recent_messages.map((m) => (
                    <div key={m.id} className="py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">{m.name} ({m.email})</span>
                        <span className="text-[10px] text-slate-500">{m.created_at?.slice(0, 10)}</span>
                      </div>
                      <div className="text-slate-400 font-medium">{m.subject}</div>
                      <p className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{m.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No unread contact messages. Your inbox is clear!
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
              <Link
                href="/contact"
                target="_blank"
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                Test Contact Form &rarr;
              </Link>
            </div>
          </div>

          {/* Tool Usage Metrics Card */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <OxygenIcon name="view-media-album-cover" className="w-4 h-4 text-emerald-400" />
              Creator Tools & Downloader Usage
            </h2>

            {stats?.tool_metrics && stats.tool_metrics.length > 0 ? (
              <div className="space-y-3">
                {stats.tool_metrics.map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800 last:border-0">
                    <span className="font-medium text-slate-300 capitalize">{t.tool_name.replace(/-/g, " ")}</span>
                    <span className="font-bold text-[#06B6D4] bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      {t.count} runs
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-300">Video & Reels Downloader</span>
                  <span className="font-bold text-violet-400">Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-300">Instagram Caption Generator</span>
                  <span className="font-bold text-violet-400">Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-300">Instagram Hashtag Generator</span>
                  <span className="font-bold text-violet-400">Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-300">Instagram Bio Generator</span>
                  <span className="font-bold text-violet-400">Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-300">Caption Formatter</span>
                  <span className="font-bold text-violet-400">Active</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

