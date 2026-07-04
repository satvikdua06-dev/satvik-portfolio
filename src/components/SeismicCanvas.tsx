"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero background: horizontal seismic traces. Amplitude swells near the
 * cursor and with scroll velocity, like a geophone array picking up activity.
 *
 * First-load hardening (this site previously shipped a frame-stuck canvas):
 * - the first frame is drawn synchronously in the mount effect, before rAF
 * - sizing comes from a ResizeObserver, not a one-shot measure
 * - the loop pauses when the tab is hidden or the hero scrolls away
 * - under prefers-reduced-motion a single static frame is drawn, no loop
 */
export default function SeismicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const ROWS = mobile ? 9 : 16;
    const STEP = mobile ? 10 : 7;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let mx = -9999;
    let my = -9999;
    let lastScroll = window.scrollY;
    let energy = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const scrollV = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      energy = Math.min(1, energy * 0.92 + scrollV * 0.004);

      for (let r = 0; r < ROWS; r++) {
        const baseY = (h / (ROWS + 1)) * (r + 1);
        const phase = r * 1.7;
        ctx.beginPath();
        for (let x = 0; x <= w; x += STEP) {
          // cursor proximity boosts local amplitude
          const dx = x - mx;
          const dy = baseY - my;
          const prox = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 260);
          const amp = 3 + prox * 26 + energy * 14;
          const n =
            Math.sin(x * 0.011 + t * 0.0011 + phase) * 0.6 +
            Math.sin(x * 0.033 - t * 0.0007 + phase * 2.3) * 0.4;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const hot = r === Math.floor(ROWS / 2);
        ctx.strokeStyle = hot
          ? "rgba(232,160,32,0.38)" // phosphor amber — the hot trace
          : `rgba(62,207,178,${0.05 + 0.09 * (1 - Math.abs(r - ROWS / 2) / (ROWS / 2))})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    size();
    draw(performance.now()); // guaranteed first frame, even if rAF never fires

    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), {
      threshold: 0.01,
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}
