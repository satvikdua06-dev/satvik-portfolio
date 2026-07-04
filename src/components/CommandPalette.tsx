"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_SECTIONS, PROJECTS, SITE } from "@/data/site";
import { sfx } from "@/lib/audio";

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

function buildCommands(close: () => void): Command[] {
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    close();
  };
  return [
    ...NAV_SECTIONS.map((s) => ({
      id: s.id,
      label: `Go to ${s.label}`,
      hint: s.index,
      run: () => go(s.id),
    })),
    ...PROJECTS.map((p) => ({
      id: p.id,
      label: `Project: ${p.title}`,
      hint: p.codename,
      run: () => go(p.id),
    })),
    {
      id: "email",
      label: "Send email",
      hint: SITE.email,
      run: () => {
        window.location.href = `mailto:${SITE.email}`;
        close();
      },
    },
    {
      id: "sound",
      label: "Toggle ambient sound",
      hint: "SND",
      run: () => {
        sfx.toggle();
        close();
      },
    },
  ];
}

/** Cmd/Ctrl+K palette — keyboard-first navigation, doubles as the mobile menu. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const commands = buildCommands(close).filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // Reset happens on open (event handlers), not in an effect
    const openFresh = () => {
      setQuery("");
      setSel(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery("");
            setSel(0);
          }
          return !o;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", openFresh);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", openFresh);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, commands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && commands[sel]) {
      sfx.confirm();
      commands[sel].run();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[85] flex items-start justify-center bg-void/80 px-4 pt-[18vh] backdrop-blur-sm"
          onPointerDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-lg border border-line bg-panel shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="font-mono text-xs text-amber">&gt;_</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Where to, operator?"
                aria-label="Search commands"
                className="w-full bg-transparent py-3.5 font-mono text-sm text-bone placeholder:text-dim focus:outline-none"
              />
              <kbd className="font-mono text-[9px] text-dim">ESC</kbd>
            </div>
            <ul role="listbox" aria-label="Commands" className="max-h-72 overflow-y-auto py-1">
              {commands.length === 0 && (
                <li className="px-4 py-3 font-mono text-xs text-dim">
                  NO MATCH — signal lost. Clear the query and retry.
                </li>
              )}
              {commands.map((c, i) => (
                <li key={c.id} role="option" aria-selected={i === sel}>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.confirm();
                      c.run();
                    }}
                    onPointerMove={() => setSel(i)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-xs transition-colors ${
                      i === sel ? "bg-panel2 text-amber" : "text-bone/80"
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-[9px] tracking-[0.2em] text-dim">{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
