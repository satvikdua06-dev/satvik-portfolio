export type ScrollPhase = {
  scrollStart: number;
  scrollEnd: number;
  headline: string;
  subheadline: string;
  paragraph: string;
  alignment: 'left' | 'right' | 'center';
  accentWordIndex?: number;
  accentColor?: string;
};

export type SectionData = {
  id: string;
  frameCount: number;
  framesPath: string;
  stickyHeight: string;
  accentLabel: string;
  systemLabel?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  sideRailItems: string[];
  phases: ScrollPhase[];
};

export const SECTIONS: SectionData[] = [
  {
    id: 'builder',
    frameCount: 175,
    framesPath: '/frames/section1',
    stickyHeight: '500vh',
    accentLabel: '01 / VISION',
    systemLabel: 'SYSTEM ACTIVE',
    heroTitle: 'SATVIK DUA',
    heroSubtitle: 'SOFTWARE • ROBOTICS • AI',
    sideRailItems: ['YOLOV8', 'BOT-SORT', 'ONNX', 'CUDA', 'FASTAPI', 'REDIS', 'THREE.JS'],
    phases: [
      {
        scrollStart: 0,
        scrollEnd: 0.3,
        alignment: 'center',
        headline: '',
        subheadline: '',
        paragraph: '',
      },
      {
        scrollStart: 0.3,
        scrollEnd: 0.55,
        alignment: 'left',
        headline: 'RIGVISION',
        subheadline: 'MULTI-CAMERA · REAL-TIME · ON-SITE',
        paragraph:
          '4-camera PPE and safety monitoring system deployed to an ONGC drilling rig. YOLOv8 + BoT-SORT tracking at 30fps across 4 simultaneous feeds. ResNet18 + k-NN few-shot classifier with pose-guided ROI extraction and temporal smoothing.',
      },
      {
        scrollStart: 0.55,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'GPU\nACCELERATED',
        subheadline: 'ONNX · CUDA 12.6 · FASTAPI · REDIS',
        paragraph:
          'ONNX Runtime on CUDA 12.6 cuts inference to under 3ms per frame. DroidCam feeds → RTMPose keypoint extraction → ROI crops → ResNet18 gallery matching. FastAPI backend with a React + Three.js SCADA dashboard, Redis pub/sub telemetry, and Modbus sensor simulator.',
      },
    ],
  },
  {
    id: 'machine',
    frameCount: 168,
    framesPath: '/frames/section2',
    stickyHeight: '500vh',
    accentLabel: '02 — SYSTEMS',
    sideRailItems: ['MERN', 'POSTGRESQL', 'DOCKER', 'JWT', 'RBAC', 'RECHARTS', 'STREAMLIT'],
    phases: [
      {
        scrollStart: 0,
        scrollEnd: 0.35,
        alignment: 'left',
        headline: 'SCHEMA\nTO\nDEPLOY.',
        subheadline: 'STI PORTAL',
        paragraph:
          'Internship tracking system for LNMIIT. MERN stack. 7 roles (student, guide, coordinator, HOD, director, admin, examiner). 11-stage workflow state machine with JWT + RBAC access control. 1000+ active users across departments.',
        accentWordIndex: 2,
        accentColor: '#E8002D',
      },
      {
        scrollStart: 0.35,
        scrollEnd: 0.60,
        alignment: 'left',
        headline: 'MEDCOLLABORATE',
        subheadline: 'HOSPITAL RESOURCE COORDINATION',
        paragraph:
          'Hospital resource coordination platform. 7-KPI scoring engine ranks resource requests across 40+ indicators. Docker Compose deployment. Recharts analytics dashboard. Automated scoring pipeline with configurable weight registry.',
      },
      {
        scrollStart: 0.60,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'WELLANALYSIS',
        subheadline: 'ETL PIPELINE — ONGC',
        paragraph:
          'ETL pipeline for ONGC drilling reports. Watchdog process monitors a folder for incoming PDF daily reports, extracts structured data, and pushes metrics to a Streamlit dashboard. Pandas + pdfplumber extraction layer with anomaly flagging.',
      },
    ],
  },
  {
    id: 'system',
    frameCount: 210,
    framesPath: '/frames/section3',
    stickyHeight: '500vh',
    accentLabel: '03 — INTELLIGENCE',
    sideRailItems: ['NEO4J', 'OLLAMA', 'FASTAPI', 'REACT', 'DOCKER', 'LLM'],
    phases: [
      {
        scrollStart: 0,
        scrollEnd: 0.5,
        alignment: 'center',
        headline: 'GRAPHS.\nMODELS.\nLOCAL.',
        subheadline: 'COMPETENCEGRAPH',
        paragraph:
          'Neo4j-backed HR competency system for ONGC. Maps 500+ employees to positions via skills. Offline LLM extraction of appraisal narratives into binary competence flags. Threshold-registry discipline keeps the query path deterministic at runtime.',
        accentWordIndex: 1,
        accentColor: '#F5C518',
      },
      {
        scrollStart: 0.5,
        scrollEnd: 0.78,
        alignment: 'left',
        headline: 'NOTARIUM',
        subheadline: 'NOTES MARKETPLACE',
        paragraph:
          'Notes marketplace. Node/Express/TypeScript backend. React + Vite frontend. Supabase storage with server-side PDF watermarking — each download carries the buyer\'s ID embedded in the document. Razorpay webhooks trigger purchase-gated PDF viewer access. Deployed on Render + Vercel + Supabase.',
      },
      {
        scrollStart: 0.78,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'COMPETENCEGRAPH',
        subheadline: 'HR INTELLIGENCE — ONGC',
        paragraph:
          'Neo4j maps 500+ ONGC employees to positions through a binary competency model. An offline Ollama pipeline reads appraisal narratives and extracts structured competency flags — no external API calls, no data leaving the network. A threshold-registry pattern keeps every runtime query fully deterministic. FastAPI REST layer, React frontend, Docker Compose deployment.',
      },
    ],
  },
];
