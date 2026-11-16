"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import OxygenIcon from "@/components/OxygenIcon";
import { supabase } from "@/lib/supabaseClient";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertError } = await supabase.from("contact_messages").insert([{
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        status: "unread",
        created_at: new Date().toISOString()
      }]);

      if (insertError) {
        throw insertError;
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Unable to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] mb-6">
          <Link href="/" className="hover:text-[#635BFF] dark:hover:text-[#8B5CF6] transition-colors flex items-center gap-1.5">
            <OxygenIcon name="home" size={14} alt="Home" />
            Home
          </Link>
          <OxygenIcon name="arrow-right" size={10} alt=">" />
          <span className="text-[#0F172A] dark:text-[#F8FAFC] font-semibold">Contact FastEDL</span>
        </nav>

        <div className="border-b border-[#E2E8F0] dark:border-[#334155] pb-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#635BFF] dark:text-[#8B5CF6] mb-2 block">
            Support &amp; Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Contact FastEDL
          </h1>
          <p className="mt-3 text-base text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Have questions, feedback, partnership requests, or copyright inquiries? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Support Channels Information Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm space-y-5">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Direct Contact Channels
              </h2>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <OxygenIcon name="help" size={16} alt="Support" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-xs">General Support</p>
                  <a href="mailto:support@fastedl.app" className="text-xs text-[#635BFF] dark:text-[#8B5CF6] hover:underline font-mono">
                    support@fastedl.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <OxygenIcon name="security" size={16} alt="DMCA" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-xs">DMCA &amp; Copyright</p>
                  <a href="mailto:dmca@fastedl.app" className="text-xs text-[#06B6D4] hover:underline font-mono">
                    dmca@fastedl.app
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <OxygenIcon name="speed" size={16} alt="Time" />
                </div>
                <div>
                  <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-xs">Response Time</p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Within 24 to 48 business hours</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155]">
              <h3 className="font-bold text-xs text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Frequently Asked First?
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                Check our knowledge base for instant answers on link troubleshooting and device paths.
              </p>
              <Link
                href="/guide"
                className="text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] hover:underline inline-flex items-center gap-1"
              >
                Visit Help Center &rarr;
              </Link>
            </div>
          </div>

          {/* Contact Interactive Form */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-sm">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <OxygenIcon name="check" size={24} alt="Success" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out to FastEDL. A support specialist will review your request and reply to <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "general", message: "" });
                    }}
                    className="mt-4 px-5 py-2.5 text-xs font-bold text-[#635BFF] dark:text-[#8B5CF6] bg-[#635BFF]/10 hover:bg-[#635BFF]/20 rounded-xl transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400">
                      <OxygenIcon name="close" size={14} alt="Alert" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-base sm:text-xs text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full h-10 px-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-base sm:text-xs text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-base sm:text-xs text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support / Bug Report</option>
                      <option value="dmca">DMCA / Copyright Takedown</option>
                      <option value="partnership">Business / Advertising Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your question or issue in detail..."
                      className="w-full p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-base sm:text-xs text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white bg-[#635BFF] hover:bg-[#5247E6] shadow-xs shadow-[#635BFF]/20 transition-transform active:scale-98 cursor-pointer disabled:opacity-60"
                  >
                    <OxygenIcon name="arrow-right" size={14} alt="Send" />
                    <span>{submitting ? "Sending Message..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
