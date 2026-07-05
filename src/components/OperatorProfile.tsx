"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { sfx } from "@/lib/audio";
import { AstroExposure, MiniDial, PistolTarget, TrapArc } from "./WaypointInstruments";

/**
 * OPERATOR PROFILE — the /operator route body. A winding survey-route SVG
 * runs the height of the page; a glowing point travels it in sync with
 * scroll, the traveled segment stays lit, and waypoints latch open with a
 * sonar ping as the light reaches them.
 *
 * Performance contract (this lagged when it lived inline on the main page):
 *  - the path is sampled ONCE into a 512-entry lookup table; per frame we
 *    lerp between neighbors — getPointAtLength never runs in the loop
 *  - the rAF loop reads scrollYProgress.get() fresh every frame (motion
 *    values are always current; no stale closure)
 *  - easing factor 0.28 with a snap threshold — tight on flicks, no jitter
 *  - the light moves via direct style.transform mutation on a ref; React
 *    state never updates per-frame
 *  - the loop is IntersectionObserver-gated to the path container
 */

const STATEMENT =
  "Second-year CCE student at LNMIIT, currently embedded at ONGC building systems that run on hardware most developers never touch. I gravitate toward problems where the feedback loop is physical — a frame rate on a live rig, a trajectory at the range, a star that needs 25 seconds of stillness to resolve.";

type Instrument = "trap" | "pistol" | "golf" | "astro" | "cook" | null;

interface Waypoint {
  at: number;
  label: string;
  value: string | null;
  note: string;
  rows: [string, string][];
  wide?: boolean;
  instrument: Instrument;
}

const WAYPOINTS: Waypoint[] = [
  {
    at: 0.05,
    label: "ENTRY",
    value: null,
    note: STATEMENT,
    rows: [
      ["BASE", "LNMIIT JAIPUR"],
      ["FIELD", "ONGC — CV & DATA"],
      ["CLASS", "B.TECH CCE '28"],
    ],
    wide: true,
    instrument: null,
  },
  {
    at: 0.26,
    label: "TRAP",
    value: "CLAY SHOOTING · 28 GAUGE SHOTGUN",
    note: "A clay leaves the house at about 65 km/h and gives you a quarter second of useful window. The discipline is all setup — mount, hold point, call. Same lesson as realtime systems: by the time you see it, you'd better have already decided.",
    rows: [
      ["TARGET SPEED", "~65 KM/H"],
      ["REACTION WINDOW", "0.25 SECONDS"],
      ["VOICE TRIGGER", "CALLING 'PULL'"],
    ],
    instrument: "trap",
  },
  {
    at: 0.44,
    label: "PISTOL",
    value: "TARGET PISTOL · 9MM SEMI-AUTOMATIC",
    note: "Slow fire at fifteen metres. The paper reports exactly what your hands did — no interpretation, no partial credit. Grouping first; speed follows on its own.",
    rows: [
      ["DISCIPLINE", "SLOW FIRE (15 METERS)"],
      ["DRILL", "5-SHOT TIGHT GROUPS"],
      ["EVALUATION", "PAPER TARGET SCORE"],
    ],
    instrument: "pistol",
  },
  {
    at: 0.62,
    label: "GOLF",
    value: "GOLF PRACTICE · SWING MECHANICS",
    note: "The slowest feedback loop I run — one swing change takes a hundred balls before you can trust it. The handicap is a work in progress. The practice log isn't.",
    rows: [
      ["FREQUENCY", "WEEKLY SESSIONS"],
      ["VOLUME", "~100 BALLS / RANGE"],
      ["HANDICAP STATUS", "UNDER RECONSTRUCTION"],
    ],
    instrument: "golf",
  },
  {
    at: 0.8,
    label: "ASTROPHOTO",
    value: "ASTROPHOTOGRAPHY · NIGHT SKY EXPOSURES",
    note: "Twenty-five seconds of stillness for one sharp sky. Light pollution, tracking error and cloud all vote against you — stacking frames is just ETL for photons.",
    rows: [
      ["OPTICS", "f/2.8 ON FIXED TRIPOD"],
      ["METHOD", "IMAGE STACKING (ETL)"],
      ["LOCATION", "DARK SKY SITE (40KM OUT)"],
    ],
    instrument: "astro",
  },
  {
    at: 0.95,
    label: "COOKING",
    value: "CULINARY DEV · RAPID ITERATION",
    note: "The tightest feedback loop in the house. Heat control, timing, plating — every plate ships the same night it's designed. Same loop as everything else here, different inputs.",
    rows: [
      ["FREQUENCY", "NIGHTLY DEV CYCLE"],
      ["METHODOLOGY", "ADJUST TO TASTE"],
      ["FAILSAFE", "DELIVERY BACKUP"],
    ],
    instrument: "cook",
  },
];

