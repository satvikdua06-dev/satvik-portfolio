"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/site";
import ProjectSection from "./ProjectSection";

interface Props {
  projects: Project[];
}

export default function WorkContainer({ projects }: Props) {
  const [activeId, setActiveId] = useState(projects[0]?.id || "");
  const [isWorkVisible, setIsWorkVisible] = useState(false);
  const projectsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Observer for active project item
    const observers = new Map<string, IntersectionObserver>();

    projects.forEach((p) => {
      const el = document.getElementById(p.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(p.id);
            }
          });
        },
        {
          rootMargin: "-30% 0px -50% 0px",
        }
      );

      observer.observe(el);
      observers.set(p.id, observer);
    });

    // Observer to toggle sidebar visibility only inside projects list
    const listEl = projectsListRef.current;
    let listObserver: IntersectionObserver | null = null;
    if (listEl) {
      listObserver = new IntersectionObserver(
        ([entry]) => {
          setIsWorkVisible(entry.isIntersecting);
        },
        {
          rootMargin: "-120px 0px -10% 0px",
        }
      );
      listObserver.observe(listEl);
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
      if (listObserver) listObserver.disconnect();
    };
  }, [projects]);

  return (
    <div className="relative w-full">
      {/* Floating Left Project Index Sidebar (outside grid flow) */}
      <AnimatePresence>
        {isWorkVisible && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden lg:block fixed left-6 top-[35%] z-[70] w-48 font-mono text-[10px] tracking-[0.2em] pointer-events-auto"
          >
            <div className="flex flex-col gap-5 border-l border-line pl-4">
              <p className="text-[9px] text-amber tracking-[0.3em] font-semibold uppercase mb-1">
                SYSTEM INDEX
              </p>
              {projects.map((p, idx) => {
                const isActive = activeId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      const el = document.getElementById(p.id);
                      if (el) {
                        const top = el.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top, behavior: "smooth" });
                      }
                    }}
                    className="group text-left transition-colors duration-300 cursor-pointer flex items-center gap-3 active:scale-95"
                    style={{ color: isActive ? "var(--color-amber)" : "rgba(138,130,112,0.6)" }}
                  >
                    <span className={isActive ? "text-amber" : "text-line group-hover:text-amber/60"}>
                      [{String(idx + 1).padStart(2, "0")}]
                    </span>
                    <span className={`uppercase truncate ${isActive ? "font-semibold" : ""}`}>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Projects list taking up the full centered width */}
      <div ref={projectsListRef} className="mx-auto max-w-6xl px-6 md:px-10">
        {projects.map((p) => (
          <ProjectSection key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
