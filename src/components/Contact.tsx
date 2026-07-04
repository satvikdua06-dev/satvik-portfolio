"use client";

import { SITE, WELL_DEPTH_M } from "@/data/site";

const CHANNELS = [
  { k: "EMAIL", v: SITE.email, href: `mailto:${SITE.email}` },
  { k: "GITHUB", v: "github.com/satvikdua", href: SITE.github },
  { k: "LINKEDIN", v: "in/satvikdua", href: SITE.linkedin },
  { k: "STATION", v: SITE.location, href: undefined },
];

/** Final beat: target depth reached, one channel left open. */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="reg-corners relative border-t border-line px-6 pt-28 pb-20 md:px-10"
    >
      <div className="relative mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.3em] text-scope">
          {WELL_DEPTH_M}M — TARGET DEPTH REACHED
        </p>
        <h2 className="font-display mt-6 text-[15vw] leading-[0.9] font-bold uppercase md:text-9xl">
          Open<br />uplink<span className="text-amber">.</span>
        </h2>
        <p className="mt-8 max-w-md text-dim">
          Internships, research, or something that needs to run on real hardware in a real
          place — the channel is open.
        </p>

        <a
          href={`mailto:${SITE.email}`}
          data-magnetic
          className="mt-10 inline-block border border-amber bg-amber px-8 py-4 font-mono text-sm tracking-[0.2em] text-void transition-colors hover:bg-transparent hover:text-amber"
        >
          TRANSMIT → {SITE.email.toUpperCase()}
        </a>

        <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) =>
            c.href ? (
              <a
                key={c.k}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="group bg-panel px-4 py-4 transition-colors hover:bg-panel2"
              >
                <p className="font-mono text-[9px] tracking-[0.25em] text-dim">{c.k}</p>
                <p className="mt-1.5 font-mono text-xs text-bone group-hover:text-amber">{c.v} ↗</p>
              </a>
            ) : (
              <div key={c.k} className="bg-panel px-4 py-4">
                <p className="font-mono text-[9px] tracking-[0.25em] text-dim">{c.k}</p>
                <p className="mt-1.5 font-mono text-xs text-bone">{c.v}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
