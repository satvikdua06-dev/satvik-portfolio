"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  label: string;
  base: number;
  jitter: number;
  unit: string;
  decimals?: number;
}

/** A ticking instrument value — jitters around its base like live telemetry. */
export default function Readout({ label, base, jitter, unit, decimals = 0 }: Props) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(base);

  useEffect(() => {
    if (reduced || jitter === 0) return;
    const iv = setInterval(() => {
      setV(base + (Math.random() * 2 - 1) * jitter);
    }, 600);
    return () => clearInterval(iv);
  }, [base, jitter, reduced]);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[9px] tracking-[0.2em] text-dim">{label}</span>
      <span className="font-mono text-sm text-amber tabular-nums">
        {v.toFixed(decimals)}
        <span className="ml-1 text-[9px] text-dim">{unit}</span>
      </span>
    </div>
  );
}
