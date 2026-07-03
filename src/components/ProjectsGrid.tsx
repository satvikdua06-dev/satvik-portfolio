'use client';

type Project = {
  number: string;
  title: string;
  tag: string;
  stack: string[];
  bullets: string[];
  stat: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    title: 'RigVision',
    tag: 'ONGC Internship · Computer Vision · 2025',
    stack: ['YOLOv8', 'BoT-SORT', 'ONNX', 'CUDA 12.6', 'ResNet18', 'FastAPI', 'React', 'Three.js', 'Redis', 'Docker', 'OpenCV'],
    bullets: [
      'Multi-camera PPE and safety monitoring system across 4 simultaneous feeds on an active ONGC drilling rig. YOLOv8 detection with BoT-SORT multi-object tracking at 30fps per camera.',
      'Pose-guided PPE classifier: RTMPose extracts body keypoints, ROI crops isolate hardhat/vest/goggle zones, ResNet18 generates embeddings matched to a k-NN gallery with supermajority voting and temporal smoothing. CLIP was benchmarked and abandoned — ResNet18 generalised better on small safety-equipment crops.',
      'ONNX Runtime on CUDA 12.6 cuts per-frame inference to under 3ms. GPU acceleration via provider priority: CUDAExecutionProvider → CPUExecutionProvider fallback.',
      'React + Three.js SCADA-style dashboard with live sensor telemetry. Modbus sensor simulator for offline testing. Redis pub/sub for real-time data streaming. Docker Compose deployment.',
    ],
    stat: '<3ms inference · 4 simultaneous cameras',
  },
  {
    number: '02',
    title: 'Notarium',
    tag: 'Personal Project · Marketplace · Deployed',
    stack: ['Node.js', 'Express', 'TypeScript', 'React', 'Vite', 'Supabase', 'Razorpay', 'PDF watermarking', 'Render', 'Vercel'],
    bullets: [
      'Notes-selling marketplace with full purchase lifecycle: upload, preview, purchase, download. Server-side PDF watermarking embeds the buyer\'s unique ID into every downloaded document — leaks are traceable back to the purchaser.',
      'Razorpay webhook fulfillment: payment events trigger access grant in the backend, unlocking the purchase-gated PDF viewer. Zero manual fulfillment — the entire flow is automated.',
      'Supabase storage backend with signed URL generation for time-limited secure access. Node/Express/TypeScript API. React + Vite frontend with an in-browser PDF viewer that blocks right-click and keyboard shortcuts.',
      'Deployed across three platforms: Render (API), Vercel (frontend), Supabase (storage + auth). CI via GitHub Actions.',
    ],
    stat: 'Deployed · webhook-driven zero-touch fulfillment',
  },
  {
    number: '03',
    title: 'CompetenceGraph',
    tag: 'ONGC Internship · HR Systems · Neo4j · 2025',
    stack: ['Neo4j', 'Ollama', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    bullets: [
      'Neo4j-backed competency management system for ONGC HR. Models employees, positions, and required skills as a property graph. Maps 500+ employees to their current and target positions via binary competence edges.',
      'Offline LLM pipeline using Ollama reads annual appraisal narratives and extracts structured competency flags — no data leaves the ONGC network, no external API calls. Threshold-registry pattern ensures deterministic runtime query paths regardless of model output variance.',
      'FastAPI REST layer exposes competency gap queries, skill-to-position matching, and promotion eligibility checks. React frontend with filterable employee-position graph view.',
      'Docker Compose deployment. PostgreSQL for relational HR data alongside the Neo4j graph store.',
    ],
    stat: '500+ employees mapped · fully offline LLM',
  },
  {
    number: '04',
    title: 'WellAnalysis',
    tag: 'ONGC Internship · ETL Pipeline · Python · 2025',
    stack: ['Python', 'pdfplumber', 'Pandas', 'Streamlit', 'Watchdog', 'PostgreSQL', 'SQLAlchemy'],
    bullets: [
      'Automated ETL pipeline eliminating manual data entry for ONGC drilling operations. A watchdog process monitors an input folder and triggers ingestion the moment a new PDF daily report lands.',
      'Extraction layer using pdfplumber + regex handles unstructured ONGC report templates — parses metadata headers, dynamic tabular sections (depths, costs, mud weights, material consumption), and multi-page continuation tables.',
      'Normalised PostgreSQL schema modelled via SQLAlchemy: Areas → Rigs → Wells → Daily Progress Reports. Transactional commits with duplicate-detection guards prevent double ingestion on retry.',
      'Streamlit dashboard surfaces two views: executive KPI summary per well and a deep-dive interface exposing 40+ operational parameters. Anomaly flagging highlights out-of-range values automatically.',
    ],
    stat: '40+ KPIs · PDF → dashboard fully automated',
  },
  {
    number: '05',
    title: 'MedCollaborate',
    tag: 'Healthcare · Resource Coordination · Dockerized · 2025',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker Compose', 'Recharts', 'GridFS', 'JWT', 'Multer'],
    bullets: [
      'Hospital resource coordination platform for evaluating and ranking collaboration prospects across multi-dimensional criteria. Built to handle large accreditation document submissions alongside structured scoring data.',
      'Modular scoring engine in Node.js applies dynamic weight allocation across 7+ KPI parameters. Weights are configurable at runtime via an admin panel — no redeployment needed to adjust scoring policy.',
      'High-throughput file ingestion via Multer + Streamifier + MongoDB GridFS handles large PDF accreditation documents without buffering the entire file in memory.',
      'Dual-frontend architecture: a public-facing onboarding flow and a secured admin interface with separate JWT-gated access and independent security postures. Containerised with Docker Compose.',
    ],
    stat: '7 KPI parameters · configurable weight registry',
  },
  {
    number: '06',
    title: 'STI Portal',
    tag: 'LNMIIT · Full-Stack · 1000+ Users · 2024',
    stack: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'JWT', 'RBAC', 'Docker', 'Nodemailer', 'Vercel'],
    bullets: [
      'End-to-end internship lifecycle management for LNMIIT covering student applications through final grading and record archival. Live with 1000+ active users across student, faculty, and administrative roles.',
      'Seven distinct user roles (student, guide, coordinator, HOD, director, admin, external examiner) with JWT + RBAC access control. Each role sees a different interface and action set — no shared permission bleed.',
      'State-machine-driven backend managing 11-stage application transitions (draft → submitted → approved → allocated → midterm → final → graded) with full audit trail and automated email notifications at each stage.',
      'Multi-step application wizard with debounced auto-save prevents data loss during long submissions. External evaluators receive tokenised magic links — secure grading access without requiring account creation.',
    ],
    stat: '7 roles · 11 workflow stages · 1000+ users',
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
              className="project-card md:!grid-cols-[100px_minmax(0,1fr)_minmax(0,1.4fr)]"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: '32px',
                padding: '56px 0',
                borderTop:
                  i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out',
                willChange: 'transform',
                position: 'relative',
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 10}deg) translateZ(4px)`;
                e.currentTarget.style.boxShadow = `${x * -20}px ${y * -20}px 40px rgba(0,0,0,0.4)`;
                e.currentTarget.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
                e.currentTarget.style.setProperty('--my', `${(y + 0.5) * 100}%`);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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
                {p.number}
              </div>

              {/* Title + tag + stack */}
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
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    marginBottom: '24px',
                  }}
                >
                  {p.tag}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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

              {/* Bullets + stat row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <div
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '16px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '10px',
                    letterSpacing: '0.25em',
                    color: 'var(--accent-silver)',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.stat}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
