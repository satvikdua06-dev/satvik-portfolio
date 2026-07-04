import { SITE } from "@/data/site";

export default function Footer() {
  return (
    // pb-36 clears the fixed HUD pinned at bottom-left
    <footer className="border-t border-line bg-void px-6 pt-6 pb-36 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] text-dim">
        <p>
          © {new Date().getFullYear()} {SITE.name.toUpperCase()} — ALL SYSTEMS NOMINAL
        </p>
        <p aria-hidden className="hidden md:block">
          TIP: TYPE <span className="text-amber">DRILL</span> ANYWHERE
        </p>
        <a href="#hero" className="transition-colors hover:text-amber">
          ↑ RETURN TO SURFACE
        </a>
      </div>
    </footer>
  );
}
