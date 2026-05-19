"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelect: (file: File) => void;
  hero?: boolean;
  compact?: boolean;
}

export default function PDFUploader({ onFileSelect, hero, compact }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFileSelect(accepted[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  // Compact CTA version (bottom of landing page)
  if (compact) {
    return (
      <div className="flex justify-center">
        <div
          {...getRootProps()}
          className={`cursor-pointer flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-dashed transition-all ${
            isDragActive
              ? "border-white bg-white/20"
              : "border-white/40 hover:border-white hover:bg-white/10"
          }`}
        >
          <input {...getInputProps()} />
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-white font-semibold text-lg">
            {isDragActive ? "Drop it here…" : "Drop your PDF or click to browse"}
          </span>
        </div>
      </div>
    );
  }

  // Hero version (inside blue hero section)
  if (hero) {
    return (
      <div
        {...getRootProps()}
        className={`mx-auto max-w-md cursor-pointer rounded-2xl border-2 border-dashed px-10 py-10 text-center transition-all ${
          isDragActive
            ? "border-white bg-white/20"
            : "border-white/30 hover:border-white hover:bg-white/10"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF"}
            </p>
            <p className="text-blue-200 text-sm mt-1">or click to browse — it's free</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No sign-up
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No watermarks
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              100% private
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default standalone version
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div
        {...getRootProps()}
        className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? "Drop your PDF here" : "Drag & drop a PDF"}
            </p>
            <p className="text-sm text-slate-500 mt-1">or click to browse files</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">PDF files only</span>
        </div>
      </div>
    </div>
  );
}
