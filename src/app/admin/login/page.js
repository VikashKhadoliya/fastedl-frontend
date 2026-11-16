"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { supabase, checkIsAdmin } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@fastedl.app");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in as a verified admin, auto-redirect to /admin
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const isAdmin = await checkIsAdmin(session.user);
          if (isAdmin) {
            router.push("/admin");
          }
        }
      } catch (_) {}
    }
    checkExistingSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data?.user) {
        setError(authError?.message || "Invalid admin email or password.");
        setLoading(false);
        return;
      }

      // 2. Explicit Admin Authorization Check against public.admin_users
      const isAdmin = await checkIsAdmin(data.user);
      if (!isAdmin) {
        // Sign out unauthorized user immediately
        await supabase.auth.signOut();
        setError(
          "Access Denied: This account is authenticated but not listed in public.admin_users."
        );
        setLoading(false);
        return;
      }

      // 3. Clear any legacy localStorage tokens and redirect to admin dashboard
      if (typeof window !== "undefined") {
        localStorage.removeItem("fastedl_admin_token");
        localStorage.removeItem("fastedl_admin_user");
      }

      router.push("/admin");
    } catch (err) {
      setError("An unexpected error occurred during admin sign-in. Please try again.");
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
          <p className="text-xs text-slate-400 mt-1">Platform CMS, Media & Message Center</p>
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
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fastedl.app"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
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
                Sign In with Supabase Auth
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
