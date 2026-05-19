"use client";

interface Props {
  activeTool: "select" | "text" | "draw";
  setActiveTool: (t: "select" | "text" | "draw") => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  fontColor: string;
  setFontColor: (c: string) => void;
  strokeSize: number;
  setStrokeSize: (n: number) => void;
  drawColor: string;
  setDrawColor: (c: string) => void;
  onSave: () => void;
  scale: number;
  setScale: (s: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const tools = [
  {
    id: "select",
    label: "Select / Edit",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6-6m0 0l6-6m-6 6h12" />
      </svg>
    ),
  },
  {
    id: "text",
    label: "Add Text",
    icon: <span className="font-bold text-base leading-none">T</span>,
  },
  {
    id: "draw",
    label: "Draw",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3.414a2 2 0 01.586-1.414z" />
      </svg>
    ),
  },
] as const;

export default function Toolbar({
  activeTool,
  setActiveTool,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  strokeSize,
  setStrokeSize,
  drawColor,
  setDrawColor,
  onSave,
  scale,
  setScale,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 flex flex-wrap items-center gap-4">
      {/* Tools */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTool === tool.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>

      {/* Undo / Redo */}
      <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
          Redo
        </button>
      </div>

      {/* Text options — only when text tool active */}
      {activeTool === "text" && (
        <>
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <label className="text-xs text-slate-500 font-medium">Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white"
            >
              {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
                <option key={s} value={s}>{s}px</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <label className="text-xs text-slate-500 font-medium">Color</label>
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
          </div>
        </>
      )}

      {/* Draw options — only when draw tool active */}
      {activeTool === "draw" && (
        <>
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <label className="text-xs text-slate-500 font-medium">Stroke</label>
            <input
              type="range"
              min={1}
              max={20}
              value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              className="w-24 accent-blue-600"
            />
            <span className="text-xs text-slate-500 w-5">{strokeSize}</span>
          </div>
          <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
            <label className="text-xs text-slate-500 font-medium">Color</label>
            <input
              type="color"
              value={drawColor}
              onChange={(e) => setDrawColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-slate-200"
            />
            {/* Quick color swatches */}
            <div className="flex gap-1">
              {["#000000", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b"].map((c) => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  style={{ background: c }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                    drawColor === c ? "border-blue-500 scale-110" : "border-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Zoom */}
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <label className="text-xs text-slate-500 font-medium">Zoom</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-sm font-bold"
          >−</button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(3, scale + 0.25))}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-sm font-bold"
          >+</button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}
