const ITEMS = [
  { label: 'INFERENCE LATENCY', value: '<3ms', sub: 'ONNX Runtime · CUDA 12.6 · RigVision' },
  { label: 'EMPLOYEES SERVED', value: '20K', sub: 'ONGC LMS — designed capacity' },
  { label: 'WORKFLOW STAGES', value: '11', sub: 'STI Portal state machine' },
  { label: 'LIVE CAMERAS', value: '4', sub: 'Simultaneous tracking · RigVision' },
];

export default function SpecsGrid() {
  return (
    <section
      style={{
        background: 'var(--carbon)',
        padding: '96px 24px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            letterSpacing: '0.5em',
            color: 'var(--accent-silver)',
            textTransform: 'uppercase',
            opacity: 0.6,
            marginBottom: '64px',
          }}
        >
          Selected Work — By the Numbers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {ITEMS.map((item, i) => (
            <div
              key={item.label}
              style={{
                paddingLeft: i === 0 ? 0 : '32px',
                paddingBottom: '48px',
                borderLeft:
                  i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '12px',
                  letterSpacing: '0.4em',
                  color: 'var(--accent-silver)',
                  textTransform: 'uppercase',
                  opacity: 0.5,
                  marginBottom: '20px',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 5.5vw, 72px)',
                  fontWeight: 900,
                  color: 'white',
                  marginBottom: '12px',
                  lineHeight: 1,
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                }}
              >
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
