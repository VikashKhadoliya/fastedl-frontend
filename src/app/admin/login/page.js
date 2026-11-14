"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      try {
        res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
      } catch (proxyErr) {
        // Fallback to direct backend port if Next.js proxy is unavailable
        res = await fetch("http://localhost:8000/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
      }

      if (!res.ok && res.status === 404) {
        // If 404 on proxy, attempt direct backend port 8000
        res = await fetch("http://localhost:8000/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
      }

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("fastedl_admin_token", data.token);
        localStorage.setItem("fastedl_admin_user", JSON.stringify(data.user || { username }));
        router.push("/admin");
      } else {
        setError(data.detail || "Invalid admin username or password.");
      }
    } catch (err) {
      setError("Network error connecting to admin service. Ensure the FastEDL backend service is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#635BFF]/20 text-[#635BFF] flex items-center justify-center mx-auto mb-3 border border-[#635BFF]/30">
            <OxygenIcon name="security-high" className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">FastEDL Admin Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Platform CMS, Creator Tools & Message Center</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <OxygenIcon name="dialog-warning" className="w-4 h-4 shrink-0" />
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <OxygenIcon name="view-refresh" className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <OxygenIcon name="dialog-ok-apply" className="w-4 h-4" />
                Sign In to Admin
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
            &larr; Back to Public FastEDL
          </Link>
        </div>
      </div>
    </div>
  );
}

