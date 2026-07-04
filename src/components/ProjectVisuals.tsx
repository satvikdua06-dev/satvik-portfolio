import type { ProjectVisual } from "@/data/site";

/**
 * Instrument-panel visuals for each project — pure DOM/CSS, no images.
 * Each one is a stylized readout of what the system actually does.
 */

function Cameras() {
  return (
    <div className="grid h-full grid-cols-2 gap-px bg-line" aria-hidden>
      {["CAM-01", "CAM-02", "CAM-03", "CAM-04"].map((cam, i) => (
        <div key={cam} className="scanlines relative overflow-hidden bg-panel2 p-2">
          <div className="flex items-center justify-between font-mono text-[8px] text-dim">
            <span>{cam}</span>
            <span className="flex items-center gap-1 text-alarm">
              <span className="blink inline-block size-1 rounded-full bg-alarm" />
              REC
            </span>
          </div>
          {/* drifting detection box */}
          <div
            className="drift-box absolute border border-amber"
            style={{
              width: "34%",
              height: "42%",
              left: `${18 + i * 9}%`,
              top: `${30 + (i % 2) * 12}%`,
              animationDelay: `${i * 1.3}s`,
            }}
          >
            <span className="absolute -top-3.5 left-0 bg-amber px-1 font-mono text-[7px] text-void">
              PPE {i % 2 ? "OK" : "0.9"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pipeline() {
  const stages = ["PDF INGEST", "PARSE + EXTRACT", "VALIDATE", "STORE", "DASHBOARD"];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-5" aria-hidden>
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div className="relative h-8 w-1 overflow-hidden bg-line">
            <div className="flow-pulse absolute h-3 w-full bg-scope" style={{ animationDelay: `${i * 0.5}s` }} />
          </div>
          <div className="flex-1 border border-line bg-panel2 px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-dim">
            {String(i + 1).padStart(2, "0")} · {s}
          </div>
        </div>
      ))}
    </div>
  );
}

function Watermark() {
  return (
    <div className="relative flex h-full items-center justify-center p-6" aria-hidden>
      {[2, 1, 0].map((n) => (
        <div
          key={n}
          className="absolute border border-line bg-panel2"
          style={{
            width: "58%",
            height: "76%",
            transform: `translate(${n * 10}px, ${n * -8}px)`,
            opacity: 1 - n * 0.3,
          }}
        >
          {n === 0 && (
            <>
              <div className="space-y-2 p-4">
                {[80, 95, 70, 88, 60, 92, 75].map((w, i) => (
                  <div key={i} className="h-1.5 bg-line" style={{ width: `${w}%` }} />
                ))}
              </div>
              <p className="absolute inset-0 flex rotate-[-24deg] items-center justify-center font-mono text-[10px] tracking-[0.35em] text-amber/40">
                LICENSED · SD-4021
              </p>
              <p className="absolute right-2 bottom-2 font-mono text-[9px] text-scope">₹ PAID ✓</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function Stages() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-6" aria-hidden>
      <p className="font-mono text-[9px] tracking-[0.25em] text-dim">APPLICATION LIFECYCLE — 11 STATES</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="size-2.5 rounded-full border border-scope"
              style={{
                background: "#45d8dc",
                animation: "stage-light 5.5s ease-in-out infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            />
            {i < 10 && <div className="h-px w-full" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-px bg-line">
        {["APPLIED", "VERIFIED", "ALLOTTED", "COMPLETED"].map((s, i) => (
          <div key={s} className="flex justify-between bg-panel2 px-3 py-2 font-mono text-[9px]">
            <span className="text-dim">{s}</span>
            <span className="text-scope">{[412, 268, 197, 165][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectVisualPanel({ visual }: { visual: ProjectVisual }) {
  switch (visual) {
    case "cameras":
      return <Cameras />;
    case "pipeline":
      return <Pipeline />;
    case "watermark":
      return <Watermark />;
    case "stages":
      return <Stages />;
  }
}
