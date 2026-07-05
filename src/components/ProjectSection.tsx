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
import { sfx } from "@/lib/audio";
import TiltCard from "./TiltCard";
import Readout from "./Readout";
import { CameraWall, EtlTerminal, MarketplaceCard, ScadaStrip, StateMachine, SkillGraph } from "./ProjectVisuals";

const PHASES = ["PROBLEM", "APPROACH", "OUTCOME"] as const;

function Header({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-end justify-between border-b border-line pb-4">
        <div>
          <p className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] flex-wrap">
            <span className="text-amber">{project.codename}</span>
            <span className="border border-line px-1.5 py-0.5 text-dim">{project.org}</span>
            {project.live && (
              <span className="flex items-center gap-1.5 text-scope">
                <span className="blink inline-block size-1.5 rounded-full bg-scope" />
                LIVE
              </span>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-amber/20 bg-amber/5 px-2 py-0.5 text-amber transition-all hover:bg-amber/15 hover:border-amber text-[9px] tracking-widest flex items-center gap-1 leading-none rounded-sm uppercase"
              >
                <span>[REPO]</span>
                <svg className="size-2 fill-current" viewBox="0 0 16 16">
                  <path d="M8 .2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V14c-2.2.5-2.7-1.1-2.7-1.1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4C13.7 14.7 16 11.7 16 8.2c0-4.4-3.6-8-8-8z"/>
                </svg>
              </a>
            )}
          </p>
          <h3 className="font-display mt-2 text-4xl leading-none font-semibold uppercase md:text-7xl">
            {project.title}
          </h3>
        </div>
        <p className="hidden max-w-[240px] text-right font-mono text-[10px] leading-4 text-dim md:block">
          {project.tagline.toUpperCase()}
        </p>
      </div>
    </>
  );
}

