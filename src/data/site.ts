export const SITE = {
  name: "Satvik Dua",
  role: "Field Systems Engineer",
  email: "satvikdua06@gmail.com",
  location: "Jaipur, IN",
  // TODO: confirm these handles before deploying
  github: "https://github.com/satvikdua",
  linkedin: "https://www.linkedin.com/in/satvikdua",
  positioning:
    "I build vision systems that watch live drilling rigs — and ship the software that runs around them.",
  eyebrow: "B.TECH CCE · LNMIIT JAIPUR — CV & DATA SYSTEMS INTERN @ ONGC",
};

/** Scroll depth is the site's core metaphor: page bottom = total depth drilled. */
export const WELL_DEPTH_M = 3842;

export type ProjectVisual = "cameras" | "pipeline" | "watermark" | "stages";

export interface Project {
  id: string;
  index: string;
  codename: string;
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  visual: ProjectVisual;
  readouts: { label: string; base: number; jitter: number; unit: string; decimals?: number }[];
}

export const PROJECTS: Project[] = [
  {
    id: "rigvision",
    index: "01",
    codename: "OPS/RIGVISION",
    title: "RigVision",
    tagline: "Multi-camera PPE detection on live drilling rigs.",
    problem:
      "PPE compliance on a working drilling rig is enforced by whoever happens to be looking. Cameras exist, but nobody can watch six feeds at once — violations get noticed after the incident report, not before it.",
    approach:
      "A multi-camera inference pipeline: YOLOv8 detection with BoT-SORT tracking so a worker keeps their identity across frames, exported to ONNX and run on CUDA so the whole thing holds real-time on rig-side hardware instead of a cloud GPU it will never have.",
    outcome:
      "~25 FPS sustained across concurrent live feeds on site hardware, with per-track violation events instead of noisy per-frame alerts. Running against real rig footage at ONGC — not a demo reel.",
    stack: ["YOLOv8", "BoT-SORT", "ONNX Runtime", "CUDA", "OpenCV", "Python"],
    visual: "cameras",
    readouts: [
      { label: "INFERENCE", base: 25, jitter: 1.4, unit: "FPS" },
      { label: "TRACKS", base: 11, jitter: 2, unit: "ACT" },
      { label: "CONF", base: 0.87, jitter: 0.04, unit: "", decimals: 2 },
    ],
  },
  {
    id: "wellanalysis",
    index: "02",
    codename: "ETL/WELLANALYSIS",
    title: "WellAnalysis",
    tagline: "Daily drilling reports, from PDF to dashboard.",
    problem:
      "Every well produces daily drilling reports as PDFs — engineering data trapped in a print format. Comparing wells or spotting a trend meant a person re-typing tables into spreadsheets, again.",
    approach:
      "An ETL pipeline that parses the report PDFs, extracts and validates the drilling parameters into a structured store, and feeds dashboards where depth-vs-day curves, mud properties and downtime actually become queryable.",
    outcome:
      "Reports that took an afternoon of manual transcription become dashboard rows on arrival. Engineers compare wells instead of retyping them.",
    stack: ["Python", "PDF parsing", "Pandas", "PostgreSQL", "Dash/Plotly"],
    visual: "pipeline",
    readouts: [
      { label: "PARSE", base: 98.2, jitter: 0.6, unit: "%", decimals: 1 },
      { label: "FIELDS", base: 142, jitter: 3, unit: "REC" },
      { label: "QUEUE", base: 3, jitter: 2, unit: "DOC" },
    ],
  },
  {
    id: "notarium",
    index: "03",
    codename: "MKT/NOTARIUM",
    title: "Notarium",
    tagline: "A deployed marketplace for course notes.",
    problem:
      "Good student notes circulate as unpaid favors and dead Google Drive links. There was no way for the people who write them to sell them — or for buyers to trust what they were getting.",
    approach:
      "A full marketplace: Razorpay integration for real payments, per-buyer PDF watermarking so a purchased document carries its owner's identity, and preview generation so buyers see before they pay.",
    outcome:
      "Deployed and taking real transactions. Watermarking made piracy traceable enough that sellers actually listed their best material.",
    stack: ["Next.js", "Razorpay", "PDF watermarking", "PostgreSQL", "Vercel"],
    visual: "watermark",
    readouts: [
      { label: "GATEWAY", base: 99.1, jitter: 0.3, unit: "%", decimals: 1 },
      { label: "WMARK", base: 214, jitter: 6, unit: "MS" },
      { label: "ORDERS", base: 7, jitter: 3, unit: "24H" },
    ],
  },
  {
    id: "sti-portal",
    index: "04",
    codename: "GOV/STI-PORTAL",
    title: "STI Portal",
    tagline: "An internship tracker for 1,000+ users.",
    problem:
      "ONGC's summer training intake ran on email threads and spreadsheets: applications lost between departments, no one able to say where any candidate actually stood in the process.",
    approach:
      "A MERN application built around an explicit 11-stage state machine — every application is always in exactly one auditable state, with role-based views for candidates, mentors and HR so each party sees their own queue.",
    outcome:
      "1,000+ users through a single pipeline. The question 'where is my application?' became a lookup instead of a phone call.",
    stack: ["MongoDB", "Express", "React", "Node.js", "RBAC"],
    visual: "stages",
    readouts: [
      { label: "USERS", base: 1042, jitter: 4, unit: "REG" },
      { label: "STAGE", base: 11, jitter: 0, unit: "MAX" },
      { label: "PENDING", base: 36, jitter: 5, unit: "APP" },
    ],
  },
];

export const STATS = [
  { label: "Real-time inference", value: 25, suffix: " FPS", detail: "RigVision, multi-camera on CUDA" },
  { label: "Users in production", value: 1000, suffix: "+", detail: "STI Portal, ONGC intake pipeline" },
  { label: "State-machine stages", value: 11, suffix: "", detail: "Every application, always auditable" },
  { label: "Systems shipped", value: 5, suffix: "", detail: "Incl. CompetenceGraph — Neo4j HR graph" },
];

export const NAV_SECTIONS = [
  { id: "hero", label: "Surface", index: "000m" },
  { id: "philosophy", label: "Doctrine", index: "740m" },
  { id: "work", label: "Operations", index: "1480m" },
  { id: "telemetry", label: "Telemetry", index: "3100m" },
  { id: "contact", label: "Uplink", index: "3842m" },
];
