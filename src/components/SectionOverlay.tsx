'use client';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { SectionData, ScrollPhase } from '@/data/sections';

type Props = {
  sectionProgress: MotionValue<number>;
  section: SectionData;
};

export default function SectionOverlay({ sectionProgress, section }: Props) {
  const heroTitleOpacity = useTransform(
    sectionProgress,
    [0, 0.08, 0.22, 0.3],
    [0, 1, 1, 0]
  );

  const railOpacity = useTransform(sectionProgress, [0.05, 0.18], [0, 1]);

  return (
    <>
      {/* TOP-LEFT LABEL */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '40px',
          zIndex: 15,
          pointerEvents: 'none',
        }}
      >
        {section.systemLabel ? (
          <div className="flex flex-row items-center gap-2">
            <span
              style={{
                width: '6px',
                height: '6px',
                background: '#E8002D',
                borderRadius: '50%',
                display: 'block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                letterSpacing: '0.4em',
                opacity: 0.7,
              }}
              className="text-white uppercase"
            >
              {section.systemLabel}
            </span>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-3">
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ width: '20px', height: '1.5px', background: '#E8002D' }} />
              <span style={{ width: '20px', height: '1.5px', background: '#E8002D' }} />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '13px',
                letterSpacing: '0.4em',
                opacity: 0.7,
              }}
              className="text-white uppercase"
            >
              {section.accentLabel}
            </span>
          </div>
        )}
      </div>

      {/* HERO TITLE */}
      {section.heroTitle && (
        <motion.div
          style={{ opacity: heroTitleOpacity }}
          className="absolute inset-0 flex items-center justify-center flex-col"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ ['data-z']: 8 } as any)}
        >
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8 }} />
          <div
            style={{ pointerEvents: 'none', zIndex: 8 }}
            className="flex flex-col items-center"
          >
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(96px, 14vw, 200px)',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              {section.heroTitle}
            </h1>
            {section.heroSubtitle && (
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  letterSpacing: '0.55em',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginTop: '24px',
                }}
              >
                {section.heroSubtitle}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* PHASE BLOCKS */}
      {section.phases.map((phase, i) => {
        const isEmpty = !phase.headline && !phase.subheadline && !phase.paragraph;
        if (isEmpty) return null;
        return <PhaseBlock key={i} phase={phase} sectionProgress={sectionProgress} />;
      })}

      {/* RIGHT RAIL */}
      {section.sideRailItems.length > 0 && (
        <motion.div
          style={{
            opacity: railOpacity,
            position: 'absolute',
            right: '40px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 15,
          }}
          className="flex flex-col items-end gap-4"
        >
          {section.sideRailItems.map((item) => (
            <span
              key={item}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'right',
                textTransform: 'uppercase',
              }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      )}

    </>
  );
}

function PhaseBlock({
  phase,
  sectionProgress,
}: {
  phase: ScrollPhase;
  sectionProgress: MotionValue<number>;
}) {
  const mid = (phase.scrollStart + phase.scrollEnd) / 2;
  const opacity = useTransform(
    sectionProgress,
    [
      phase.scrollStart,
      phase.scrollStart + 0.07,
      mid,
      phase.scrollEnd - 0.07,
      phase.scrollEnd,
    ],
    [0, 1, 1, 1, 0]
  );
  const y = useTransform(
    sectionProgress,
    [
      phase.scrollStart,
      phase.scrollStart + 0.1,
      phase.scrollEnd - 0.1,
      phase.scrollEnd,
    ],
    [28, 0, 0, -28]
  );

  const alignment = phase.alignment;
  const lines = phase.headline.split('\n');

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 12,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 'min(560px, 60vw)',
  };

  if (alignment === 'left') {
    containerStyle.left = '40px';
    containerStyle.bottom = '15vh';
    containerStyle.alignItems = 'flex-start';
    containerStyle.textAlign = 'left';
  } else if (alignment === 'right') {
    containerStyle.right = '160px';
    containerStyle.bottom = '15vh';
    containerStyle.alignItems = 'flex-end';
    containerStyle.textAlign = 'right';
  } else {
    containerStyle.left = '50%';
    containerStyle.bottom = '12vh';
    containerStyle.transform = 'translateX(-50%)';
    containerStyle.alignItems = 'center';
    containerStyle.textAlign = 'center';
  }

  return (
    <motion.div style={{ ...containerStyle, opacity, y }}>
      {phase.subheadline && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          {phase.subheadline}
        </span>
      )}
      {phase.headline && (
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6.5vw, 100px)',
            fontWeight: 900,
            lineHeight: 1,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          {lines.map((line, i) => {
            const isAccent =
              phase.accentWordIndex !== undefined &&
              i === phase.accentWordIndex &&
              phase.accentColor;
            return (
              <span
                key={i}
                style={{
                  display: 'block',
                  color: isAccent ? phase.accentColor : 'white',
                }}
              >
                {line}
              </span>
            );
          })}
        </h2>
      )}
      <span
        style={{
          width: '32px',
          height: '1px',
          background: '#E8002D',
          marginTop: '24px',
          marginBottom: '24px',
          marginLeft: alignment === 'right' ? 'auto' : 0,
          display: 'block',
        }}
      />
      {phase.paragraph && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 1.5vw, 20px)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: alignment === 'center' ? '620px' : '500px',
            textAlign: alignment === 'center' ? 'center' : alignment,
          }}
        >
          {phase.paragraph}
        </p>
      )}
    </motion.div>
  );
}
