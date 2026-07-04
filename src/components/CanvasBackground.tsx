"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * The connective tissue of the page: a fixed, full-viewport canvas behind all
 * content rendering a live seismic/depth-log display.
 *
 * - 5 irregular waveform traces (sensor channels), one brighter "active" one.
 * - Activity follows scroll depth: calm at surface, busiest mid-descent,
 *   settling again as target depth (contact) approaches.
 * - Static horizontal depth-marker lines, like a log chart.
 * - Slight parallax against the pointer (canvas shifts 2–4px opposite).
 * - Past ~85% depth the traces fade down and a sparse star field fades up.
 *
 * Degradation: on mobile / reduced motion the canvas never mounts — a static
 * SVG seismic line (deterministic, SSR-safe) renders instead.
 *
 * First-load hardening: first frame drawn synchronously, initial scroll
 * position read on that first frame (browser restore safe), loop cancelled
 * via an alive flag on unmount, resize handled continuously.
 */

// --- deterministic waveform for the static SVG fallback (SSR-safe) ---
function staticPath(seed: number, w: number, y: number, amp: number): string {
  let d = `M 0 ${y}`;
  for (let x = 0; x <= w; x += 12) {
    const n =
      Math.sin(x * 0.021 + seed) * 0.55 +
      Math.sin(x * 0.049 + seed * 2.7) * 0.3 +
      Math.sin(x * 0.008 + seed * 5.1) * 0.15;
    d += ` L ${x} ${(y + n * amp).toFixed(1)}`;
  }
  return d;
}
const SVG_W = 1440;
const SVG_PATHS = [
  { d: staticPath(1.3, SVG_W, 200, 16), o: 0.16 },
  { d: staticPath(3.8, SVG_W, 420, 12), o: 0.08 },
  { d: staticPath(7.2, SVG_W, 640, 14), o: 0.06 },
];

function StaticSeismic() {
  return (
    <svg
      className="absolute inset-0 size-full"
      viewBox={`0 0 ${SVG_W} 900`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {[150, 300, 450, 600, 750].map((y) => (
        <line key={y} x1="0" y1={y} x2={SVG_W} y2={y} stroke="#d4920f" strokeOpacity="0.04" />
      ))}
      {SVG_PATHS.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke="#d4920f" strokeOpacity={p.o} />
      ))}
    </svg>
  );
}

// --- live canvas ---
interface Trace {
  yFrac: number;
  speed: number;
  seed: number;
  ampBase: number;
  active: boolean;
}

const TRACES: Trace[] = [
  { yFrac: 0.16, speed: 11, seed: 2.1, ampBase: 10, active: false },
  { yFrac: 0.34, speed: 17, seed: 5.7, ampBase: 14, active: false },
  { yFrac: 0.52, speed: 23, seed: 9.4, ampBase: 18, active: true },
  { yFrac: 0.7, speed: 14, seed: 13.8, ampBase: 12, active: false },
  { yFrac: 0.86, speed: 19, seed: 17.2, ampBase: 9, active: false },
];

// irregular pseudo-noise — layered incommensurate sines, spiked
function noise(x: number, t: number, seed: number): number {
  const v =
    Math.sin(x * 0.013 + t + seed) * 0.5 +
    Math.sin(x * 0.037 - t * 0.6 + seed * 2.3) * 0.3 +
    Math.sin(x * 0.0071 + t * 0.31 + seed * 4.9) * 0.2;
  // sharpen peaks so it reads as data, not a sine demo
  return Math.sign(v) * Math.pow(Math.abs(v), 1.6);
}

function LiveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mx = 0.5;
    let my = 0.5;

    // ~120 stars, positions fixed for the session
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() > 0.8 ? 1.8 : 1,
      a: 0.2 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
      twS: 0.7 + Math.random() * 0.8, // twinkle period scale (4–8s range)
    }));

    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      ctx.clearRect(0, 0, w, h);

      // scroll depth 0..1 — read fresh each frame (restore-safe)
      const max = document.documentElement.scrollHeight - h;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // calm at surface, peak mid-descent, settling at target depth
      const activity = 0.25 + 0.75 * Math.sin(Math.PI * Math.min(1, p * 1.05));
      // star crossfade over the last stretch of the descent
      const starK = Math.min(1, Math.max(0, (p - 0.84) / 0.12));
      const traceK = 1 - starK;

      // pointer parallax: whole field shifts 2–4px opposite the cursor
      const ox = (0.5 - mx) * 7;
      const oy = (0.5 - my) * 5;

      // static depth-marker lines
      ctx.strokeStyle = `rgba(212,146,15,${0.04 * traceK + 0.015})`;
      ctx.lineWidth = 1;
      const gap = Math.max(90, h / 8);
      for (let y = gap / 2; y < h; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y + oy);
        ctx.lineTo(w, y + oy);
        ctx.stroke();
      }

      if (traceK > 0.01) {
        // background drifts at 0.3× scroll speed via phase offset
        const scrollPhase = window.scrollY * 0.3;
        for (const tr of TRACES) {
          const baseY = tr.yFrac * h + oy;
          const amp = tr.ampBase * (0.5 + activity);
          const alpha = (tr.active ? 0.17 : 0.075) * traceK;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const y =
              baseY +
              noise(x + scrollPhase + t * tr.speed, t * (0.4 + activity * 0.5), tr.seed) * amp;
            if (x === 0) ctx.moveTo(x + ox, y);
            else ctx.lineTo(x + ox, y);
          }
          ctx.strokeStyle = `rgba(212,146,15,${alpha})`;
          ctx.stroke();
        }
      }

      if (starK > 0.01) {
        for (const s of stars) {
          const twinkle = 0.75 + 0.25 * Math.sin(t * s.twS + s.tw);
          ctx.fillStyle = `rgba(228,223,200,${s.a * twinkle * starK})`;
          ctx.fillRect(s.x * w + ox, s.y * h + oy, s.r, s.r);
        }
      }
    };

    const loop = (tMs: number) => {
      if (!alive) return;
      draw(tMs);
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      size();
      draw(performance.now());
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / w;
      my = e.clientY / h;
    };
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else if (alive) {
        raf = requestAnimationFrame(loop);
      }
    };

    size();
    draw(performance.now()); // guaranteed first frame at whatever scroll position
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 size-full" />;
}

export default function CanvasBackground() {
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const wide = window.matchMedia("(min-width: 768px)");
    // deferred a frame — client-only capability check, render-free effect body
    const raf = requestAnimationFrame(() => setLive(wide.matches));
    const onChange = (e: MediaQueryListEvent) => setLive(e.matches);
    wide.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      wide.removeEventListener("change", onChange);
    };
  }, [reduced]);

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      {live && !reduced ? <LiveCanvas /> : <StaticSeismic />}
    </div>
  );
}
