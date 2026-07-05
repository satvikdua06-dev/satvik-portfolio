"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Micro-instruments for the /operator waypoints — small (~100px) readouts in
 * the site's panel language, not illustrations. Amber = signal, teal = live,
 * line/dim for chrome. Every one renders its settled final state under
 * prefers-reduced-motion (no SMIL, no sweeps).
 */

/* ---------------------------------------------------------------- TRAP --- */
// Quadratic arc P0(8,62) P1(60,-10) P2(112,62); the clay "breaks" at t≈0.68.
const ARC = "M 8 62 Q 60 -10 112 62";
const BREAK = { x: 78.7, y: 30.7 };

export function TrapArc({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 120 70" className="h-auto w-[190px] md:w-[240px]" aria-hidden>
      <path d={ARC} fill="none" stroke="#2e2a1f" strokeWidth="1" />
      {/* crosshair at the break point */}
      <g stroke="#4a9b8a" strokeWidth="1" opacity={reduced ? 0.8 : undefined}>
        <line x1={BREAK.x - 6} y1={BREAK.y} x2={BREAK.x + 6} y2={BREAK.y}>
          {active && !reduced && (
            <animate attributeName="opacity" values="0.25;0.25;1;0.25" keyTimes="0;0.6;0.7;1" dur="2.6s" repeatCount="indefinite" />
          )}
        </line>
        <line x1={BREAK.x} y1={BREAK.y - 6} x2={BREAK.x} y2={BREAK.y + 6}>
          {active && !reduced && (
            <animate attributeName="opacity" values="0.25;0.25;1;0.25" keyTimes="0;0.6;0.7;1" dur="2.6s" repeatCount="indefinite" />
          )}
        </line>
      </g>
      {reduced ? (
        // settled state: clay broken at the crosshair
        <g fill="#d4920f">
          <circle cx={BREAK.x - 3} cy={BREAK.y + 2} r="1.2" />
          <circle cx={BREAK.x + 3} cy={BREAK.y - 2} r="1.2" />
          <circle cx={BREAK.x + 1} cy={BREAK.y + 4} r="1" />
        </g>
      ) : (
        active && (
          <circle r="2.4" fill="#d4920f">
            <animateMotion dur="2.6s" repeatCount="indefinite" path={ARC} />
            {/* flash as it crosses the crosshair */}
            <animate attributeName="opacity" values="1;1;0.2;1;1" keyTimes="0;0.66;0.7;0.74;1" dur="2.6s" repeatCount="indefinite" />
          </circle>
        )
      )}
      <text x="8" y="10" fontSize="6" fill="#8a8270" fontFamily="var(--font-mono-face)" letterSpacing="1">
        TRAJECTORY
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------- PISTOL --- */
// grouping near center — fixed offsets, staggered landing
const SHOTS = [
  { x: 2, y: -3 },
  { x: -4, y: 2 },
  { x: 5, y: 4 },
  { x: -2, y: -6 },
  { x: 1, y: 7 },
];

export function PistolTarget({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 90 90" className="h-auto w-[140px] md:w-[170px]" aria-hidden>
      {[38, 29, 20, 11].map((r) => (
        <circle key={r} cx="45" cy="45" r={r} fill="none" stroke="#2e2a1f" strokeWidth="1" />
      ))}
      <line x1="45" y1="3" x2="45" y2="13" stroke="#2e2a1f" strokeWidth="1" />
      <line x1="45" y1="77" x2="45" y2="87" stroke="#2e2a1f" strokeWidth="1" />
      <line x1="3" y1="45" x2="13" y2="45" stroke="#2e2a1f" strokeWidth="1" />
      <line x1="77" y1="45" x2="87" y2="45" stroke="#2e2a1f" strokeWidth="1" />
      {SHOTS.map((s, i) => (
        <motion.circle
          key={i}
          cx={45 + s.x}
          cy={45 + s.y}
          r="1.8"
          fill="#d4920f"
          initial={false}
          animate={{ opacity: active || reduced ? 1 : 0, scale: active || reduced ? 1 : 0.3 }}
          transition={{ duration: 0.15, delay: reduced ? 0 : 0.05 * i }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------- MINI DIAL (shared) --- */
// Same 270° gauge language as the Instrument Cluster, at waypoint scale.
export function MiniDial({
  active,
  fraction,
  display,
  caption,
}: {
  active: boolean;
  fraction: number; // settled arc fill 0..1
  display: (k: number) => string; // center text as fn of eased progress 0..1
  caption: string;
}) {
  const reduced = useReducedMotion();
  const [k, setK] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (!active || reduced) return;
    const t0 = performance.now();
    const DUR = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DUR);
      setK(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  const shown = reduced ? 1 : k;
  const R = 34;
  const FULL = 2 * Math.PI * R;
  const C = FULL * 0.75;

  return (
    <div className="w-[140px] md:w-[170px]" aria-hidden>
      <div className="relative size-[140px] md:size-[170px]">
        <svg viewBox="0 0 90 90" className="size-full -rotate-[135deg]">
          <circle cx="45" cy="45" r={R} fill="none" stroke="#2e2a1f" strokeWidth="3"
            strokeDasharray={`${C} ${FULL}`} strokeLinecap="round" />
          <circle cx="45" cy="45" r={R} fill="none" stroke="#d4920f" strokeWidth="3"
            strokeDasharray={`${C * fraction * shown} ${FULL}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-sm text-bone tabular-nums md:text-base">
          {display(shown)}
        </span>
      </div>
      <p className="mt-1.5 font-mono text-[8px] leading-3 tracking-[0.15em] text-dim uppercase">
        {caption}
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- ASTRO --- */
// deterministic star positions — SSR-safe, no Math.random at render
const STARS = Array.from({ length: 18 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.123;
  return {
    x: 10 + (a - Math.floor(a)) * 90,
    y: 10 + (b - Math.floor(b)) * 90,
    r: i % 5 === 0 ? 1.4 : 0.9,
    o: 0.35 + ((i * 7) % 10) / 18,
  };
});

export function AstroExposure({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const settled = reduced || !active;
  return (
    <svg viewBox="0 0 110 110" className="h-auto w-[160px] md:w-[200px]" aria-hidden>
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e4dfc8" opacity={s.o} />
      ))}
      {/* exposure ring tightens over ~2.5s once activated, then holds */}
      <motion.circle
        cx="55"
        cy="55"
        fill="none"
        stroke="#d4920f"
        strokeWidth="1"
        initial={false}
        animate={{
          r: active || reduced ? 30 : 48,
          strokeOpacity: active || reduced ? 0.55 : 0.15,
        }}
        transition={settled ? { duration: 0 } : { duration: 2.5, ease: "easeOut" }}
      />
      <text x="8" y="104" fontSize="6" fill="#8a8270" fontFamily="var(--font-mono-face)" letterSpacing="1">
        EXPOSURE
      </text>
    </svg>
  );
}
