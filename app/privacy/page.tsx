import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy · PDFEdit",
  description: "How PDFEdit handles your data and privacy.",
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "blue",
    content: (
      <>
        <p>
          PDFEdit is a <strong>100% browser-based PDF editor</strong>. We are deeply committed to your privacy.
          The core principle is simple: <strong>your files never leave your device</strong>.
        </p>
        <p className="mt-3">
          All PDF processing — rendering, text extraction, editing, drawing, and export — happens entirely
          in your browser using client-side JavaScript. No file is ever uploaded to any server, anywhere.
        </p>
      </>
    ),
  },
  {
    id: "data",
    title: "Data We Collect",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
    color: "green",
    content: (
      <ul className="space-y-4">
        {[
          { label: "No file data", desc: "Your PDFs are processed locally and never transmitted to our servers." },
          { label: "No account data", desc: "We require no sign-up or login, so we collect no personal account information." },
          { label: "Anonymous analytics", desc: "We may collect anonymous usage statistics (page views, feature usage) to improve the product. No personally identifiable information is included." },
        ].map((item) => (
          <li key={item.label} className="flex gap-3">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span><strong className="text-slate-800">{item.label}</strong> — {item.desc}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "processing",
    title: "How Your Files Are Processed",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    color: "purple",
    content: (
      <>
        <p>
          When you upload a PDF, it is loaded directly into your browser's memory using the Web File API.
          Every operation — text extraction, annotation, drawing, and export — runs entirely on your device.
        </p>
        <p className="mt-3">
          The resulting edited file is downloaded directly to your device. At no point is your file
          sent to any external server or third party.
        </p>
        <div className="mt-5 flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 text-sm text-purple-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Your PDF content is never readable by us — not even in theory.
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "amber",
    content: (
      <p>
        PDFEdit does <strong>not</strong> use tracking or advertising cookies. We may use essential
        session cookies required for the application to function correctly. No third-party advertising
        or behavioral tracking cookies are used.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Libraries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "teal",
    content: (
      <>
        <p className="mb-4">We use the following open-source libraries, all of which run entirely client-side:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "PDF.js", author: "Mozilla Foundation", desc: "Renders PDF pages in the browser" },
            { name: "pdf-lib", author: "Open source", desc: "Generates and modifies PDF files client-side" },
          ].map((lib) => (
            <div key={lib.name} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm">{lib.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{lib.author}</p>
              <p className="text-sm text-slate-600 mt-1">{lib.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm">No data is shared with these libraries' authors as part of normal usage.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "rose",
    content: (
      <p>
        Since we do not collect or store your files, there is no file data to retain or delete.
        Any anonymous analytics data is retained for up to <strong>12 months</strong> and then permanently deleted.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "indigo",
    content: (
      <ul className="space-y-3">
        {[
          "Know what data we hold about you (we hold none beyond anonymous analytics)",
          "Request deletion of any data we may hold",
          "Opt out of analytics by using a browser with tracking protection enabled",
        ].map((right) => (
          <li key={right} className="flex gap-3 text-sm">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">✓</span>
            <span>{right}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   border: "border-blue-200",   dot: "bg-blue-500" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-200",  dot: "bg-green-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", dot: "bg-purple-500" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200",  dot: "bg-amber-500" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-600",   border: "border-teal-200",   dot: "bg-teal-500" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-600",   border: "border-rose-200",   dot: "bg-rose-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", dot: "bg-indigo-500" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your privacy is our priority
          </div>
          <h1 className="text-5xl font-extrabold mb-5 leading-tight">Privacy Policy</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            We built PDFEdit with a privacy-first architecture. Your documents stay on your device — always.
          </p>
          <p className="text-slate-500 text-sm mt-4">Last updated: January 2025</p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-slate-100 py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "No file uploads", icon: "🔒" },
            { label: "No account required", icon: "👤" },
            { label: "No tracking cookies", icon: "🍪" },
            { label: "100% client-side", icon: "💻" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl">{b.icon}</span>
              <span className="text-sm font-medium text-slate-700">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sticky TOC */}
        <aside className="hidden md:block">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contents</p>
            <nav className="flex flex-col gap-1">
              {sections.map((s) => {
                const c = colorMap[s.color];
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:${c.bg} hover:${c.text} transition-colors`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    {s.title}
                  </a>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Sections */}
        <div className="md:col-span-3 flex flex-col gap-6">
          {sections.map((s) => {
            const c = colorMap[s.color];
            return (
              <section
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className={`flex items-center gap-3 px-6 py-4 border-b ${c.border} ${c.bg}`}>
                  <span className={`${c.text}`}>{s.icon}</span>
                  <h2 className={`font-bold text-slate-800 text-lg`}>{s.title}</h2>
                </div>
                <div className="px-6 py-5 text-slate-600 text-sm leading-relaxed">
                  {s.content}
                </div>
              </section>
            );
          })}

          {/* Changes notice */}
          <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 text-lg mb-3">Changes to This Policy</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We may update this policy from time to time. Changes will be reflected on this page
              with an updated date. Continued use of PDFEdit after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-blue-100 text-sm mb-5">
              If you have any questions about this privacy policy or how we handle data, we're happy to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
