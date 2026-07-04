"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/data/site";
import TiltCard from "./TiltCard";
import Readout from "./Readout";
import ProjectVisualPanel from "./ProjectVisuals";

const PHASES = ["PROBLEM", "APPROACH", "OUTCOME"] as const;

/**
 * A pinned project deep-dive: the instrument card holds position while the
 * narrative steps through PROBLEM → APPROACH → OUTCOME with scroll.
 *
 * Deliberately JS-driven (state + springs), NOT scroll-timeline compiled:
 * discrete phases from useMotionValueEvent, smooth bar via useSpring. The
 * phases are grid-stacked so the container is always as tall as the longest
 * phase — nothing overlaps.
 */
export default function ProjectSection({ project }: { project: Project }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const barW = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPhase(Math.min(2, Math.max(0, Math.floor(v * 3))));
  });

  const phases = [project.problem, project.approach, project.outcome];

  if (reduced) {
    return (
      <article id={project.id} className="border-t border-line bg-void px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-amber">{project.codename}</p>
            <h3 className="font-display mt-4 text-5xl font-bold uppercase">{project.title}</h3>
            <p className="mt-2 text-dim">{project.tagline}</p>
            {phases.map((body, i) => (
              <div key={i} className="mt-8">
                <p className="font-mono text-[10px] tracking-[0.3em] text-scope">{PHASES[i]}</p>
                <p className="mt-3 leading-relaxed text-bone/90">{body}</p>
              </div>
            ))}
            <div className="mt-8 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span key={s} className="border border-line px-2 py-1 font-mono text-[9px] tracking-wider text-dim">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="h-[420px] border border-line bg-panel">
            <ProjectVisualPanel visual={project.visual} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <div ref={wrap} id={project.id} className="relative h-[300vh] bg-void">
      <section
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 md:px-10"
        aria-label={project.title}
      >
        <div className="mx-auto w-full max-w-6xl">
          {/* header row */}
          <div className="flex items-end justify-between border-b border-line pb-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-amber">{project.codename}</p>
              <h3 className="font-display mt-2 text-4xl leading-none font-bold uppercase md:text-7xl">
                {project.title}
              </h3>
            </div>
            <p className="hidden max-w-[220px] text-right font-mono text-[10px] leading-4 text-dim md:block">
              {project.tagline.toUpperCase()}
            </p>
          </div>
          {/* scrub bar */}
          <div className="mt-px h-0.5 w-full bg-line">
            <motion.div className="h-full bg-amber" style={{ width: barW }} />
          </div>

          <div className="mt-8 grid items-start gap-8 md:mt-12 md:grid-cols-[1fr_1.1fr] md:gap-14">
            {/* narrative — one phase visible at a time, grid-stacked */}
            <div className="order-2 md:order-1">
              <div className="flex gap-4" role="tablist" aria-label="Project narrative">
                {PHASES.map((t, i) => (
                  <span
                    key={t}
                    className={`font-mono text-[10px] tracking-[0.3em] transition-colors duration-300 ${
                      phase === i ? "text-scope" : "text-line"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}/{t}
                  </span>
                ))}
              </div>
              <div className="mt-5 grid">
                {phases.map((body, i) => (
                  <motion.p
                    key={i}
                    aria-hidden={phase !== i}
                    initial={false}
                    animate={{
                      opacity: phase === i ? 1 : 0,
                      y: phase === i ? 0 : phase > i ? -14 : 14,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="col-start-1 row-start-1 text-base leading-relaxed text-bone/90 md:text-lg"
                  >
                    {body}
                  </motion.p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="border border-line px-2 py-1 font-mono text-[9px] tracking-wider text-dim"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* instrument card */}
            <div className="order-1 md:order-2">
              <TiltCard>
                <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-dim">
                  <span>UNIT {project.index} — LIVE PANEL</span>
                  <span className="text-scope">NOMINAL</span>
                </div>
                <div className="h-[200px] md:h-[300px]">
                  <ProjectVisualPanel visual={project.visual} />
                </div>
                <div className="flex gap-8 border-t border-line px-4 py-3">
                  {project.readouts.map((r) => (
                    <Readout key={r.label} {...r} />
                  ))}
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
