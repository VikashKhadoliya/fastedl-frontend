"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password })
      });

      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        data = { detail: `Server responded with status ${res.status}` };
      }

      if (res.ok && data?.token) {
        localStorage.setItem("fastedl_admin_token", data.token);
        localStorage.setItem("fastedl_admin_user", JSON.stringify(data.user || { username: data.username || username }));
        router.push("/admin");
      } else {
        if (res.status === 401) {
          setError(data?.detail || "Invalid admin username or password. Default is admin / FastEDL@Admin2026!");
        } else if (res.status === 502) {
          setError("FastEDL backend service is unreachable. Ensure the backend server is running.");
        } else {
          setError(data?.detail || "Failed to log in to admin portal.");
        }
      }
    } catch (err) {
      setError("Network error connecting to admin service. Ensure the FastEDL backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center mx-auto mb-3 border border-[#635BFF]/30">
            <OxygenIcon name="security-high" size={24} className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">FastEDL Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Platform CMS, Creator Tools & Message Center</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <OxygenIcon name="dialog-warning" size={16} className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <span className="text-[10px] text-slate-400">
                Default: FastEDL@Admin2026!
              </span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <OxygenIcon name="view-refresh" size={16} className="w-4 h-4 animate-spin text-white" />
                Signing in...
              </>
            ) : (
              <>
                <OxygenIcon name="dialog-ok-apply" size={16} className="w-4 h-4 text-white" />
                Sign In to Admin
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
            &larr; Back to Public FastEDL
          </Link>
        </div>
      </div>
    </div>
  );
}
