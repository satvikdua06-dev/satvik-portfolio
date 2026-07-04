"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { STATS } from "@/data/site";
import Starfield from "./Starfield";

function Dial({ value, suffix, label, detail, active }: {
  value: number;
  suffix: string;
  label: string;
  detail: string;
  active: boolean;
}) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  const [p, setP] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (!active || reduced) return;
    const t0 = performance.now();
    const DUR = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / DUR);
      const ease = 1 - Math.pow(1 - k, 3);
      setN(Math.round(value * ease));
      setP(ease);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reduced]);

  // 270° gauge arc
  const R = 44;
  const C = 2 * Math.PI * R * 0.75;

  return (
    <div className="border border-line bg-panel/80 p-6 backdrop-blur-sm">
      <div className="relative mx-auto size-28">
        <svg viewBox="0 0 100 100" className="size-full -rotate-[135deg]" aria-hidden>
          <circle cx="50" cy="50" r={R} fill="none" stroke="#2a251c" strokeWidth="3"
            strokeDasharray={`${C} ${2 * Math.PI * R}`} strokeLinecap="round" />
          <circle cx="50" cy="50" r={R} fill="none" stroke="#e8a020" strokeWidth="3"
            strokeDasharray={`${C * p} ${2 * Math.PI * R}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl text-bone tabular-nums">
            {n.toLocaleString("en-IN")}
            <span className="text-sm text-amber">{suffix}</span>
          </span>
        </div>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] tracking-[0.25em] text-bone uppercase">
        {label}
      </p>
      <p className="mt-2 text-center text-xs leading-relaxed text-dim">{detail}</p>
    </div>
  );
}

/** By-the-numbers, presented as a live gauge cluster over the star field. */
export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      id="telemetry"
      aria-label="Key numbers"
      className="reg-corners relative overflow-hidden border-t border-line bg-void px-6 py-28 md:px-10"
    >
      <Starfield />
      <div className="relative mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.3em] text-amber">
          3100M — TELEMETRY // BY THE NUMBERS
        </p>
        <h2 className="font-display mt-4 text-4xl font-bold uppercase md:text-6xl">
          Instrument cluster<span className="text-amber">.</span>
        </h2>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <Dial key={s.label} {...s} active={inView} />
          ))}
        </div>
        <p className="mt-10 font-mono text-[10px] leading-5 tracking-wider text-dim">
          ALSO IN SERVICE: COMPETENCEGRAPH — NEO4J COMPETENCE-MAPPING GRAPH FOR ONGC HR ·
          ROBOTICS & CONTAINERIZED DEPLOYMENTS · LONG-EXPOSURE SKY WHEN THE RIGS SLEEP
        </p>
      </div>
    </section>
  );
}
