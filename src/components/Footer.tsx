export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: 'var(--base-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 24px',
      }}
    >
      <div
        style={{ maxWidth: '1400px', margin: '0 auto', gap: '40px' }}
        className="flex flex-col md:flex-row justify-between items-end"
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 7vw, 96px)',
              fontWeight: 900,
              color: 'white',
              textTransform: 'uppercase',
              lineHeight: 0.95,
              marginBottom: '24px',
            }}
          >
            Satvik Dua
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            Engineering systems that ship.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <a
            href="mailto:satvikdua06@gmail.com"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--accent-silver)',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '4px',
              transition: 'color 300ms',
            }}
            className="hover:!text-white"
          >
            satvikdua06@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/satvikdua"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--accent-silver)',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '4px',
              marginTop: '12px',
              transition: 'color 300ms',
            }}
            className="hover:!text-white"
          >
            LinkedIn
          </a>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '9px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              marginTop: '24px',
            }}
          >
            2026 SATVIK DUA — ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
}
