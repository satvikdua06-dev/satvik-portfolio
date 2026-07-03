'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

export default function CursorDot() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const outerX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const outerY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const innerX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const innerY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovered(!!target?.closest('a, button, [data-cursor="hover"]'));
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        animate={{
          scale: hovered ? 1.6 : 1,
          borderColor: hovered
            ? 'var(--accent-yellow)'
            : 'rgba(232, 0, 45, 0.7)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          x: outerX,
          y: outerY,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '1px solid rgba(232, 0, 45, 0.7)',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
        className="hidden-on-touch"
      />

      {/* Inner dot */}
      <motion.div
        style={{
          x: innerX,
          y: innerY,
          position: 'fixed',
          top: '13px',
          left: '13px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--accent-red)',
          pointerEvents: 'none',
          zIndex: 9998,
        }}
        className="hidden-on-touch"
      />
    </>
  );
}
