'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
  progress: number;
  visible: boolean;
};

const BLOCK_COUNT = 12;

function blockBar(progress: number): string {
  const filled = Math.round(Math.max(0, Math.min(1, progress)) * BLOCK_COUNT);
  return '█'.repeat(filled) + '░'.repeat(BLOCK_COUNT - filled);
}

export default function LoadingOverlay({ progress }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.6, ease: 'easeInOut' } }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--base-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Scanline overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Top-left label */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '28px',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: 'var(--accent-silver)',
          textTransform: 'uppercase',
          zIndex: 1,
        }}
      >
        INITIALIZING RENDER PIPELINE
      </div>

      {/* Center stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          gap: '20px',
          padding: '0 24px',
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '80px',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          SATVIK DUA
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '2px',
            border: '1px solid rgba(158,158,158,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${pct}%`,
              background: 'var(--accent-red)',
              transition: 'width 300ms ease-out',
            }}
          />
        </div>

        {/* Block bar text */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '12px',
            letterSpacing: '0.08em',
            color: 'var(--accent-silver)',
            whiteSpace: 'nowrap',
          }}
        >
          {`FRAME CACHE  [${blockBar(progress)}]  ${pct}%`}
        </div>
      </div>

      {/* Bottom-right pulsing dot + label */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent-red)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--accent-silver)',
            textTransform: 'uppercase',
          }}
        >
          AWAITING SIGNAL
        </span>
      </div>
    </motion.div>
  );
}
