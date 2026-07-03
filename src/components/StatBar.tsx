const ITEMS = [
  'ONGC INTERNSHIP 2025',
  '4 CAMERAS',
  '<3ms LATENCY',
  '1000+ USERS',
  '500+ EMPLOYEES MAPPED',
];

export default function StatBar() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '56px',
        left: 0,
        right: 0,
        height: '28px',
        background: 'var(--carbon)',
        zIndex: 49,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {ITEMS.map((item, i) => (
          <span key={item} style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: 'var(--accent-silver)',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
            {i < ITEMS.length - 1 && (
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: 'rgba(232, 0, 45, 0.6)',
                  margin: '0 14px',
                  lineHeight: 1,
                }}
              >
                ·
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
