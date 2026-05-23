type Project = {
  number: string;
  title: string;
  context: string;
  year: string;
  stack: string[];
  bullets: string[];
};

const PROJECTS: Project[] = [
  {
    number: '01',
    title: 'WellAnalysis',
    context: 'Drilling Operations Dashboard — ONGC',
    year: '2025',
    stack: ['Python', 'PostgreSQL', 'Streamlit', 'Next.js', 'pdfplumber'],
    bullets: [
      'Automated ETL pipeline with watchdog to ingest daily PDF drilling reports in real time — eliminated manual data entry for ONGC stakeholders.',
      'Extraction layer using pdfplumber + regex parses unstructured metadata and dynamic tabular data (depths, costs, mud weights, material consumption).',
      'Normalised PostgreSQL schema via SQLAlchemy modelling Areas → Rigs → Wells → Daily Progress Reports with transactional commits to prevent duplicate ingestion.',
      'Analytics dashboard in Streamlit surfaces executive KPIs and a deep-dive interface exposing 40+ operational parameters per well.',
    ],
  },
  {
    number: '02',
    title: 'MedCollaborate',
    context: 'Hospital Collaboration Selection Platform',
    year: '2025',
    stack: ['MERN', 'Docker', 'GridFS', 'JWT', 'Recharts'],
    bullets: [
      'Full-stack MERN platform to ingest, evaluate, and rank hospital collaboration prospects across multi-dimensional KPIs.',
      'Modular scoring engine in Node.js with dynamic weight allocation across 7+ parameters — real-time recalibration without recomputation.',
      'Dual-frontend architecture (public onboarding + secure admin) with separate security postures and scalability profiles.',
      'High-throughput file ingestion via Multer + Streamifier + MongoDB GridFS for large accreditation documents.',
      'Containerised with Docker Compose, isolating frontend / backend / database for reproducible deployments.',
    ],
  },
  {
    number: '03',
    title: 'STI Portal',
    context: 'Summer Term Internship Workflow',
    year: '2025',
    stack: ['React', 'Node.js', 'MongoDB', 'Vercel', 'JWT'],
    bullets: [
      'Role-based workflow automation digitising the end-to-end internship lifecycle — 7 user roles, multi-stage approval pipeline.',
      'State-machine-driven backend managing 11-stage application transitions (draft → approval → grading) with full traceability.',
      'Resilient multi-step application wizard with debounced auto-save — prevents data loss during long-form submissions.',
      'Zero-friction external evaluation via tokenised "magic links" — secure, authentication-free input from industry mentors.',
      'Stateless deployment on Vercel + cloud backend designed for 1000+ concurrent users.',
    ],
  },
];

export default function ProjectsGrid() {
  return (
    <section
      style={{
        background: 'var(--base-dark)',
        padding: '120px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
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
            marginBottom: '24px',
          }}
        >
          Selected Projects
        </h3>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            fontWeight: 900,
            color: 'white',
            textTransform: 'uppercase',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '88px',
          }}
        >
          Things I&rsquo;ve shipped.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PROJECTS.map((p, i) => (
            <article
              key={p.number}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '32px',
                padding: '56px 0',
                borderTop:
                  i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
              className="md:!grid-cols-[100px_minmax(0,1fr)_minmax(0,1.4fr)]"
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '14px',
                  letterSpacing: '0.4em',
                  color: 'var(--accent-red)',
                  textTransform: 'uppercase',
                }}
              >
                {p.number} / {p.year}
              </div>

              {/* Title + context + stack */}
              <div>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(36px, 4.5vw, 60px)',
                    fontWeight: 900,
                    color: 'white',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    marginBottom: '12px',
                  }}
                >
                  {p.title}
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: '24px',
                  }}
                >
                  {p.context}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  {p.stack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '11px',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '6px 12px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullets */}
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {p.bullets.map((b, j) => (
                  <li
                    key={j}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      lineHeight: 1.65,
                      color: 'rgba(255,255,255,0.7)',
                      paddingLeft: '20px',
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '11px',
                        width: '8px',
                        height: '1px',
                        background: 'var(--accent-red)',
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
