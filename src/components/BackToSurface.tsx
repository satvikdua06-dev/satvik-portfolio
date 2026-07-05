"use client";

import Link from "next/link";

/**
 * Fixed return link on /operator, in the HUD's language. Sets the restore
 * flag so the main page scrolls back to where the visitor left from.
 */
export default function BackToSurface() {
  return (
    <Link
      href="/"
      onClick={() => sessionStorage.setItem("dua-restore", "1")}
      className="fixed top-4 left-4 z-[70] border border-line bg-void/80 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-dim backdrop-blur-sm transition-colors hover:border-amber hover:text-amber"
    >
      ← BACK TO SURFACE
    </Link>
  );
}
