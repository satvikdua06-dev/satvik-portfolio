'use client';

import { useRef, useState } from 'react';
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { SectionData } from '@/data/sections';
import Navbar from '@/components/Navbar';
import SectionBlock from '@/components/SectionBlock';
import LoadingOverlay from '@/components/LoadingOverlay';
import AmbientField from '@/components/AmbientField';

type Props = {
  sections: SectionData[];
};

const CRITICAL_TOTAL = 175;

export default function ScrollEngine({ sections }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const s1Progress = useTransform(scrollYProgress, [0, 0.385], [0, 1]);
  const s2Progress = useTransform(scrollYProgress, [0.308, 0.692], [0, 1]);
  const s3Progress = useTransform(scrollYProgress, [0.615, 1.0], [0, 1]);
  const progresses = [s1Progress, s2Progress, s3Progress];

  const [s2TriggerLoad, setS2TriggerLoad] = useState(false);
  const [s3TriggerLoad, setS3TriggerLoad] = useState(false);
  const [criticalReady, setCriticalReady] = useState(false);
  const [criticalProgress, setCriticalProgress] = useState(0);

  const [s1Active, setS1Active] = useState(true);
  const [s2Active, setS2Active] = useState(false);
  const [s3Active, setS3Active] = useState(false);

  useMotionValueEvent(s1Progress, 'change', (v) => {
    if (v > 0.65) setS2TriggerLoad(true);
  });
  useMotionValueEvent(s2Progress, 'change', (v) => {
    if (v > 0.65) setS3TriggerLoad(true);
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setS1Active(v < 0.5);
    setS2Active(v > 0.25 && v < 0.75);
    setS3Active(v > 0.55);
  });

  const triggerLoads = [undefined, s2TriggerLoad, s3TriggerLoad] as const;
  const activeStates = [s1Active, s2Active, s3Active];

  return (
    <>
      <AmbientField scrollYProgress={scrollYProgress} />
      <AnimatePresence>
        {!criticalReady && (
          <LoadingOverlay
            progress={criticalProgress / CRITICAL_TOTAL}
            visible={!criticalReady}
          />
        )}
      </AnimatePresence>
      <Navbar />
      <div ref={containerRef} data-scroll-container style={{ height: '1300vh', position: 'relative' }}>
        {sections.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            sectionProgress={progresses[i]}
            sectionIndex={i}
            isFirst={i === 0}
            isLast={i === sections.length - 1}
            triggerLoad={triggerLoads[i]}
            onCriticalReady={
              i === 0
                ? (n) => {
                    setCriticalProgress(n);
                    if (n >= CRITICAL_TOTAL) setCriticalReady(true);
                  }
                : undefined
            }
            isActive={activeStates[i]}
          />
        ))}
      </div>
    </>
  );
}
