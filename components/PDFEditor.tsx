"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Toolbar from "@/components/Toolbar";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface TextAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

interface Props {
  file: File;
}

export default function PDFEditor({ file }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [activeTool, setActiveTool] = useState<"select" | "text" | "highlight">("select");
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);

  // Load PDF.js
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();

      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setLoading(false);
    };
    loadPdf();
  }, [file]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;
    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Draw annotations for current page
    const pageAnnotations = annotations.filter((a) => a.page === currentPage);
    pageAnnotations.forEach((ann) => {
      ctx.font = `${ann.fontSize * scale}px Arial`;
      ctx.fillStyle = ann.color;
      ctx.fillText(ann.text, ann.x * scale, ann.y * scale);
    });
  }, [pdfDoc, currentPage, scale, annotations]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "text") return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const id = `ann-${Date.now()}`;
    const newAnnotation: TextAnnotation = {
      id,
      page: currentPage,
      x,
      y,
      text: "Type here",
      fontSize,
      color: fontColor,
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    setEditingId(id);
  };

  const updateAnnotation = (id: string, text: string) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, text } : a))
    );
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setEditingId(null);
  };

  const handleSave = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfLibDoc = await PDFDocument.load(arrayBuffer);
    const font = await pdfLibDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfLibDoc.getPages();

    for (const ann of annotations) {
      const page = pages[ann.page - 1];
      if (!page) continue;
      const { height } = page.getSize();

      // Convert hex color to rgb
      const hex = ann.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      page.drawText(ann.text, {
        x: ann.x,
        y: height - ann.y - ann.fontSize,
        size: ann.fontSize,
        font,
        color: rgb(r, g, b),
      });
    }

    const pdfBytes = await pdfLibDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    saveAs(blob, `edited-${file.name}`);
  };

  const pageAnnotations = annotations.filter((a) => a.page === currentPage);

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontColor={fontColor}
        setFontColor={setFontColor}
        onSave={handleSave}
        scale={scale}
        setScale={setScale}
      />

      <div className="flex gap-4">
        {/* Canvas area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-700 rounded-xl p-4 flex justify-center"
          style={{ minHeight: "75vh" }}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full text-white">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
            </div>
          ) : (
            <div className="relative inline-block shadow-2xl">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`block ${activeTool === "text" ? "cursor-text" : "cursor-default"}`}
              />
              {/* Overlay text inputs for annotations */}
              {pageAnnotations.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    position: "absolute",
                    left: ann.x * scale,
                    top: ann.y * scale,
                    zIndex: 10,
                  }}
                >
                  {editingId === ann.id ? (
                    <div className="flex items-start gap-1">
                      <input
                        autoFocus
                        value={ann.text}
                        onChange={(e) => updateAnnotation(ann.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        style={{
                          fontSize: ann.fontSize * scale,
                          color: ann.color,
                          background: "rgba(255,255,255,0.85)",
                          border: "1px dashed #3b82f6",
                          outline: "none",
                          padding: "2px 4px",
                          minWidth: 80,
                          borderRadius: 3,
                        }}
                      />
                      <button
                        onMouseDown={() => deleteAnnotation(ann.id)}
                        className="bg-red-500 text-white rounded text-xs px-1 py-0.5 mt-1"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => {
                        if (activeTool === "select") setEditingId(ann.id);
                      }}
                      style={{
                        fontSize: ann.fontSize * scale,
                        color: ann.color,
                        cursor: activeTool === "select" ? "pointer" : "default",
                        userSelect: "none",
                        background: "transparent",
                      }}
                    >
                      {ann.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 bg-white rounded-xl py-3 px-6 shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-medium"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-600">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-medium"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
