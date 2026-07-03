'use client';

type Project = {
  number: string;
  title: string;
  tag: string;
  stack: string[];
  description: string;
  stats: [string, string];
};

const PROJECTS: Project[] = [
  {
    number: '01',
    title: 'RigVision',
    tag: 'ONGC Internship · Computer Vision · 2025',
    stack: ['YOLOv8', 'BoT-SORT', 'ONNX', 'CUDA 12.6', 'ResNet18', 'FastAPI', 'React', 'Three.js', 'Redis', 'Docker', 'OpenCV', 'RTMPose'],
    description:
      'Multi-camera PPE and safety monitoring system for ONGC drilling rigs. YOLOv8 + BoT-SORT tracking across 4 simultaneous feeds. ResNet18 + k-NN few-shot PPE classifier with pose-guided ROI extraction and temporal smoothing. ONNX Runtime on CUDA 12.6 with a React/Three.js SCADA dashboard and Modbus sensor simulator.',
    stats: ['<3ms inference · ONNX + CUDA', '4 cameras · simultaneous tracking'],
  },
  {
    number: '02',
    title: 'Notarium',
    tag: 'Personal Project · Marketplace · Deployed',
    stack: ['Node.js', 'Express', 'TypeScript', 'React', 'Vite', 'Supabase', 'Razorpay', 'PDF watermarking', 'Render', 'Vercel'],
    description:
      'Notes-selling marketplace with purchase-gated content delivery. Server-side PDF watermarking embeds the buyer\'s identity into each download. Razorpay webhook fulfillment triggers access. Supabase storage backend, Node/Express/TypeScript API, React + Vite frontend. Live on Render + Vercel.',
    stats: ['Webhook-driven · zero manual fulfillment', 'Deployed · Render + Vercel + Supabase'],
  },
  {
    number: '03',
    title: 'CompetenceGraph',
    tag: 'ONGC Internship · HR Systems · Neo4j',
    stack: ['Neo4j', 'Ollama', 'LLM', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    description:
      'Neo4j-backed competency management system mapping ONGC employees to positions via skills. Offline LLM pipeline (Ollama) extracts binary competence flags from appraisal narratives. Threshold-registry pattern keeps runtime queries fully deterministic. FastAPI REST layer with React frontend.',
    stats: ['500+ employees mapped', 'Offline LLM · no external API calls'],
  },
  {
    number: '04',
    title: 'STI Portal',
    tag: 'LNMIIT · Full-Stack · 1000+ Users',
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'PostgreSQL', 'JWT', 'RBAC', 'Docker', 'Nodemailer'],
    description:
      'Internship lifecycle management platform for LNMIIT covering student applications through final grading. Seven distinct roles with JWT + RBAC access control. Eleven-stage workflow state machine with automated notifications at each transition. MERN stack with PostgreSQL for structured workflow data.',
    stats: ['7 roles · 11 workflow stages', '1000+ active users'],
  },
  {
    number: '05',
    title: 'MedCollaborate',
    tag: 'Healthcare · Resource Coordination · Dockerized',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker Compose', 'Recharts', 'REST API'],
    description:
      'Hospital resource coordination platform with a 7-KPI automated scoring engine that ranks incoming resource requests across 40+ indicators. Configurable weight registry allows administrators to tune scoring without code changes. Recharts analytics dashboard. Fully containerised with Docker Compose.',
    stats: ['40+ KPI indicators', 'Configurable · no-code weight tuning'],
  },
  {
    number: '06',
    title: 'WellAnalysis',
    tag: 'ONGC Internship · ETL Pipeline · Python',
    stack: ['Python', 'pdfplumber', 'Pandas', 'Streamlit', 'Watchdog', 'PostgreSQL'],
    description:
      'Automated ETL pipeline for ONGC drilling report processing. A watchdog process monitors an input folder for incoming PDF daily reports, extracts structured drilling metrics using pdfplumber, flags anomalies, and pushes cleaned data to a live Streamlit dashboard. Pandas data layer with configurable extraction schemas per report template.',
    stats: ['PDF → dashboard · fully automated', 'Anomaly flagging · configurable schemas'],
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

              {/* Description + Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {p.description}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '20px',
                  }}
                >
                  {p.stats.map((stat, j) => (
                    <div key={j}>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '10px',
                          letterSpacing: '0.2em',
                          color: 'var(--accent-silver)',
                          textTransform: 'uppercase',
                          lineHeight: 1.5,
                        }}
                      >
                        {stat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
