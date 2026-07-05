import type { Metadata } from "next";
import CanvasBackground from "@/components/CanvasBackground";
import Cursor from "@/components/Cursor";
import BackToSurface from "@/components/BackToSurface";
import OperatorProfile from "@/components/OperatorProfile";

export const metadata: Metadata = {
  title: "Operator Profile — Satvik Dua",
  description:
    "Who's running this: trap, pistol, golf, astrophotography, cooking — the operator behind the systems.",
};

export default function OperatorPage() {
  return (
    <main className="relative">
      <CanvasBackground />
      <Cursor />
      <BackToSurface />
      <div className="relative z-10">
        <OperatorProfile />
      </div>
    </main>
  );
}
