"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import OxygenIcon from "@/components/OxygenIcon";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    const token = localStorage.getItem("fastedl_admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const token = localStorage.getItem("fastedl_admin_token");
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const token = localStorage.getItem("fastedl_admin_token");
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadMessages();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Contact & Support Inquiries</h1>
          <p className="text-xs text-slate-400 mt-1">Review feedback, DMCA notices, and user support submissions.</p>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-xs">Loading inquiries...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">No inquiries in your inbox.</div>
          ) : (
            <div className="divide-y divide-slate-800 text-xs">
              {messages.map((m) => (
                <div key={m.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{m.name}</span>
                      <a href={`mailto:${m.email}`} className="text-cyan-400 hover:underline">
                        {m.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === "unread"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : m.status === "replied"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {m.status}
                      </span>
                      <span className="text-[11px] text-slate-500">{m.created_at?.slice(0, 16)}</span>
                    </div>
                  </div>

                  <div className="font-semibold text-slate-200 mb-1">
                    Subject: {m.subject}
                  </div>
                  <p className="text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans text-xs">
                    {m.message}
                  </p>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    {m.status === "unread" && (
                      <button
                        onClick={() => handleUpdateStatus(m.id, "read")}
                        className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Mark Read
                      </button>
                    )}
                    {m.status !== "replied" && (
                      <button
                        onClick={() => handleUpdateStatus(m.id, "replied")}
                        className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-semibold"
                      >
                        Mark Replied
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

