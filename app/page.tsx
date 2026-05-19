"use client";

import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import PDFEditor from "@/components/PDFEditor";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-slate-50">
      {!pdfFile ? (
        <>
          {/* Hero */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                No sign-up required · 100% free · Works in browser
              </div>
              <h1 className="text-5xl font-extrabold mb-5 leading-tight">
                Edit PDFs like a<br />
                <span className="text-blue-200">Google Doc</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-xl mx-auto mb-10">
                Click on any text in your PDF to edit it. Add new text, draw annotations, and download the updated file — all without leaving your browser.
              </p>
              <PDFUploader onFileSelect={setPdfFile} hero />
            </div>
          </section>

          {/* Features */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">Everything you need to edit a PDF</h2>
              <p className="text-slate-500 text-center mb-14">No installs. No accounts. Just open and edit.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((f) => (
                  <div key={f.title} className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.bg}`}>
                      {f.icon}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-lg">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="py-20 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-800 text-center mb-3">How it works</h2>
              <p className="text-slate-500 text-center mb-14">Three steps to a perfectly edited PDF.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {steps.map((s, i) => (
                  <div key={s.title} className="relative flex flex-col items-center text-center gap-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-0.5 bg-blue-200" />
                    )}
                    <h3 className="font-semibold text-slate-800">{s.title}</h3>
                    <p className="text-slate-500 text-sm">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to edit your PDF?</h2>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">Drop your file below and start editing in seconds. No account needed.</p>
            <PDFUploader onFileSelect={setPdfFile} hero={false} compact />
          </section>
        </>
      ) : (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500 truncate max-w-xs">
              Editing: <span className="font-medium text-slate-700">{pdfFile.name}</span>
            </p>
            <button
              onClick={() => setPdfFile(null)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-1.5 transition-colors"
            >
              ← Upload new file
            </button>
          </div>
          <PDFEditor file={pdfFile} />
        </div>
      )}
    </main>
  );
}

const features = [
  {
    title: "Edit Existing Text",
    desc: "Click on any text in your PDF to edit it inline. Change wording, fix typos, or update content without reformatting.",
    bg: "bg-blue-50",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    title: "Add New Text",
    desc: "Place new text boxes anywhere on the page. Choose font size and color to match your document's style.",
    bg: "bg-green-50",
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: "Draw & Annotate",
    desc: "Use the freehand pencil tool to draw, highlight, or annotate any part of the document with custom colors.",
    bg: "bg-purple-50",
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z" />
      </svg>
    ),
  },
  {
    title: "Undo / Redo",
    desc: "Made a mistake? No problem. Full undo and redo history keeps every change reversible at any time.",
    bg: "bg-orange-50",
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
  {
    title: "Multi-page Support",
    desc: "Navigate through all pages of your PDF. Edits are tracked per page and all saved into the final download.",
    bg: "bg-teal-50",
    icon: (
      <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Download Instantly",
    desc: "Export your edited PDF with one click. All changes are baked into the file — ready to share or print.",
    bg: "bg-red-50",
    icon: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Upload your PDF",
    desc: "Drag and drop or click to select any PDF file from your device.",
  },
  {
    title: "Edit your content",
    desc: "Click text to edit it, add new text boxes, or draw freehand annotations.",
  },
  {
    title: "Download the result",
    desc: "Hit Download PDF and get your edited file instantly — no watermarks.",
  },
];
