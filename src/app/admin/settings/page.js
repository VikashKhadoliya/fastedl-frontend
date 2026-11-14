"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    site_name: "FastEDL",
    site_tagline: "Fast Easy Download Link - Download. Create. Grow.",
    contact_email: "support@fastedl.app",
    maintenance_mode: "false",
    rate_limit_per_minute: "30"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("fastedl_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    const token = localStorage.getItem("fastedl_admin_token");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Platform Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure global application brand metadata and system parameters.</p>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <OxygenIcon name="dialog-ok-apply" className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}

        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading settings...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                    Site Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                    Support Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.site_tagline || ""}
                  onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                    Rate Limit (Req / Min / IP)
                  </label>
                  <input
                    type="number"
                    value={settings.rate_limit_per_minute || "30"}
                    onChange={(e) => setSettings({ ...settings, rate_limit_per_minute: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-2">
                    Maintenance Mode
                  </label>
                  <select
                    value={settings.maintenance_mode || "false"}
                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="false">Disabled (Operational)</option>
                    <option value="true">Enabled (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5248EE] text-white font-bold flex items-center gap-2 shadow"
                >
                  <OxygenIcon name="dialog-ok-apply" className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

