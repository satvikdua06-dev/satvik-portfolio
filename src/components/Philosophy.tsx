"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";

const STATEMENT =
  "A demo works on your laptop. A system works at 3 AM on a rig with a flaky uplink and nobody watching. I build the second kind.";

const PRINCIPLES = [
  { k: "P-01", v: "Deployed beats impressive. Production is the only benchmark that counts." },
  { k: "P-02", v: "Instrument everything. If you can't see it fail, it already has." },
  { k: "P-03", v: "Edge first. Assume the GPU is small and the network is gone." },
];

/**
 * "Built to ship" doctrine. Pinned; the statement decodes word-by-word as
 * scroll progresses — driven by state from useMotionValueEvent so timing is
 * exact, with CSS transitions doing the easing.
 */
export default function Philosophy() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const words = STATEMENT.split(" ");
  const [revealed, setRevealed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start 0.8", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setRevealed(Math.round(Math.min(1, v / 0.75) * words.length));
  });

  return (
    <div ref={wrap} id="philosophy" className="relative bg-void md:h-[220vh]">
      <section
        className="reg-corners top-0 flex min-h-screen flex-col justify-center px-6 py-24 md:sticky md:h-screen md:px-10"
        aria-label="Philosophy"
      >
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.3em] text-amber">
            740M — DOCTRINE // BUILT TO SHIP
          </p>
          <h2 className="mt-8 max-w-4xl font-display text-4xl leading-[1.08] font-semibold uppercase md:text-6xl">
            {words.map((w, i) => (
              <span
                key={i}
                className={`inline-block transition-colors duration-300 ${
                  reduced || i < revealed ? "text-bone" : "text-[#22313a]"
                }`}
              >
                {w}&nbsp;
              </span>
            ))}
          </h2>

          <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.k} className="bg-panel p-5">
                <p className="font-mono text-[10px] tracking-[0.25em] text-scope">{p.k}</p>
                <p className="mt-3 text-sm leading-relaxed text-dim">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
