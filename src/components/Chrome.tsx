"use client";

import { useEffect } from "react";
import Boot from "./Boot";
import Cursor from "./Cursor";
import Hud from "./Hud";
import Nav from "./Nav";
import CommandPalette from "./CommandPalette";
import EasterEgg from "./EasterEgg";
import { sfx } from "@/lib/audio";

/** Global console chrome: boot, cursor, HUD, nav, palette, egg, UI ticks. */
export default function Chrome() {
  useEffect(() => {
    // UI tick on every interactive press (no-op while sound is off)
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button']")) sfx.click();
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <>
      <Nav />
      <Boot />
      <Cursor />
      <Hud />
      <CommandPalette />
      <EasterEgg />
    </>
  );
}
