"use client";

import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import PDFEditor from "@/components/PDFEditor";

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <svg className="w-7 h-7 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
        </svg>
        <h1 className="text-xl font-semibold text-slate-800">PDF Editor</h1>
        {pdfFile && (
          <button
            onClick={() => setPdfFile(null)}
            className="ml-auto text-sm text-slate-500 hover:text-slate-800 border border-slate-300 rounded px-3 py-1"
          >
            ← Upload new file
          </button>
        )}
      </header>

      <div className="p-6">
        {!pdfFile ? (
          <PDFUploader onFileSelect={setPdfFile} />
        ) : (
          <PDFEditor file={pdfFile} />
        )}
      </div>
    </main>
  );
}
