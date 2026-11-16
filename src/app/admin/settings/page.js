"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { supabase } from "@/lib/supabaseClient";

export default function AdminSettingsPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
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
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("key, value");

        if (!error && data && data.length > 0) {
          const map = {};
          data.forEach((row) => {
            map[row.key] = row.value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    if (adminUser) {
      loadSettings();
    }
  }, [adminUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const now = new Date().toISOString();
      const rows = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
        is_public: ["site_name", "site_tagline", "contact_email"].includes(key),
        updated_at: now
      }));

      const { error } = await supabase
        .from("site_settings")
        .upsert(rows, { onConflict: "key" });

      if (error) throw error;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update platform settings.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Verifying Admin Authorization...
          </span>
        </div>
      </div>
    );
  }

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

