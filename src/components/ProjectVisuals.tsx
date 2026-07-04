"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { STI_ROLES } from "@/data/site";
import Readout from "./Readout";

/**
 * Instrument-panel visuals — pure DOM/CSS/state, no images. Each one is a
 * stylized readout of what the system actually does, with a small amount of
 * life: PPE states flip, the terminal cursor blinks, the state machine
 * lights in sequence.
 */

/** RigVision: 2×2 camera wall. One cell occasionally flips to a violation. */
export function CameraWall() {
  const reduced = useReducedMotion();
  const [alert, setAlert] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const iv = setInterval(() => {
      setAlert((prev) => (prev === null ? Math.floor(Math.random() * 4) : null));
    }, 3400);
    return () => clearInterval(iv);
  }, [reduced]);

  return (
    <div className="grid h-full grid-cols-2 gap-px bg-line" aria-hidden>
      {["CAM-01", "CAM-02", "CAM-03", "CAM-04"].map((cam, i) => {
        const hot = alert === i;
        return (
          <div key={cam} className="scanlines relative overflow-hidden bg-panel2 p-2">
            <div className="flex items-center justify-between font-mono text-[8px] text-dim">
              <span>{cam}</span>
              <span className="flex items-center gap-1 text-alarm">
                <span className="blink inline-block size-1 rounded-full bg-alarm" />
                REC
              </span>
            </div>
            <div
              className="drift-box absolute border transition-colors duration-300"
              style={{
                borderColor: hot ? "#d94f2a" : "#d4920f",
                width: "34%",
                height: "42%",
                left: `${18 + i * 9}%`,
                top: `${30 + (i % 2) * 12}%`,
                animationDelay: `${i * 1.3}s`,
              }}
            >
              <span
                className="absolute -top-3.5 left-0 px-1 font-mono text-[7px] transition-colors duration-300"
                style={{
                  background: hot ? "#d94f2a" : "#d4920f",
                  color: "#0c0b08",
                }}
              >
                {hot ? "PPE !" : "PPE OK"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** RigVision: the SCADA / Modbus strip under the camera wall. */
export function ScadaStrip() {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
      <span className="font-mono text-[8px] tracking-[0.2em] text-dim">
        MODBUS GW · REG 40011–40019
      </span>
      <div className="flex gap-6">
        <Readout label="PUMP PRESS" base={182.4} jitter={2.1} unit="BAR" decimals={1} />
        <Readout label="HOOK LOAD" base={96} jitter={1.5} unit="T" />
        <Readout label="ROTARY" base={118} jitter={4} unit="RPM" />
      </div>
    </div>
  );
}

const TERMINAL_LINES = [
  { cmd: "ingest  DDR_2026-07-03.pdf", out: "3 tables, 6 pages" },
  { cmd: "extract 142 fields", out: "pdfplumber → frame" },
  { cmd: "validate mud density, WOB, ROP", out: "2 rows flagged" },
  { cmd: "load    pg://wells/ddr", out: "commit 0.4s" },
  { cmd: "render  depth-vs-day", out: "streamlit :8501" },
];

export function EtlTerminal() {
  return (
    <div className="flex h-full flex-col font-mono" aria-hidden>
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[8px] tracking-[0.2em] text-dim">
        <span>wellanalysis — etl</span>
        <span>PG · STREAMLIT</span>
      </div>
      <div className="flex-1 space-y-2 p-4 text-[10px] leading-5 md:text-[11px]">
        {TERMINAL_LINES.map((l) => (
          <p key={l.cmd} className="flex justify-between gap-4">
            <span className="text-bone/80">
              <span className="text-amber">$</span> {l.cmd}
            </span>
            <span className="shrink-0 text-scope">✓ {l.out}</span>
          </p>
        ))}
        <p>
          <span className="text-amber">$</span> <span className="blink text-amber">▊</span>
        </p>
      </div>
    </div>
  );
}

/** Notarium: a purchased document — watermark, payment, gated chapters. */
export function MarketplaceCard() {
  return (
    <div className="relative flex h-full items-center justify-center p-6" aria-hidden>
      <div className="relative h-full w-[62%] border border-line bg-panel2">
        <div className="space-y-2 p-4">
          {[85, 95, 72, 90, 64, 88].map((w, i) => (
            <div key={i} className="h-1.5 bg-line" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="absolute inset-0 flex rotate-[-24deg] items-center justify-center font-mono text-[10px] tracking-[0.35em] text-amber/35">
          LICENSED · SD-4021
        </p>
        <div className="absolute inset-x-0 bottom-0 space-y-1.5 border-t border-line p-3 font-mono text-[9px]">
          <p className="flex justify-between text-dim">
            <span>CH 1–3 · UNLOCKED</span>
            <span className="text-scope">TOKEN ✓</span>
          </p>
          <p className="flex justify-between text-dim">
            <span>CH 4–9 · GATED</span>
            <span>🔒</span>
          </p>
          <p className="flex justify-between">
            <span className="text-dim">RAZORPAY</span>
            <span className="text-scope">₹ PAID · ATOMIC</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/** STI Portal: the 11-stage machine as the centerpiece, lighting in sequence. */
export function StateMachine() {
  return (
    <div className="flex h-full flex-col justify-center gap-5 px-5 py-4 md:px-8" aria-hidden>
      <p className="font-mono text-[9px] tracking-[0.25em] text-dim">
        APPLICATION LIFECYCLE — 11 STATES, ALWAYS EXACTLY ONE
      </p>
      <div className="flex items-center">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex flex-1 items-center">
            <div
              className="size-3 shrink-0 rounded-full border border-scope"
              style={{
                background: "#4a9b8a",
                animation: "stage-light 6.6s ease-in-out infinite",
                animationDelay: `${i * 0.6}s`,
              }}
            />
            {i < 10 && <div className="h-px flex-1 bg-line" />}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STI_ROLES.map((r) => (
          <span
            key={r}
            className="border border-line px-2 py-1 font-mono text-[8px] tracking-[0.2em] text-dim"
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

const LOGS = [
  "[OLLAMA] Ingesting appraisal narratives...",
  "[OLLAMA] Extracting competency tags...",
  "[NEO4J] Executing Cypher merge on skill nodes...",
  "[NEO4J] Found 14 matching competency relations",
  "[MATCH] Applying threshold filters for FIELD ENG...",
  "[FASTAPI] Resolved target role mapping (84ms)",
];

export function SkillGraph() {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setLogIndex((i) => (i + 1) % LOGS.length);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative flex h-full flex-col justify-between p-4 font-mono text-xs" aria-hidden>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-2 text-[8px] tracking-[0.2em] text-dim">
        <span>competencegraph — skills schema</span>
        <span>NEO4J · OLLAMA</span>
      </div>

      {/* Graph Area */}
      <div className="relative flex-1">
        {/* SVG Connections */}
        <svg className="absolute inset-0 size-full pointer-events-none">
          <line
            x1="15%"
            y1="22%"
            x2="50%"
            y2="50%"
            className="flow-line stroke-amber/40 stroke-[1.5]"
          />
          <line
            x1="85%"
            y1="22%"
            x2="50%"
            y2="50%"
            className="flow-line stroke-scope/40 stroke-[1.5]"
          />
          <line
            x1="15%"
            y1="78%"
            x2="50%"
            y2="50%"
            className="flow-line stroke-line stroke-[1.5]"
          />
          <line
            x1="85%"
            y1="78%"
            x2="50%"
            y2="50%"
            className="flow-line stroke-amber/40 stroke-[1.5]"
          />
        </svg>

        {/* Nodes */}
        {/* Center Node */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber bg-panel px-3 py-2 text-center shadow-lg min-w-[100px]">
          <p className="text-[9px] text-amber font-semibold tracking-wider">ROLE: FIELD ENG</p>
          <p className="text-[6px] text-dim mt-0.5">DETERMINISTIC</p>
        </div>

        {/* Ollama / LLM */}
        <div className="absolute left-[15%] top-[22%] -translate-x-1/2 -translate-y-1/2 border border-line bg-panel2 px-2 py-1 text-center">
          <p className="text-[9px] text-bone">OLLAMA</p>
          <p className="text-[6px] text-scope">LLM EXTRACT</p>
        </div>

        {/* Neo4j */}
        <div className="absolute left-[85%] top-[22%] -translate-x-1/2 -translate-y-1/2 border border-line bg-panel2 px-2 py-1 text-center">
          <p className="text-[9px] text-bone">NEO4J</p>
          <p className="text-[6px] text-scope">SKILL GRAPH</p>
        </div>

        {/* FastAPI */}
        <div className="absolute left-[15%] top-[78%] -translate-x-1/2 -translate-y-1/2 border border-line bg-panel2 px-2 py-1 text-center">
          <p className="text-[9px] text-bone">FASTAPI</p>
          <p className="text-[6px] text-dim">REST API</p>
        </div>

        {/* PostgreSQL */}
        <div className="absolute left-[85%] top-[78%] -translate-x-1/2 -translate-y-1/2 border border-line bg-panel2 px-2 py-1 text-center">
          <p className="text-[9px] text-bone">POSTGRES</p>
          <p className="text-[6px] text-dim">REGISTRY</p>
        </div>
      </div>

      {/* Log Console at Bottom */}
      <div className="border-t border-line pt-2 text-[9px] text-dim flex justify-between items-center min-h-[1.5rem]">
        <span className="text-scope">{LOGS[logIndex]}</span>
        <span className="text-amber blink">▊</span>
      </div>
    </div>
  );
}
