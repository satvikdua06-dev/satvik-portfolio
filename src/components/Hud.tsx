"use client";

import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { WELL_DEPTH_M } from "@/data/site";
import { sfx } from "@/lib/audio";

/**
 * Fixed telemetry HUD (bottom-left). Scroll progress is rendered as drilled
 * depth — the page IS the wellbore. Also hosts the ambient-audio toggle and
 * listens for `hud:msg` events (easter egg, palette actions).
 */
function getInterpDepth(y: number): number {
  const philosophy = document.getElementById("philosophy");
  const work = document.getElementById("work");
  const telemetry = document.getElementById("telemetry");

  const y0 = 0;
  const y1 = philosophy ? philosophy.offsetTop : 0;
  const y2 = work ? work.offsetTop : 0;
  const y3 = telemetry ? telemetry.offsetTop : 0;
  const y4 = document.documentElement.scrollHeight - window.innerHeight;

  const offsets = [y0, y1, y2, y3, y4];
  const depths = [0, 740, 1480, 3100, WELL_DEPTH_M];

  if (y <= offsets[0]) return depths[0];
  if (y >= offsets[offsets.length - 1]) return depths[depths.length - 1];

  for (let i = 0; i < offsets.length - 1; i++) {
    if (y >= offsets[i] && y < offsets[i + 1]) {
      const t = (y - offsets[i]) / (offsets[i + 1] - offsets[i]);
      return depths[i] + t * (depths[i + 1] - depths[i]);
    }
  }
  return depths[depths.length - 1];
}

export default function Hud() {
  const { scrollY } = useScroll();
  const [depth, setDepth] = useState(0);
  const [time, setTime] = useState("--:--:--");
  const [sound, setSound] = useState(false);
  const [vol, setVol] = useState(0.65);
  const [msg, setMsg] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const d = getInterpDepth(y);
    setDepth(Math.round(d));
    sfx.setDepth(d / WELL_DEPTH_M); // drone fundamental slides with the descent
  });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setSound(sfx.isEnabled());
      setVol(sfx.getVolume());
      setDepth(Math.round(getInterpDepth(window.scrollY)));
    };
    // Defer one frame to prevent synchronous render and hydration mismatch
    raf = requestAnimationFrame(update);

    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    tick();
    const iv = setInterval(tick, 1000);
    const unsub = sfx.subscribe((on) => {
      setSound(on);
      setVol(sfx.getVolume());
    });
    const onMsg = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setTimeout(() => setMsg(null), 3200);
    };
    window.addEventListener("hud:msg", onMsg);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(iv);
      unsub();
      window.removeEventListener("hud:msg", onMsg);
    };
  }, []);

  const pct = Math.min(100, Math.round((depth / WELL_DEPTH_M) * 100));

  return (
    <div
      className="fixed bottom-4 left-16 z-[70] select-none font-mono text-[10px] leading-4 tracking-wider"
      role="status"
      aria-label="Site telemetry"
    >
      {msg && (
        <p className="mb-2 border border-amber/50 bg-void/90 px-2 py-1 text-amber">
          ▲ {msg}
        </p>
      )}
      <div className="border border-line bg-void/80 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-dim">
          <span className="blink inline-block size-1.5 rounded-full bg-scope" />
          <span>LINK STABLE</span>
          <span className="text-line">|</span>
          <span suppressHydrationWarning>{time} IST</span>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-dim">DEPTH</span>
          <span className="text-sm text-amber tabular-nums">
            {String(depth).padStart(4, "0")}
          </span>
          <span className="text-dim">/ {WELL_DEPTH_M} M</span>
        </div>
        {/* depth gauge */}
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1 w-28 bg-line">
            <div className="h-full bg-amber transition-[width] duration-150" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-dim tabular-nums">{pct}%</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => sfx.toggle()}
            aria-pressed={sound}
            className="border border-line px-2 py-0.5 text-dim transition-colors hover:border-amber hover:text-amber"
          >
            SND {sound ? "◉ ON" : "○ OFF"}
          </button>
          {sound && (
            <div className="flex items-center gap-1.5 border border-line px-2 py-0.5 bg-panel/50 text-[8px] text-dim leading-none">
              <span>VOL</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={vol}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  sfx.setVolume(v);
                  setVol(v);
                }}
                className="w-14 h-0.5 cursor-pointer accent-amber bg-line rounded appearance-none"
              />
              <span className="font-mono w-6 text-right tabular-nums">{Math.round(vol * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