const D_DESKTOP =
  "M 500 0 C 690 210, 330 430, 480 650 C 615 845, 345 1020, 500 1230 C 655 1440, 365 1620, 500 1830 C 630 2030, 385 2215, 500 2430 C 595 2610, 445 2790, 500 3000";
const D_MOBILE =
  "M 80 0 C 140 280, 30 580, 90 880 C 145 1160, 35 1460, 85 1760 C 135 2060, 40 2380, 80 3000";

const VB_W = 1000;
const VB_H = 3000;
const LUT_N = 512;

function WaypointInstrument({ kind, active }: { kind: Instrument; active: boolean }) {
  switch (kind) {
    case "trap":
      return <TrapArc active={active} />;
    case "pistol":
      return <PistolTarget active={active} />;
    case "golf":
      return (
        <MiniDial
          active={active}
          fraction={0.82}
          display={(k) => `${Math.round(120 * k)}h`}
          caption="RANGE HRS, THIS SEASON"
        />
      );
    case "astro":
      return <AstroExposure active={active} />;
    case "cook":
      return (
        <MiniDial
          active={active}
          fraction={0.78}
          display={(k) => `${Math.round(230 * k)}°C`}
          caption="HIGH HEAT, LONG PATIENCE"
        />
      );
    default:
      return null;
  }
}

