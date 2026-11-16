"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import OxygenIcon from "@/components/OxygenIcon";
import { supabase } from "@/lib/supabaseClient";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("fastedl_admin_token");
      localStorage.removeItem("fastedl_admin_user");
    }
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "help-browser" },
    { label: "Pages Manager", href: "/admin/pages", icon: "text-editor" },
    { label: "Articles CMS", href: "/admin/articles", icon: "document-edit" },
    { label: "Media Library", href: "/admin/media", icon: "photo" },
    { label: "Inquiries", href: "/admin/messages", icon: "mail-message-new" },
    { label: "Settings", href: "/admin/settings", icon: "configure" },
  ];

  return (
    <header className="bg-[#1E293B] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-black text-sm">
              F
            </div>
            <span className="font-black text-lg text-white tracking-tight">
              FastEDL <span className="text-[#06B6D4] text-xs font-bold uppercase ml-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">Admin</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-xs">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                    active
                      ? "bg-[#635BFF] text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <OxygenIcon name={item.icon} className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <OxygenIcon name="applications-internet" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <OxygenIcon name="system-log-out" className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Subnav for smaller screens */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-slate-900 border-t border-slate-800 overflow-x-auto scrollbar-none text-xs">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 ${
                active ? "bg-[#635BFF] text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <OxygenIcon name={item.icon} className="w-3 h-3" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
