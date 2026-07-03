'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { SectionData } from '@/data/sections';
import FrameCanvas from './FrameCanvas';
import SectionOverlay from './SectionOverlay';

type Props = {
  section: SectionData;
  sectionProgress: MotionValue<number>;
  sectionIndex: number;
  isFirst: boolean;
  isLast?: boolean;
  triggerLoad?: boolean;
  onCriticalReady?: (n: number) => void;
  isActive?: boolean;
};

export default function SectionBlock({
  section,
  sectionProgress,
  sectionIndex,
  isFirst,
  isLast,
  triggerLoad,
  onCriticalReady,
  isActive,
}: Props) {
  // Cross-fade opacity — always compute all three transforms, select by position
  const fadeIn = useTransform(sectionProgress, [0, 0.08], [0, 1]);
  const fadeOut = useTransform(sectionProgress, [0.88, 1.0], [1, 0]);
  const combinedOpacity = useTransform(
    [fadeIn, fadeOut] as MotionValue<number>[],
    ([fi, fo]: number[]) => fi * fo
  );
  // S1 skips fade-in (first thing visible); S3 skips fade-out (nothing follows)
  const opacity = isFirst ? fadeOut : isLast ? fadeIn : combinedOpacity;

  return (
    <>
      {/*
       * Scroll spacer: keeps the 1300vh total height intact so useScroll
       * math is unchanged. No visible content here.
       */}
      <section
        id={section.id}
        style={{
          height: section.stickyHeight,
          marginTop: isFirst ? 0 : '-100vh',
          pointerEvents: 'none',
        }}
      />

      {/*
       * Visual layer: position:fixed keeps it pinned to the viewport origin
       * regardless of scroll, so all three sections always occupy the same
       * screen position. Opacity drives the cross-fade — no slide.
       *
       * The 1300vh container has no transform/filter so position:fixed
       * correctly resolves to the initial containing block (viewport).
       */}
      <motion.div
        style={{
          opacity,
          position: 'fixed',
          inset: 0,
          zIndex: sectionIndex + 1,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <FrameCanvas
            sectionProgress={sectionProgress}
            frameCount={section.frameCount}
            framesPath={section.framesPath}
            triggerLoad={triggerLoad}
            onCriticalReady={onCriticalReady}
            isActive={isActive}
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
    </>
  );
}
