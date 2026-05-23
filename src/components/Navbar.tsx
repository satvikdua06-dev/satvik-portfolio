'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

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
    </motion.nav>
  );
}
