"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { SITE } from "@/data/site";

/**
 * Hero. Transparent over the seismic background; on scroll the stage scales
 * down and dims — a camera pulling back from the console.
 */
export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.4 });
  const scale = useTransform(smooth, [0, 1], [1, 0.93]);
  const opacity = useTransform(smooth, [0, 0.9], [1, 0]);
  const y = useTransform(smooth, [0, 1], ["0%", "10%"]);

  return (
    <div ref={wrap} id="hero" className="relative h-[130vh]">
      <motion.section
        style={reduced ? undefined : { scale, opacity, y }}
        className="reg-corners sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
        aria-label="Introduction"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-dim md:text-xs">
            {SITE.eyebrow}
          </p>
          <h1 className="font-display mt-6 text-[20vw] leading-[0.88] font-semibold tracking-tight text-bone uppercase md:text-[11rem]">
            Satvik
            <br />
            Dua<span className="text-amber">.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-dim md:text-lg">
            {SITE.positioning}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              data-magnetic
              className="inline-block border border-amber bg-amber px-6 py-3 font-mono text-xs tracking-[0.2em] text-void transition-colors hover:bg-transparent hover:text-amber"
            >
              VIEW OPERATIONS ↓
            </a>
            <a
              href="#contact"
              data-magnetic
              className="inline-block border border-line px-6 py-3 font-mono text-xs tracking-[0.2em] text-dim transition-colors hover:border-scope hover:text-scope"
            >
              OPEN UPLINK
            </a>
          </div>
        </div>

        {/* scroll cue styled as a drill-string marker */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-mono text-[10px] tracking-[0.25em] text-dim">
          <p>SCROLL TO DESCEND</p>
          <motion.div
            aria-hidden
            className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-amber to-transparent"
            animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </div>
      </motion.section>
    </div>
  );
}
