"use client";

import Link from "next/link";
import { NAV_SECTIONS } from "@/data/site";

const linkClass =
  "group font-mono text-[10px] tracking-[0.25em] text-dim transition-colors hover:text-amber";

/**
 * Top strip: wordmark + station links (desktop) + palette trigger.
 * Entries with an href are routes (/operator); the rest are anchors.
 * On mobile the palette IS the menu.
 */
export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between border-b border-line/60 bg-void/70 px-4 py-3 backdrop-blur-sm md:px-6">
      <a
        href="#hero"
        className="font-display text-lg font-bold tracking-tight text-bone"
        aria-label="Back to top"
      >
        DUA<span className="text-amber">/</span>OS
      </a>
      <nav aria-label="Sections" className="hidden items-center gap-6 md:flex">
        {NAV_SECTIONS.slice(1).map((s) =>
          s.href ? (
            <Link
              key={s.id}
              href={s.href}
              onClick={() => sessionStorage.setItem("dua-return-y", String(window.scrollY))}
              className={linkClass}
            >
              <span className="text-line group-hover:text-amber/60">{s.index}</span>{" "}
              {s.label.toUpperCase()} ↗
            </Link>
          ) : (
            <a key={s.id} href={`#${s.id}`} className={linkClass}>
              <span className="text-line group-hover:text-amber/60">{s.index}</span>{" "}
              {s.label.toUpperCase()}
            </a>
          )
        )}
      </nav>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("palette:open"))}
        className="border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-dim transition-colors hover:border-amber hover:text-amber"
        aria-label="Open command palette"
      >
        ⌘K
      </button>
    </header>
  );
}
