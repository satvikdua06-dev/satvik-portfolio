import type { Metadata } from 'next';
import { SECTIONS } from '@/data/sections';
import ScrollEngine from '@/components/ScrollEngine';
import ProjectsGrid from '@/components/ProjectsGrid';
import SpecsGrid from '@/components/SpecsGrid';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Satvik Dua — Software Engineer',
  description:
    'Full-stack, AI/ML, and robotics engineer. RigVision, CompetenceGraph, Notarium.',
  openGraph: {
    title: 'Satvik Dua — Software Engineer',
    description: 'Full-stack, AI/ML, and robotics engineer.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Satvik Dua',
  jobTitle: 'Software Engineer',
  description: 'Full-stack, AI/ML, and robotics engineer.',
  email: 'satvikdua06@gmail.com',
};

export default function Home() {
  return (
    <main
      style={{
        background: 'var(--base-dark)',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Satvik Dua — Software Engineer</h1>
      <ScrollEngine sections={SECTIONS} />
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          background: 'var(--base-dark)',
        }}
      >
        <ProjectsGrid />
        <SpecsGrid />
        <Footer />
      </div>
    </main>
  );
}
