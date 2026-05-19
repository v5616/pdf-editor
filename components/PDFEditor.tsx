"use client";

import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/Toolbar";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface ExtractedText {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  edited: boolean;
  newText: string;
}

interface NewAnnotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

interface DrawPath {
  id: string;
  page: number;
  points: { x: number; y: number }[];
  color: string;
  strokeSize: number;
}

interface HistoryEntry {
  extractedTexts: ExtractedText[];
  newAnnotations: NewAnnotation[];
  drawPaths: DrawPath[];
}

interface Props {
  file: File;
}

export default function PDFEditor({ file }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [extractedTexts, setExtractedTexts] = useState<ExtractedText[]>([]);
  const [newAnnotations, setNewAnnotations] = useState<NewAnnotation[]>([]);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([]);
  const [activeTool, setActiveTool] = useState<"select" | "text" | "draw">("select");
  const [fontSize, setFontSize] = useState(14);
  const [fontColor, setFontColor] = useState("#000000");
  const [strokeSize, setStrokeSize] = useState(3);
  const [drawColor, setDrawColor] = useState("#ef4444");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Drawing state refs (not state to avoid re-renders during draw)
  const isDrawing = useRef(false);
  const currentPath = useRef<{ x: number; y: number }[]>([]);

  // Undo/redo history
  const history = useRef<HistoryEntry[]>([]);
  const historyIndex = useRef(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushHistory = (
    texts: ExtractedText[],
    annotations: NewAnnotation[],
    paths: DrawPath[]
  ) => {
    // Drop any redo states ahead of current index
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push({
      extractedTexts: texts,
      newAnnotations: annotations,
      drawPaths: paths,
    });
    historyIndex.current = history.current.length - 1;
    setCanUndo(historyIndex.current > 0);
    setCanRedo(false);
  };

  const undo = () => {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    const entry = history.current[historyIndex.current];
    setExtractedTexts(entry.extractedTexts);
    setNewAnnotations(entry.newAnnotations);
    setDrawPaths(entry.drawPaths);
    setCanUndo(historyIndex.current > 0);
    setCanRedo(true);
  };

  const redo = () => {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    const entry = history.current[historyIndex.current];
    setExtractedTexts(entry.extractedTexts);
    setNewAnnotations(entry.newAnnotations);
    setDrawPaths(entry.drawPaths);
    setCanUndo(true);
    setCanRedo(historyIndex.current < history.current.length - 1);
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canUndo, canRedo]);

  // Load PDF, extract text, then render first page
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

      // Extract text from all pages
      const allTexts: ExtractedText[] = [];
      for (let p = 1; p <= doc.numPages; p++) {
        const page = await doc.getPage(p);
        const viewport = page.getViewport({ scale: 1 });
        const textContent = await page.getTextContent();
        textContent.items.forEach((item: any, i: number) => {
          if (!item.str?.trim()) return;
          const tx = item.transform;
          const x = tx[4];
          const y = viewport.height - tx[5];
          const itemFontSize = Math.abs(tx[3]) || Math.abs(tx[0]) || 12;
          const width = item.width || itemFontSize * item.str.length * 0.6;
          const height = itemFontSize * 1.2;
          allTexts.push({
            id: `ext-${p}-${i}`,
            page: p,
            x,
            y: y - itemFontSize,
            width,
            height,
            text: item.str,
            fontSize: itemFontSize,
            edited: false,
            newText: item.str,
          });
        });
      }
      setExtractedTexts(allTexts);

      // Push initial history entry
      history.current = [{ extractedTexts: allTexts, newAnnotations: [], drawPaths: [] }];
      historyIndex.current = 0;
      setCanUndo(false);
      setCanRedo(false);

      // Render first page directly using doc (don't wait for pdfDoc state)
      if (!canvasRef.current) return;
      const firstPage = await doc.getPage(1);
      const vp = firstPage.getViewport({ scale });
      const offscreen = document.createElement("canvas");
      offscreen.width = vp.width;
      offscreen.height = vp.height;
      await firstPage.render({ canvasContext: offscreen.getContext("2d")!, viewport: vp }).promise;
      const canvas = canvasRef.current;
      canvas.width = vp.width;
      canvas.height = vp.height;
      canvas.getContext("2d")!.drawImage(offscreen, 0, 0);
      setCanvasSize({ width: vp.width, height: vp.height });
      setLoading(false); // ← spinner stops here, after canvas is painted
    };
    loadPdf();
  }, [file]);

  // Render current page on canvas — render offscreen first to avoid blank flash
  // (rendering is handled directly in the effect below)

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!pdfDoc || !canvasRef.current) return;
      setPageLoading(true);
      const page = await pdfDoc.getPage(currentPage);
      const viewport = page.getViewport({ scale });

      const offscreen = document.createElement("canvas");
      offscreen.width = viewport.width;
      offscreen.height = viewport.height;
      const offCtx = offscreen.getContext("2d")!;
      const renderTask = page.render({ canvasContext: offCtx, viewport });
      await renderTask.promise;

      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.getContext("2d")!.drawImage(offscreen, 0, 0);
      setCanvasSize({ width: viewport.width, height: viewport.height });
      setPageSize({ width: viewport.width / scale, height: viewport.height / scale });
      setPageLoading(false);
    };
    run();
    return () => { cancelled = true; };
  }, [pdfDoc, currentPage, scale]);

  // Redraw the draw canvas whenever paths or page changes
  useEffect(() => {
    const dc = drawCanvasRef.current;
    const pc = canvasRef.current;
    if (!dc || !pc) return;
    // Only resize if dimensions changed to avoid clearing mid-draw
    if (dc.width !== pc.width || dc.height !== pc.height) {
      dc.width = pc.width;
      dc.height = pc.height;
    }
    const ctx = dc.getContext("2d")!;
    ctx.clearRect(0, 0, dc.width, dc.height);
    drawPaths
      .filter((p) => p.page === currentPage)
      .forEach((path) => {
        if (path.points.length < 2) return;
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.strokeSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
      });
  }, [drawPaths, currentPage, canvasSize]);

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== "draw") return;
    isDrawing.current = true;
    const pt = getCanvasPoint(e, e.currentTarget);
    currentPath.current = [pt];
  };

  // Window-level move and up handlers attached via useEffect
  useEffect(() => {
    if (activeTool !== "draw") return;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current || !drawCanvasRef.current) return;
      const dc = drawCanvasRef.current;
      const rect = dc.getBoundingClientRect();
      const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      currentPath.current.push(pt);

      const ctx = dc.getContext("2d")!;
      const pts = currentPath.current;
      if (pts.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = strokeSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    };

    const onMouseUp = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      if (currentPath.current.length < 2) { currentPath.current = []; return; }
      const newPath: DrawPath = {
        id: `draw-${Date.now()}`,
        page: currentPage,
        points: [...currentPath.current],
        color: drawColor,
        strokeSize,
      };
      setDrawPaths((prev) => {
        const updated = [...prev, newPath];
        pushHistory(extractedTexts, newAnnotations, updated);
        return updated;
      });
      currentPath.current = [];
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [activeTool, drawColor, strokeSize, currentPage]);

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || activeTool !== "draw") return;
    const pt = getCanvasPoint(e, e.currentTarget);
    currentPath.current.push(pt);

    // Live draw on the draw canvas
    const dc = drawCanvasRef.current;
    if (!dc) return;
    const ctx = dc.getContext("2d")!;
    const pts = currentPath.current;
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = strokeSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    if (!isDrawing.current || activeTool !== "draw") return;
    isDrawing.current = false;
    if (currentPath.current.length < 2) return;
    setDrawPaths((prev) => [
      ...prev,
      {
        id: `draw-${Date.now()}`,
        page: currentPage,
        points: [...currentPath.current],
        color: drawColor,
        strokeSize,
      },
    ]);
    currentPath.current = [];
  };

  // Click on canvas: either select existing text or place new annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const cx = (e.clientX - rect.left) / scale;
    const cy = (e.clientY - rect.top) / scale;

    if (activeTool === "select") {
      // Check if click hits an extracted text block
      const hit = extractedTexts.find(
        (t) =>
          t.page === currentPage &&
          cx >= t.x - 4 &&
          cx <= t.x + t.width + 4 &&
          cy >= t.y - 4 &&
          cy <= t.y + t.height + 4
      );
      if (hit) {
        setEditingId(hit.id);
      } else {
        setEditingId(null);
      }
      return;
    }

    if (activeTool === "text") {
      const id = `new-${Date.now()}`;
      const ann = { id, page: currentPage, x: cx, y: cy, text: "Type here", fontSize, color: fontColor };
      const updated = [...newAnnotations, ann];
      setNewAnnotations(updated);
      pushHistory(extractedTexts, updated, drawPaths);
      setEditingId(id);
    }
  };

  const updateExtracted = (id: string, newText: string) => {
    setExtractedTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, newText, edited: true } : t))
    );
  };

  // Push history when text edit is committed (called on blur)
  const commitExtracted = (id: string) => {
    const updated = extractedTexts.map((t) =>
      t.id === id ? { ...t, edited: true } : t
    );
    pushHistory(updated, newAnnotations, drawPaths);
  };

  const updateNew = (id: string, text: string) => {
    setNewAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, text } : a)));
  };

  const deleteNew = (id: string) => {
    const updated = newAnnotations.filter((a) => a.id !== id);
    setNewAnnotations(updated);
    pushHistory(extractedTexts, updated, drawPaths);
    setEditingId(null);
  };

  // Save: white-out edited originals, draw new text, embed new annotations
  const handleSave = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfLibDoc = await PDFDocument.load(arrayBuffer);
    const font = await pdfLibDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfLibDoc.getPages();

    for (const t of extractedTexts) {
      if (!t.edited) continue;
      const page = pages[t.page - 1];
      if (!page) continue;
      const { height } = page.getSize();
      const pdfY = height - t.y - t.height; // convert back to PDF bottom-left

      // White rectangle to cover original text
      page.drawRectangle({
        x: t.x - 1,
        y: pdfY - 2,
        width: t.width + 4,
        height: t.height + 4,
        color: rgb(1, 1, 1),
        borderWidth: 0,
      });

      // Draw replacement text
      page.drawText(t.newText, {
        x: t.x,
        y: pdfY + 2,
        size: t.fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    for (const ann of newAnnotations) {
      const page = pages[ann.page - 1];
      if (!page) continue;
      const { height } = page.getSize();
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

    // Embed draw paths as lines
    for (const path of drawPaths) {
      const page = pages[path.page - 1];
      if (!page || path.points.length < 2) continue;
      const { height } = page.getSize();
      const hex = path.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      for (let i = 1; i < path.points.length; i++) {
        const p1 = path.points[i - 1];
        const p2 = path.points[i];
        page.drawLine({
          start: { x: p1.x / scale, y: height - p1.y / scale },
          end:   { x: p2.x / scale, y: height - p2.y / scale },
          thickness: path.strokeSize / scale,
          color: rgb(r, g, b),
        });
      }
    }

    const pdfBytes = await pdfLibDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    saveAs(blob, `edited-${file.name}`);
  };

  const pageExtracted = extractedTexts.filter((t) => t.page === currentPage);
  const pageNew = newAnnotations.filter((a) => a.page === currentPage);

  return (
    <div className="flex flex-col gap-4">
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontColor={fontColor}
        setFontColor={setFontColor}
        strokeSize={strokeSize}
        setStrokeSize={setStrokeSize}
        drawColor={drawColor}
        setDrawColor={setDrawColor}
        onSave={handleSave}
        scale={scale}
        setScale={setScale}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />

      <div className="overflow-auto bg-slate-700 rounded-xl p-4 flex justify-center" style={{ minHeight: "75vh" }}>
        {loading && (
          <div className="flex flex-col items-center justify-center w-full gap-3 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
            <span className="text-sm text-white/70">Loading PDF…</span>
          </div>
        )}
        <div
          className="relative shadow-2xl"
          style={{
            display: loading ? "none" : "inline-block",
            width: canvasSize.width || "auto",
            height: canvasSize.height || "auto",
          }}
          onClick={handleCanvasClick}
        >
            {/* PDF render */}
            <canvas ref={canvasRef} className="block" />

            {/* Page loading overlay */}
            {pageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            )}

            {/* Draw canvas — sits on top, captures mouse when draw tool active */}
            <canvas
              ref={drawCanvasRef}
              onMouseDown={handleDrawStart}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                cursor: activeTool === "draw" ? "crosshair" : "default",
                pointerEvents: activeTool === "draw" ? "auto" : "none",
                zIndex: activeTool === "draw" ? 100 : 0,
              }}
            />

            {/* Extracted text overlays */}
            {pageExtracted.map((t) => {
              const isEditing = editingId === t.id;
              return (
                <div
                  key={t.id}
                  style={{
                    position: "absolute",
                    left: t.x * scale,
                    top: t.y * scale,
                    width: Math.max(t.width * scale, 60),
                    height: t.height * scale,
                    zIndex: 10,
                    pointerEvents: activeTool === "draw" ? "none" : "auto",
                  }}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      value={t.newText}
                      onChange={(e) => updateExtracted(t.id, e.target.value)}
                      onBlur={() => { commitExtracted(t.id); setEditingId(null); }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: Math.max(t.width * scale, 80),
                        maxWidth: canvasSize.width - t.x * scale - 8,
                        height: t.height * scale,
                        fontSize: t.fontSize * scale,
                        lineHeight: 1,
                        background: "rgba(255,255,200,0.95)",
                        border: "1.5px solid #3b82f6",
                        outline: "none",
                        padding: "0 2px",
                        borderRadius: 2,
                        fontFamily: "Arial, sans-serif",
                        boxSizing: "border-box",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    />
                  ) : (
                    <div
                      title="Click to edit"
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: activeTool === "select" ? "text" : "default",
                        background: t.edited ? "rgba(254,240,138,0.4)" : "transparent",
                        border: t.edited ? "1px dashed #ca8a04" : "1px solid transparent",
                        borderRadius: 2,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (activeTool === "select")
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(219,234,254,0.5)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          t.edited ? "rgba(254,240,138,0.4)" : "transparent";
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* New annotation overlays */}
            {pageNew.map((ann) => {
              const isEditing = editingId === ann.id;
              return (
                <div
                  key={ann.id}
                  style={{
                    position: "absolute",
                    left: ann.x * scale,
                    top: ann.y * scale,
                    zIndex: 20,
                    pointerEvents: activeTool === "draw" ? "none" : "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isEditing ? (
                    <div className="flex items-start gap-1">
                      <input
                        autoFocus
                        value={ann.text}
                        onChange={(e) => updateNew(ann.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        style={{
                          fontSize: ann.fontSize * scale,
                          color: ann.color,
                          background: "rgba(255,255,255,0.92)",
                          border: "1.5px dashed #3b82f6",
                          outline: "none",
                          padding: "2px 4px",
                          minWidth: 80,
                          maxWidth: canvasSize.width - ann.x * scale - 40,
                          borderRadius: 3,
                          fontFamily: "Arial, sans-serif",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        onMouseDown={() => deleteNew(ann.id)}
                        className="bg-red-500 text-white rounded text-xs px-1 py-0.5"
                      >✕</button>
                    </div>
                  ) : (
                    <span
                      onClick={() => setEditingId(ann.id)}
                      style={{
                        fontSize: ann.fontSize * scale,
                        color: ann.color,
                        cursor: "pointer",
                        userSelect: "none",
                        fontFamily: "Arial, sans-serif",
                      }}
                    >{ann.text}</span>
                  )}
                </div>
              );
            })}
          </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 bg-white rounded-xl py-3 px-6 shadow-sm">
          <button
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); setEditingId(null); }}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-medium"
          >← Prev</button>
          <span className="text-sm text-slate-600">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); setEditingId(null); }}
            disabled={currentPage === totalPages}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-sm font-medium"
          >Next →</button>
        </div>
      )}
    </div>
  );
}