/** PROBLEM → APPROACH → OUTCOME: tabs + a panel that slides, dashboard-style. */
function Narrative({
  phases,
  phase,
  wide,
}: {
  phases: string[];
  phase: number;
  wide?: boolean;
}) {
  return (
    <div>
      <div className="flex gap-4" role="tablist" aria-label="Project narrative">
        {PHASES.map((t, i) => (
          <span
            key={t}
            role="tab"
            aria-selected={phase === i}
            className={`border-b pb-1 font-mono text-[10px] tracking-[0.3em] transition-colors duration-300 ${
              phase === i ? "border-amber text-amber" : "border-transparent text-dim/50"
            }`}
          >
            {String(i + 1).padStart(2, "0")}/{t}
          </span>
        ))}
      </div>
      <div className="mt-5 grid overflow-hidden">
        {phases.map((body, i) => (
          <motion.p
            key={i}
            aria-hidden={phase !== i}
            initial={false}
            animate={{
              opacity: phase === i ? 1 : 0,
              x: phase === i ? 0 : phase > i ? -32 : 32,
              pointerEvents: phase === i ? "auto" : "none",
            }}
            transition={{ duration: 0.4, ease: [0.3, 0.8, 0.3, 1] }}
            className={`col-start-1 row-start-1 leading-relaxed text-bone/90 ${
              wide ? "text-base md:text-lg" : "text-sm md:text-base"
            }`}
          >
            {body}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

function StackChips({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((s) => (
        <span key={s} className="border border-line px-2 py-1 font-mono text-[9px] tracking-wider text-dim">
          {s}
        </span>
      ))}
    </div>
  );
}

function Readouts({ project, column }: { project: Project; column?: boolean }) {
  return (
    <div className={column ? "flex flex-col gap-5" : "flex gap-8"}>
      {project.readouts.map((r) => (
        <Readout key={r.label} {...r} />
      ))}
    </div>
  );
}

function Visual({ project }: { project: Project }) {
  switch (project.visual) {
    case "cameras":
      return <CameraWall />;
    case "terminal":
      return <EtlTerminal />;
    case "marketplace":
      return <MarketplaceCard />;
    case "stages":
      return <StateMachine />;
    case "graph":
      return <SkillGraph />;
  }
}

/**
 * A pinned project deep-dive. The scroll mechanism is shared (JS-driven:
 * discrete phase state + spring scrub bar), but each project gets its own
 * layout personality:
 *   RigVision — dense multi-column monitoring wall + SCADA strip
 *   WellAnalysis — the ETL terminal IS the visual, full width, data-forward
 *   Notarium — cleaner and commercial, one product card, more air
 *   STI Portal — the state machine as full-width centerpiece
 */
export default function ProjectSection({ project }: { project: Project }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const phaseRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const barW = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(2, Math.max(0, Math.floor(v * 3)));
    if (next !== phaseRef.current) {
      phaseRef.current = next;
      sfx.click(); // one consistent tick on tab switches
      setPhase(next);
    }
  });

  const phases = [project.problem, project.approach, project.outcome];

  if (reduced) {
    return (
      <article id={project.id} className="border-t border-line px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Header project={project} />
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            <div>
              {phases.map((body, i) => (
                <div key={i} className="mb-8">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-amber">{PHASES[i]}</p>
                  <p className="mt-3 leading-relaxed text-bone/90">{body}</p>
                </div>
              ))}
              <StackChips stack={project.stack} />
            </div>
            <div className="h-[380px] border border-line bg-panel">
              <Visual project={project} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  const body = (() => {
    switch (project.id) {
      case "rigvision":
        return (
          <div className="mt-8 grid items-start gap-8 md:mt-10 md:grid-cols-[1.5fr_1fr] md:gap-12">
            <div className="order-2 md:order-1">
              <TiltCard>
                <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[9px] tracking-[0.2em] text-dim">
                  <span>MONITORING WALL — 4 CH</span>
                  <span className="text-scope">ON SITE HW</span>
                </div>
                <div className="h-[210px] md:h-[280px]">
                  <CameraWall />
                </div>
                <ScadaStrip />
              </TiltCard>
            </div>
            <div className="order-1 flex flex-col gap-7 md:order-2">
              <Narrative phases={phases} phase={phase} />
              <Readouts project={project} />
              <StackChips stack={project.stack} />
            </div>
          </div>
        );
      case "wellanalysis":
        return (
          <div className="mt-8 md:mt-10">
            <TiltCard>
              <div className="h-[220px] md:h-[240px]">
                <EtlTerminal />
              </div>
            </TiltCard>
            <div className="mt-8 grid items-start gap-8 md:grid-cols-[1.6fr_1fr] md:gap-14">
              <div className="flex flex-col gap-7">
                <Narrative phases={phases} phase={phase} wide />
                <StackChips stack={project.stack} />
              </div>
              <div className="border-l border-line pl-6">
                <Readouts project={project} column />
              </div>
            </div>
          </div>
        );
      case "notarium":
        return (
          <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[1fr_400px] md:gap-20">
            <div className="flex flex-col gap-8">
              <Narrative phases={phases} phase={phase} wide />
              <Readouts project={project} />
              <StackChips stack={project.stack} />
            </div>
            <TiltCard>
              <div className="h-[300px] md:h-[340px]">
                <MarketplaceCard />
              </div>
            </TiltCard>
          </div>
        );
      case "competencegraph":
        return (
          <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[1fr_400px] md:gap-20">
            <div className="flex flex-col gap-8">
              <Narrative phases={phases} phase={phase} wide />
              <Readouts project={project} />
              <StackChips stack={project.stack} />
            </div>
            <TiltCard>
              <div className="h-[300px] md:h-[340px]">
                <SkillGraph />
              </div>
            </TiltCard>
          </div>
        );
      default: // sti-portal
        return (
          <div className="mt-8 md:mt-10">
            <TiltCard>
              <div className="h-[220px] md:h-[230px]">
                <StateMachine />
              </div>
            </TiltCard>
            <div className="mt-8 grid items-start gap-8 md:grid-cols-[1.6fr_1fr] md:gap-14">
              <div className="flex flex-col gap-7">
                <Narrative phases={phases} phase={phase} wide />
                <StackChips stack={project.stack} />
              </div>
              <div className="border-l border-line pl-6">
                <Readouts project={project} column />
              </div>
            </div>
          </div>
        );
    }
  })();

  return (
    <div ref={wrap} id={project.id} className="relative h-[300vh]">
      <section
        className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-6 md:px-10"
        aria-label={project.title}
      >
        <div className="mx-auto w-full max-w-6xl">
          <Header project={project} />
          <div className="mt-px h-0.5 w-full bg-line">
            <motion.div className="h-full bg-amber" style={{ width: barW }} />
          </div>
          {body}
        </div>
      </section>
    </div>
  );
}
