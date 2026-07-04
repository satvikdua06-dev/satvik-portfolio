"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";

const STATEMENT =
  "A demo works on your laptop. A system works at 3 AM on a rig with a flaky uplink and nobody watching. I build the second kind.";

const PRINCIPLES = [
  "Hardware is the real test. If it only runs on the machine it was written on, it doesn't run.",
  "Instrument everything. If you can't see it fail, it already has.",
  "Edge first. Assume the GPU is small and the network is gone.",
];

function ScrambleWord({ word, active, reduced }: { word: string; active: boolean; reduced: boolean }) {
  const [displayText, setDisplayText] = useState(word);
  const scrambledRef = useRef(false);

  useEffect(() => {
    if (reduced) return;

    if (!active) {
      scrambledRef.current = false;
      return;
    }

    if (scrambledRef.current) return;
    scrambledRef.current = true;

    let frame = 0;
    const duration = 12;
    const GLYPHS = "0123456789!@#$%^&*()_+{}|:<>?-=[]\\;',./";
    let raf = 0;

    const tick = () => {
      frame++;
      const progress = frame / duration;
      const result = word
        .split("")
        .map((char, index) => {
          if (/[\s.,\/#!$%\^&\*;:{}=\-_`~()?]/.test(char)) return char;
          if (index / word.length < progress) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplayText(result);

      if (frame < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplayText(word);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, word, reduced]);

  return (
    <span
      className={`inline-block transition-colors duration-300 ${
        active ? "text-bone font-medium" : "text-[#2e2a1f]"
      }`}
    >
      {active ? displayText : word}&nbsp;
    </span>
  );
}

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
    <div ref={wrap} id="philosophy" className="relative md:h-[220vh]">
      <section
        className="reg-corners top-0 flex min-h-screen flex-col justify-center px-6 py-24 md:sticky md:h-screen md:px-10"
        aria-label="Philosophy"
      >
        <div className="mx-auto w-full max-w-5xl">
          <p className="font-mono text-[10px] tracking-[0.3em] text-amber">
            740M · DOCTRINE — BUILT TO SHIP
          </p>
          <h2 className="mt-8 max-w-4xl font-display text-4xl leading-[1.05] font-semibold uppercase md:text-6xl">
            {words.map((w, i) => (
              <ScrambleWord
                key={i}
                word={w}
                active={i < revealed}
                reduced={!!reduced}
              />
            ))}
          </h2>

          <div className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p} className="bg-panel/90 p-5 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-dim">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
