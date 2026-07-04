"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINES = [
  "> DUA/OS v2.6 — field build",
  "> mounting sensor array .......... OK",
  "> calibrating depth gauge ........ OK",
  "> uplink to surface .............. STABLE",
  "> operator: SATVIK DUA",
];

const TOTAL_MS = 1900;

/**
 * First-load boot overlay. Skippable via any key / tap, runs once per session,
 * and is skipped entirely under prefers-reduced-motion. The page renders
 * underneath — this never gates content.
 */
export default function Boot() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"init" | "running" | "done">("init");
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | undefined;
    let end: ReturnType<typeof setTimeout> | undefined;

    function finish() {
      if (doneRef.current) return;
      doneRef.current = true;
      sessionStorage.setItem("dua-os-booted", "1");
      setPhase("done");
    }
    const skip = () => finish();

    // Deferred a frame: the decision reads client-only state (sessionStorage)
    // and settles after first paint, keeping the effect body render-free.
    const raf = requestAnimationFrame(() => {
      if (reduced || sessionStorage.getItem("dua-os-booted")) {
        doneRef.current = true;
        setPhase("done");
        return;
      }
      setPhase("running");
      const step = TOTAL_MS / LINES.length;
      iv = setInterval(() => {
        setShown((n) => {
          if (n + 1 >= LINES.length) clearInterval(iv);
          return Math.min(n + 1, LINES.length);
        });
      }, step);
      end = setTimeout(finish, TOTAL_MS + 450);
      window.addEventListener("keydown", skip);
      window.addEventListener("pointerdown", skip);
    });

    return () => {
      cancelAnimationFrame(raf);
      if (iv) clearInterval(iv);
      if (end) clearTimeout(end);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {phase === "running" && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          aria-hidden
        >
          <div className="w-[min(92vw,560px)] px-6">
            <p className="font-display text-5xl font-bold tracking-tight text-bone md:text-6xl">
              DUA<span className="text-amber">/</span>OS
            </p>
            <div className="mt-6 h-px w-full bg-line" />
            <div className="mt-5 min-h-[7.5rem] font-mono text-[11px] leading-6 text-dim md:text-xs">
              {LINES.slice(0, shown).map((l) => (
                <p key={l}>
                  {l.includes("OK") || l.includes("STABLE") ? (
                    <>
                      {l.split(/(OK|STABLE)/)[0]}
                      <span className="text-scope">{l.match(/OK|STABLE/)?.[0]}</span>
                    </>
                  ) : (
                    <span className={l.includes("SATVIK") ? "text-amber" : undefined}>{l}</span>
                  )}
                </p>
              ))}
              <span className="blink text-amber">▊</span>
            </div>
            <div className="mt-4 h-0.5 w-full overflow-hidden bg-line">
              <motion.div
                className="h-full bg-amber"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
              />
            </div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-dim">
              PRESS ANY KEY TO SKIP
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