export default function OperatorProfile() {
  const wrap = useRef<HTMLDivElement>(null); // the path container
  const measureRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  const [len, setLen] = useState(0);
  const [anchors, setAnchors] = useState<{ x: number; y: number }[]>([]);
  const [activated, setActivated] = useState<boolean[]>(() => WAYPOINTS.map(() => false));
  const activatedRef = useRef<boolean[]>(WAYPOINTS.map(() => false));
  const lutRef = useRef<Float32Array | null>(null); // [x0,y0,x1,y1,...] viewBox units
  const sizeRef = useRef({ w: 1, h: 1 }); // container px, for viewBox→px

  const d = isMobile ? D_MOBILE : D_DESKTOP;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const raf = requestAnimationFrame(() => setIsMobile(mq.matches));
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Measure once per path shape: total length, the LUT, waypoint anchors.
  useEffect(() => {
    const path = measureRef.current;
    if (!path) return;
    const raf = requestAnimationFrame(() => {
      const L = path.getTotalLength();
      const lut = new Float32Array((LUT_N + 1) * 2);
      for (let i = 0; i <= LUT_N; i++) {
        const pt = path.getPointAtLength((i / LUT_N) * L);
        lut[i * 2] = pt.x;
        lut[i * 2 + 1] = pt.y;
      }
      lutRef.current = lut;
      setLen(L);
      setAnchors(
        WAYPOINTS.map((w) => {
          const pt = path.getPointAtLength(w.at * L);
          return { x: (pt.x / VB_W) * 100, y: (pt.y / VB_H) * 100 };
        })
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [d]);

  // container px size for the transform math
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      sizeRef.current = { w: el.clientWidth || 1, h: el.clientHeight || 1 };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start 0.8", "end 0.75"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // latch waypoints on; ping when one lights up (never un-lights)
    const cur = activatedRef.current;
    let changed = false;
    WAYPOINTS.forEach((w, i) => {
      if (!cur[i] && v >= w.at) {
        cur[i] = true;
        changed = true;
      }
    });
    if (changed) {
      sfx.ping();
      setActivated([...cur]);
    }
  });

  // The light + lit trail. Direct DOM writes only, LUT lookup only.
  useEffect(() => {
    if (reduced || !len) return;
    let raf = 0;
    let running = false;
    let cur = scrollYProgress.get();

    const frame = () => {
      if (!running) return;
      const target = scrollYProgress.get(); // fresh every frame
      cur += (target - cur) * 0.28;
      if (Math.abs(target - cur) < 0.0006) cur = target; // snap, no crawl
      const p = Math.max(0, Math.min(1, cur));

      const lut = lutRef.current;
      if (lut) {
        const f = p * LUT_N;
        const i = Math.min(LUT_N - 1, Math.floor(f));
        const frac = f - i;
        const x = lut[i * 2] + (lut[(i + 1) * 2] - lut[i * 2]) * frac;
        const y = lut[i * 2 + 1] + (lut[(i + 1) * 2 + 1] - lut[i * 2 + 1]) * frac;
        const { w, h } = sizeRef.current;
        if (lightRef.current) {
          lightRef.current.style.transform = `translate3d(${(x / VB_W) * w}px, ${(y / VB_H) * h}px, 0) translate(-50%, -50%)`;
        }
      }
      // pathLength=1 on the dash paths → offset is simply the remaining fraction
      const offset = String(1 - p);
      litRef.current?.setAttribute("stroke-dashoffset", offset);
      glowRef.current?.setAttribute("stroke-dashoffset", offset);
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    if (wrap.current) io.observe(wrap.current);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduced, len, scrollYProgress]);

  const allLit = reduced;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <section aria-label="Operator profile" className="reg-corners relative">
        <div className="mx-auto max-w-6xl pl-16 pr-6 pt-28 md:px-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-amber">
            1100M · OPERATOR PROFILE — WHO&apos;S RUNNING THIS
          </p>
          <h1 className="font-display mt-4 text-5xl font-semibold uppercase md:text-7xl">
            The operator<span className="text-amber">.</span>
          </h1>
          <p className="mt-4 max-w-md font-mono text-[10px] leading-4 tracking-wider text-dim">
            SIDE BORE OFF THE MAIN DESCENT. FOLLOW THE ROUTE — STATIONS LIGHT AS YOU PASS.
          </p>
        </div>

        {/* the descent route */}
        <div ref={wrap} className="relative mx-auto h-[380vh] max-w-6xl md:h-[420vh]">
          <svg
            className="absolute inset-0 size-full"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <path ref={measureRef} d={d} fill="none" stroke="#2e2a1f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            {/* Dash paths use pathLength=1 so dasharray/offset are pure
                fractions of the path — and NO non-scaling-stroke: with
                preserveAspectRatio="none", that flag makes browsers compute
                dashes in screen space, which desynced the trail from the
                light (they must share the same 0..1 progress space). */}
            <path
              ref={glowRef}
              d={d}
              fill="none"
              stroke="#d4920f"
              strokeOpacity={isMobile ? 0.05 : 0.1}
              strokeWidth="5"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={allLit ? 0 : 1}
            />
            <path
              ref={litRef}
              d={d}
              fill="none"
              stroke="#d4920f"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={allLit ? 0 : 1}
            />
          </svg>

          {/* the traveling light — outer div is positioned purely via
              style.transform (rAF); the inner dot owns the entrance scale
              so Framer and the loop never fight over one transform */}
          {!reduced && (
            <div
              ref={lightRef}
              aria-hidden
              className="absolute top-0 left-0"
              style={{ transform: "translate3d(0,0,0) translate(-50%,-50%)" }}
            >
              <motion.span
                className="block size-2.5 rounded-full bg-amber"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  boxShadow: isMobile
                    ? "0 0 10px 2px rgba(212,146,15,0.35)"
                    : "0 0 18px 4px rgba(212,146,15,0.45)",
                }}
              />
            </div>
          )}

          {anchors.map((a, i) => {
            const wp = WAYPOINTS[i];
            const on = allLit || activated[i];
            const rightSide = isMobile ? true : i % 2 === 0;
            const panelW = isMobile ? "76%" : wp.wide ? "min(620px, 50%)" : "min(560px, 46%)";
            return (
              <div key={wp.label}>
                {/* station marker on the path */}
                <div
                  aria-hidden
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${a.x}%`, top: `${a.y}%` }}
                >
                  <span
                    className={`block size-2 rounded-full border transition-colors duration-300 ${
                      on ? "border-amber bg-amber" : "border-line bg-panel"
                    }`}
                  />
                  {on && !reduced && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-amber"
                      initial={{ scale: 1, opacity: 0.9 }}
                      animate={{ scale: isMobile ? 2.4 : 3.6, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                </div>

                {/* leader line from marker to the panel column */}
                {!isMobile && (
                  <div
                    aria-hidden
                    className={`absolute h-px transition-colors duration-500 ${on ? "bg-amber/30" : "bg-line"}`}
                    style={{
                      top: `${a.y}%`,
                      ...(rightSide
                        ? { left: `calc(${a.x}% + 10px)`, width: `calc(100% - ${panelW} - ${a.x}% - 18px)` }
                        : { right: `calc(${100 - a.x}% + 10px)`, width: `calc(${a.x}% - ${panelW} - 18px)` }),
                    }}
                  />
                )}

                {/* station panel — anchored to the container edge, full width */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: on ? 1 : 0,
                    x: on ? 0 : rightSide ? 28 : -28,
                    y: "-50%", // vertical centering lives here — Framer owns transform
                  }}
                  transition={{ duration: 0.45, delay: on && !reduced ? 0.18 : 0, ease: "easeOut" }}
                  className="absolute border border-line bg-panel/90 backdrop-blur-sm"
                  style={{
                    top: `${a.y}%`,
                    ...(isMobile
                      ? { left: `calc(${a.x}% + 20px)`, right: "16px" }
                      : {
                          width: panelW,
                          ...(rightSide ? { right: 0 } : { left: 0 }),
                        }),
                  }}
                >
                  <div className="flex items-center justify-between border-b border-line px-5 py-2.5">
                    <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-dim">
                      <span className={on ? "text-amber" : undefined}>◆</span> {wp.label}
                    </p>
                    <span className={`font-mono text-[8px] tracking-[0.25em] ${on ? "text-scope" : "text-line"}`}>
                      {on ? "LOGGED" : "AHEAD"}
                    </span>
                  </div>
                  <div className="p-5">
                    {wp.value && (
                      <p className="font-mono text-xs tracking-[0.15em] text-amber md:text-sm">{wp.value}</p>
                    )}
                    <div className={`mt-3 flex gap-6 ${isMobile ? "flex-col" : "items-start"}`}>
                      <p
                        className={`min-w-0 flex-1 leading-relaxed ${
                          wp.wide ? "text-base text-bone/90 md:text-lg" : "text-sm text-dim md:text-[15px]"
                        }`}
                      >
                        {wp.note}
                      </p>
                      {wp.instrument && (
                        <div className="shrink-0">
                          <WaypointInstrument kind={wp.instrument} active={on} />
                        </div>
                      )}
                    </div>
                    <div className="mt-5 grid grid-cols-3 border-t border-line bg-line text-[9px]">
                      {wp.rows.map(([k, v]) => (
                        <div key={k} className="bg-panel/90 p-1.5 md:p-2.5 backdrop-blur-sm">
                          <p className="font-mono text-[8px] tracking-[0.2em] text-dim">{k}</p>
                          <p className="mt-1 font-mono text-[10px] text-bone">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* end of bore */}
        <div className="mx-auto max-w-6xl px-6 pb-24 text-center md:px-10">
          <p className="font-mono text-[10px] tracking-[0.3em] text-dim">END OF SIDE BORE</p>
          <Link
            href="/"
            onClick={() => sessionStorage.setItem("dua-restore", "1")}
            className="mt-4 inline-block border border-line px-6 py-3 font-mono text-xs tracking-[0.2em] text-dim transition-colors hover:border-amber hover:text-amber"
          >
            ← RETURN TO MAIN DESCENT
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
