"use client";

interface Props {
  activeTool: "select" | "text" | "highlight";
  setActiveTool: (t: "select" | "text" | "highlight") => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  fontColor: string;
  setFontColor: (c: string) => void;
  onSave: () => void;
  scale: number;
  setScale: (s: number) => void;
}

const tools = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "text", label: "Add Text", icon: "T" },
] as const;

export default function Toolbar({
  activeTool,
  setActiveTool,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  onSave,
  scale,
  setScale,
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
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTool === tool.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span className="mr-1">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      {/* Font size */}
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <label className="text-xs text-slate-500 font-medium">Size</label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white"
        >
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <label className="text-xs text-slate-500 font-medium">Color</label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
        />
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <label className="text-xs text-slate-500 font-medium">Zoom</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-sm font-bold"
          >
            −
          </button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(3, scale + 0.25))}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-sm font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}
