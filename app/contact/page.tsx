"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Get in touch</span>
          <h1 className="text-4xl font-extrabold text-slate-800 mt-2 mb-4">Contact Us</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Have a question, found a bug, or want to suggest a feature? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="flex flex-col gap-4">
            {contactInfo.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                  {c.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{c.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{c.value}</p>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-2">
              <p className="text-sm font-semibold text-blue-800 mb-1">Response time</p>
              <p className="text-sm text-blue-600">We typically respond within 1–2 business days.</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Message sent!</h2>
                <p className="text-slate-500 max-w-sm">Thanks for reaching out. We'll get back to you within 1–2 business days.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Send a message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your name" required>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </Field>
                  <Field label="Email address" required>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </Field>
                </div>

                <Field label="Subject" required>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a topic…</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="privacy">Privacy question</option>
                    <option value="other">Other</option>
                  </select>
                </Field>

                <Field label="Message" required>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your question or issue in detail…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="self-end flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const contactInfo = [
  {
    title: "Email",
    value: "support@nexpdf.app",
    bg: "bg-blue-50",
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Bug reports",
    value: "Use the form with 'Bug report' topic",
    bg: "bg-red-50",
    icon: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Feature requests",
    value: "We read every suggestion",
    bg: "bg-green-50",
    icon: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];
