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
    accentLabel: '01 / THE BUILDER',
    systemLabel: 'SYSTEM ACTIVE',
    heroTitle: 'SATVIK DUA',
    heroSubtitle: 'SOFTWARE • ROBOTICS • AI',
    sideRailItems: [],
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
        scrollEnd: 0.72,
        alignment: 'left',
        headline: 'Built to\nship.',
        subheadline: 'Three years across the stack',
        paragraph:
          'MERN, Next.js, Python, PostgreSQL. Architected platforms for ONGC drilling operations and hospital collaboration scoring. From schema design to production deploy.',
      },
      {
        scrollStart: 0.72,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'Every commit\nis a decision.',
        subheadline: 'Engineering, not just coding',
        paragraph:
          'State machines for workflow integrity. JWT and RBAC for access control. Docker for reproducibility. The system has to survive contact with users.',
      },
    ],
  },
  {
    id: 'machine',
    frameCount: 168,
    framesPath: '/frames/section2',
    stickyHeight: '500vh',
    accentLabel: '02 — THE MACHINE',
    sideRailItems: ['ARDUINO', 'RASPBERRY PI', 'MQTT', 'SENSOR FUSION'],
    phases: [
      {
        scrollStart: 0,
        scrollEnd: 0.28,
        alignment: 'left',
        headline: 'EMBEDDED.\nWIRELESS.\nLIVE.',
        subheadline: 'INSIDE THE LOOP',
        paragraph:
          'A surveillance rover with real-time telemetry. Built from circuit board to control system. Sensors meet code where the world becomes data.',
        accentWordIndex: 2,
        accentColor: '#E8002D',
      },
      {
        scrollStart: 0.28,
        scrollEnd: 0.7,
        alignment: 'left',
        headline: 'Every wire\nis a decision.',
        subheadline: 'DD ROBOCON',
        paragraph:
          'Competitive robotics at the national level. Design, fabrication, embedded firmware. Hardware that has to perform on stage when it matters.',
      },
      {
        scrollStart: 0.7,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'The fastest\nloop wins.',
        subheadline: 'REAL-TIME CONTROL',
        paragraph:
          'MQTT telemetry over wireless. Closed-loop sensor integration. Autonomous navigation. The control system is where engineering becomes motion.',
      },
    ],
  },
  {
    id: 'system',
    frameCount: 210,
    framesPath: '/frames/section3',
    stickyHeight: '500vh',
    accentLabel: '03 — THE SYSTEM',
    sideRailItems: ['LOCAL LLMs', 'RAG', 'POSTGRES', 'DOCKER'],
    phases: [
      {
        scrollStart: 0,
        scrollEnd: 0.3,
        alignment: 'center',
        headline: 'DATA.\nMODELS.\nSCALE.',
        subheadline: 'BUILT TO PRODUCTION',
        paragraph:
          'STI Portal: 11-stage workflow, 7 roles, 1000+ users. Hospitals platform: 7 KPIs, real-time ranking, containerised. Systems designed to ship and survive.',
        accentWordIndex: 1,
        accentColor: '#F5C518',
      },
      {
        scrollStart: 0.3,
        scrollEnd: 0.72,
        alignment: 'left',
        headline: 'From PDF\nto pipeline.',
        subheadline: 'WELLANALYSIS — ONGC',
        paragraph:
          'Watchdog ingests daily drilling reports. pdfplumber and regex extract unstructured tables. PostgreSQL normalises. Streamlit surfaces 40+ KPIs per well to executives.',
      },
      {
        scrollStart: 0.72,
        scrollEnd: 1.0,
        alignment: 'right',
        headline: 'Local models.\nReal answers.',
        subheadline: 'LLM SERVING',
        paragraph:
          'Ollama and vLLM for local deployment. RAG pipelines, prompt engineering, model serving. AI that runs on hardware you own, not someone else’s server.',
      },
    ],
  },
];
