"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Nav() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact" },
  ];







  
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-6 sticky top-0 z-50 shadow-sm">
      <Link href="/" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">NEXPDF</span>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Free</span>
      </Link>

      <nav className="flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === l.href
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
