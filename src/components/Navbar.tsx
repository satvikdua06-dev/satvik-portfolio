'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const NAV_SECTIONS = [
  { id: 'builder', label: 'Builder' },
  { id: 'machine', label: 'Machine' },
  { id: 'system', label: 'System' },
] as const;

// Target progress values land just past each section's slide-in completion
// Machine slide-in completes at global 0.385; System at 0.692
const SECTION_TARGETS: Record<string, number> = {
  machine: 0.40,
  system: 0.72,
};

export default function Navbar() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 100],
    ['rgba(8,8,8,0)', 'rgba(8,8,8,0.9)']
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(14px)']
  );

  const [activeSection, setActiveSection] = useState<string>('builder');

  // Each section is 500vh with -100vh overlap → midpoints at ~4.5vh and ~8.5vh
  useMotionValueEvent(scrollY, 'change', (y) => {
    const vh = window.innerHeight;
    if (y < vh * 4.5) setActiveSection('builder');
    else if (y < vh * 8.5) setActiveSection('machine');
    else setActiveSection('system');
  });

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'builder') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetProgress = SECTION_TARGETS[id];
    if (targetProgress === undefined) return;
    const container = document.querySelector('[data-scroll-container]') as HTMLElement | null;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const scrollableRange = container.offsetHeight - window.innerHeight;
    window.scrollTo({ top: containerTop + targetProgress * scrollableRange, behavior: 'smooth' });
  };

  return (
    <motion.nav
      style={{ background, backdropFilter, WebkitBackdropFilter: backdropFilter }}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-14 py-5 flex justify-between items-center"
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          letterSpacing: '0.22em',
        }}
        className="text-white uppercase"
      >
        SATVIK DUA
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {NAV_SECTIONS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => scrollToSection(e, item.id)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.35em',
              color:
                activeSection === item.id ? 'white' : 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              position: 'relative',
              paddingBottom: '4px',
              transition: 'color 300ms',
              display: 'none',
            }}
            className="md:!block"
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="nav-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--accent-red)',
                }}
              />
            )}
          </a>
        ))}
        <a
          href="#contact"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '10px',
            letterSpacing: '0.35em',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.7)',
            transition: 'all 300ms',
          }}
          className="uppercase px-5 py-2.5 hover:!border-white hover:!text-white"
        >
          CONTACT
        </a>
      </div>
    </motion.nav>
  );
}
