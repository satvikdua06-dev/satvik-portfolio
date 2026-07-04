export const SITE = {
  name: "Satvik Dua",
  role: "SDE + AI",
  email: "satvikdua06@gmail.com",
  location: "Jaipur, IN",
  github: "https://github.com/satvikdua",
  linkedin: "https://www.linkedin.com/in/satvikdua",
  positioning:
    "I build robust computer vision systems, graph databases, and data infrastructure designed to run reliably under real-world constraints.",
  eyebrow: "B.TECH CCE · LNMIIT JAIPUR '28 — CV & DATA SYSTEMS INTERN @ ONGC",
};

/** Scroll depth is the site's core metaphor: page bottom = total depth drilled. */
export const WELL_DEPTH_M = 3842;

export type ProjectVisual = "cameras" | "terminal" | "marketplace" | "stages" | "graph";

export interface Project {
  id: string;
  codename: string;
  org: "ONGC" | "PERSONAL" | "LNMIIT";
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  visual: ProjectVisual;
  live?: boolean;
  github?: string;
  readouts: { label: string; base: number; jitter: number; unit: string; decimals?: number }[];
}

export const PROJECTS: Project[] = [
  {
    id: "rigvision",
    codename: "OPS/RIGVISION",
    org: "ONGC",
    title: "RigVision",
    tagline: "Multi-camera PPE detection and industrial monitoring on live drilling rigs.",
    problem:
      "PPE compliance on a working drilling rig is enforced by whoever happens to be looking. Cameras exist, but nobody can watch six feeds at once — violations get noticed after the incident report, not before it.",
    approach:
      "A multi-camera pipeline: YOLOv8 detection with BoT-SORT tracking so a worker keeps their identity across frames, pose-guided keypoint-anchored ROI classification (ResNet18 + k-NN embeddings) for PPE state, exported to ONNX Runtime and accelerated with CUDA 12.6 so it all runs on rig-side hardware. Alongside it: a SCADA-style sensor dashboard with a Modbus sensor simulator and a mini SCADA protocol gateway.",
    outcome:
      "~25 FPS sustained across concurrent live feeds on site hardware, with per-track violation events instead of noisy per-frame alerts. Running against real rig footage at ONGC — not a demo reel.",
    stack: ["YOLOv8", "BoT-SORT", "ONNX Runtime", "CUDA", "OpenCV", "Python", "ResNet18"],
    visual: "cameras",
    github: "https://github.com/satvikdua06-dev/RigVision",
    readouts: [
      { label: "INFERENCE", base: 25, jitter: 1.4, unit: "FPS" },
      { label: "TRACKS", base: 11, jitter: 2, unit: "ACT" },
      { label: "CONF", base: 0.87, jitter: 0.04, unit: "", decimals: 2 },
    ],
  },
  {
    id: "wellanalysis",
    codename: "ETL/WELLANALYSIS",
    org: "ONGC",
    title: "WellAnalysis",
    tagline: "Daily drilling reports, from PDF to queryable dashboard.",
    problem:
      "Every well produces daily drilling reports as PDFs — engineering data trapped in a print format. Comparing wells or spotting a trend meant a person re-typing tables into spreadsheets, again.",
    approach:
      "An ETL pipeline: pdfplumber parses the report PDFs, extracted drilling parameters are validated and loaded through SQLAlchemy into PostgreSQL, and Streamlit dashboards make depth-vs-day curves, mud properties and downtime actually queryable.",
    outcome:
      "Reports that took an afternoon of manual transcription become dashboard rows on arrival. Engineers compare wells instead of retyping them.",
    stack: ["Python", "pdfplumber", "Pandas", "PostgreSQL", "SQLAlchemy", "Streamlit"],
    visual: "terminal",
    readouts: [
      { label: "PARSE", base: 98.2, jitter: 0.6, unit: "%", decimals: 1 },
      { label: "FIELDS", base: 142, jitter: 3, unit: "REC" },
      { label: "QUEUE", base: 3, jitter: 2, unit: "DOC" },
    ],
  },
  {
    id: "competencegraph",
    codename: "HR/COMPETENCEGRAPH",
    org: "ONGC",
    title: "CompetenceGraph",
    tagline: "Neo4j skill-mapping and offline LLM analysis for 500+ employees.",
    problem:
      "Mapping employee competency to corporate roles at ONGC was a manual process reliant on subjective performance appraisal narratives, making it hard to identify organizational skill gaps or match engineers to specific drilling tasks.",
    approach:
      "Built an offline competency management system. Used an offline LLM pipeline (Ollama) to extract structured skill tags from narrative performance reports, loading them into a Neo4j graph. A deterministic threshold-registry pattern resolved role alignments.",
    outcome:
      "Mapped over 500 employee profiles to roles. FastAPI served the graph queries locally, ensuring zero data leaks and running fully on-premises on standard workstation hardware.",
    stack: ["Neo4j", "Ollama", "FastAPI", "React", "PostgreSQL", "Docker"],
    visual: "graph",
    github: "https://github.com/satvikdua06-dev/CompetenceGraph",
    readouts: [
      { label: "EMPLOYEES", base: 512, jitter: 0, unit: "MAP" },
      { label: "RELATIONS", base: 1420, jitter: 12, unit: "EDGE" },
      { label: "LATENCY", base: 84, jitter: 6, unit: "MS" },
    ],
  },
  {
    id: "notarium",
    codename: "MKT/NOTARIUM",
    org: "PERSONAL",
    title: "Notarium",
    tagline: "A live marketplace for course notes.",
    problem:
      "Good student notes circulate as unpaid favors and dead Google Drive links. There was no way for the people who write them to get paid — or for buyers to trust what they were getting.",
    approach:
      "A full marketplace: Razorpay integration for real payments, per-buyer server-side PDF watermarking via sharp so a purchased document carries its buyer's identity, a purchase-gated signed-token chapter viewer, atomic SQL purchase fulfillment, and cross-domain auth. Admin panel with soft-delete and author attribution.",
    outcome:
      "Live and taking real transactions. Watermarking made piracy traceable enough that sellers actually listed their best material.",
    stack: [
      "Node.js", "Express", "TypeScript", "React", "Vite",
      "Supabase", "PostgreSQL", "Redis", "Razorpay", "sharp",
    ],
    visual: "marketplace",
    live: true,
    github: "https://github.com/satvikdua06-dev/Notes_Sell",
    readouts: [
      { label: "GATEWAY", base: 99.1, jitter: 0.3, unit: "%", decimals: 1 },
      { label: "WMARK", base: 214, jitter: 6, unit: "MS" },
      { label: "ORDERS", base: 7, jitter: 3, unit: "24H" },
    ],
  },
  {
    id: "sti-portal",
    codename: "EDU/STI-PORTAL",
    org: "LNMIIT",
    title: "STI Portal",
    tagline: "LNMIIT's summer training internship system, 1,000+ users.",
    problem:
      "The university's internship placement ran on email threads and spreadsheets: applications lost between departments, no one able to say where any student actually stood in the process.",
    approach:
      "A MERN application built around an explicit 11-stage state machine — every application is always in exactly one auditable state — with role-based views for 7 roles (candidates, mentors, faculty, HR, coordinators, admin, superadmin) so each party sees only their own queue.",
    outcome:
      "1,000+ users through a single pipeline. The question 'where is my application?' became a lookup instead of a phone call.",
    stack: ["MongoDB", "Express", "React", "Node.js", "RBAC"],
    visual: "stages",
    github: "https://github.com/satvikdua06-dev/STI",
    readouts: [
      { label: "USERS", base: 1042, jitter: 4, unit: "REG" },
      { label: "ROLES", base: 7, jitter: 0, unit: "RBAC" },
      { label: "PENDING", base: 36, jitter: 5, unit: "APP" },
    ],
  },
];

export const STI_ROLES = [
  "CANDIDATE", "MENTOR", "FACULTY", "HR", "COORDINATOR", "ADMIN", "SUPERADMIN",
];

export const STATS = [
  { label: "Real-time inference", value: 25, suffix: " FPS", detail: "RigVision on ONGC hardware" },
  { label: "Users, single pipeline", value: 1000, suffix: "+", detail: "STI Portal (LNMIIT)" },
  { label: "State-machine stages", value: 11, suffix: "", detail: "Every application always auditable" },
  { label: "Systems built", value: 5, suffix: "", detail: "Across CV, graph DBs, and full-stack" },
];

export const NAV_SECTIONS = [
  { id: "hero", label: "Surface", index: "000m" },
  { id: "philosophy", label: "Doctrine", index: "740m" },
  { id: "work", label: "Operations", index: "1480m" },
  { id: "telemetry", label: "Telemetry", index: "3100m" },
  { id: "contact", label: "Uplink", index: "3842m" },
];
