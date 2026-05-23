'use client';

import { motion, MotionValue, useSpring, useTransform } from 'framer-motion';
import { SectionData } from '@/data/sections';
import FrameCanvas from './FrameCanvas';
import SectionOverlay from './SectionOverlay';

type Props = {
  section: SectionData;
  sectionProgress: MotionValue<number>;
  globalProgress: MotionValue<number>;
  sectionIndex: number;
  isFirst: boolean;
};

const ENTRY_RANGES: Record<number, [number, number]> = {
  1: [0.308, 0.385],
  2: [0.615, 0.692],
};

export default function SectionBlock({
  section,
  sectionProgress,
  globalProgress,
  sectionIndex,
  isFirst,
}: Props) {
  const range = ENTRY_RANGES[sectionIndex] ?? [0, 0];

  const rawSlideY = useTransform(
    globalProgress,
    isFirst ? [0, 1] : range,
    isFirst ? ['0vh', '0vh'] : ['100vh', '0vh']
  );
  const smoothSlideY = useSpring(rawSlideY, {
    stiffness: 400,
    damping: 50,
    mass: 0.5,
    restDelta: 0.01,
  });

  return (
    <section
      id={section.id}
      style={{
        height: section.stickyHeight,
        position: 'relative',
        marginTop: isFirst ? 0 : '-100vh',
        zIndex: sectionIndex + 1,
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            y: isFirst ? 0 : smoothSlideY,
            position: 'absolute',
            inset: 0,
            willChange: 'transform',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <FrameCanvas
              sectionProgress={sectionProgress}
              frameCount={section.frameCount}
              framesPath={section.framesPath}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              pointerEvents: 'none',
              background:
                'linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, transparent 25%, transparent 65%, rgba(8,8,8,0.8) 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              pointerEvents: 'none',
              background:
                'linear-gradient(to right, rgba(8,8,8,0.4) 0%, transparent 30%)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
            <SectionOverlay sectionProgress={sectionProgress} section={section} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
