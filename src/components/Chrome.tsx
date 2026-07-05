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

    // returning from /operator: restore the scroll position they left from
    const y = sessionStorage.getItem("dua-return-y");
    if (sessionStorage.getItem("dua-restore") === "1" && y) {
      sessionStorage.removeItem("dua-restore");
      requestAnimationFrame(() => {
        window.scrollTo({
          top: Number(y),
          behavior: "instant",
        });
      });
    }

    // Enable smooth scrolling only after layout and scroll restoration settle
    let smoothRaf = 0;
    requestAnimationFrame(() => {
      smoothRaf = requestAnimationFrame(() => {
        document.documentElement.classList.add("smooth-scroll");
      });
    });

    return () => {
      window.removeEventListener("pointerdown", onDown);
      if (smoothRaf) cancelAnimationFrame(smoothRaf);
      document.documentElement.classList.remove("smooth-scroll");
    };
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
