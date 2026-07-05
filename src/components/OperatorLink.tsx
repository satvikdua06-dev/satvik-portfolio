"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The understated hint of /operator in the main descent, between Doctrine
 * and Operations — an instrument-toggle-styled link with a breathing
 * waypoint dot. Saves scroll position so BACK TO SURFACE returns here.
 */
export default function OperatorLink() {
  const reduced = useReducedMotion();
  return (
    <div className="border-t border-line bg-void/30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-14 md:px-10">
        <div className="space-y-1">
          <p className="font-mono text-[10px] tracking-[0.3em] text-amber font-semibold uppercase">
            1100M · SIDE BORE DETECTED — WHO&apos;S RUNNING THIS?
          </p>
          <p className="font-mono text-[9px] tracking-[0.15em] text-dim uppercase">
            [ACCESS PATH STABLE · DEEP TELEMETRY KEY CODE REQUIRED]
          </p>
        </div>
        <Link
          href="/operator"
          data-magnetic
          onClick={() => sessionStorage.setItem("dua-return-y", String(window.scrollY))}
          className="group relative inline-flex items-center gap-3 border border-amber/40 bg-amber/[0.03] px-6 py-3.5 font-mono text-xs tracking-[0.25em] text-amber transition-all duration-300 hover:border-amber hover:bg-amber/10 hover:shadow-[0_0_20px_rgba(212,146,15,0.25)] rounded-[2px]"
        >
          {/* Top-left corner bracket */}
          <span className="absolute -left-px -top-px size-1.5 border-l border-t border-amber opacity-60 group-hover:opacity-100" />
          {/* Bottom-right corner bracket */}
          <span className="absolute -bottom-px -right-px size-1.5 border-b border-r border-amber opacity-60 group-hover:opacity-100" />

          <span className="relative flex size-2">
            <motion.span
              animate={reduced ? undefined : { scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inline-flex h-full w-full rounded-full bg-amber opacity-75"
            />
            <span className="relative inline-flex size-2 rounded-full bg-amber" />
          </span>

          <span className="relative text-bone font-medium group-hover:text-amber transition-colors duration-300">
            OPERATOR PROFILE →
          </span>
        </Link>
      </div>
    </div>
  );
}
