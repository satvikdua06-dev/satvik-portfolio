"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sfx } from "@/lib/audio";

/**
 * Type "drill" anywhere (outside inputs): manual override — amber particle
 * burst from screen center + HUD acknowledgment.
 */
export default function EasterEgg() {
  const [burst, setBurst] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
      buffer = (buffer + e.key.toLowerCase()).slice(-5);
      if (buffer === "drill") {
        buffer = "";
        sfx.ping();
        window.dispatchEvent(
          new CustomEvent("hud:msg", { detail: "MANUAL OVERRIDE — DRILL MODE ENGAGED" })
        );
        setBurst((b) => b + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!burst || reduced) return null;

  return (
    <div key={burst} aria-hidden className="pointer-events-none fixed inset-0 z-[75]">
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 120 + (i % 5) * 60;
        return (
          <span
            key={i}
            className="absolute top-1/2 left-1/2 block size-1.5 bg-amber"
            style={{
              animation: `egg-fly 1.1s cubic-bezier(0.2,0.8,0.3,1) forwards`,
              ["--tx" as string]: `${Math.cos(angle) * dist}px`,
              ["--ty" as string]: `${Math.sin(angle) * dist}px`,
              animationDelay: `${(i % 6) * 30}ms`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes egg-fly {
          from { transform: translate(0, 0); opacity: 1; }
          to { transform: translate(var(--tx), var(--ty)) ; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
