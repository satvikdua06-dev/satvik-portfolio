"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Custom cursor: instant amber dot + lagging radar ring with a rotating sweep.
 * Ring expands over interactive targets; elements marked data-magnetic are
 * pulled a few px toward the pointer. Pointer-fine devices only.
 */
export default function Cursor() {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<"idle" | "link">("idle");
  const reduced = useReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 400, damping: 35 });
  const ringY = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const raf = requestAnimationFrame(() => setActive(true));
    document.documentElement.classList.add("has-cursor");

    let magnetEl: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (magnetEl) {
        const r = magnetEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnetEl.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [role='button'], [data-cursor]"
      );
      setMode(t ? "link" : "idle");
      const m = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (m !== magnetEl) {
        if (magnetEl) magnetEl.style.transform = "";
        magnetEl = m;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      if (magnetEl) magnetEl.style.transform = "";
    };
  }, [reduced, x, y]);

  if (!active) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute size-1.5 rounded-full bg-amber"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute rounded-full border border-amber/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "link" ? 52 : 32,
          height: mode === "link" ? 52 : 32,
          opacity: mode === "link" ? 1 : 0.55,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* radar sweep */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(212,146,15,0.3), transparent 70deg, transparent 360deg)",
            animation: "sweep 2.4s linear infinite",
          }}
        />
        <style>{`@keyframes sweep { to { transform: rotate(360deg) } }`}</style>
      </motion.div>
    </div>
  );
}
