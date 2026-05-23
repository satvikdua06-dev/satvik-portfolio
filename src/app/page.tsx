'use client';

import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { SECTIONS } from '@/data/sections';
import Navbar from '@/components/Navbar';
import SectionBlock from '@/components/SectionBlock';
import ProjectsGrid from '@/components/ProjectsGrid';
import SpecsGrid from '@/components/SpecsGrid';
import Footer from '@/components/Footer';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const s1Progress = useTransform(scrollYProgress, [0, 0.385], [0, 1]);
  const s2Progress = useTransform(scrollYProgress, [0.308, 0.692], [0, 1]);
  const s3Progress = useTransform(scrollYProgress, [0.615, 1.0], [0, 1]);
  const progresses = [s1Progress, s2Progress, s3Progress];

  return (
    <main
      style={{
        background: 'var(--base-dark)',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <div ref={containerRef} style={{ height: '1300vh', position: 'relative' }}>
        {SECTIONS.map((section, i) => (
          <SectionBlock
            key={section.id}
            section={section}
            sectionProgress={progresses[i]}
            globalProgress={scrollYProgress}
            sectionIndex={i}
            isFirst={i === 0}
          />
        ))}
      </div>
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          background: 'var(--base-dark)',
        }}
      >
        <ProjectsGrid />
        <SpecsGrid />
        <Footer />
      </div>
    </main>
  );
}
