import { PROJECTS, SITE } from "@/data/site";
import Chrome from "@/components/Chrome";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import ProjectSection from "@/components/ProjectSection";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: "Software Engineer — Computer Vision & Full-Stack",
  description: SITE.positioning,
  email: SITE.email,
  affiliation: "LNMIIT Jaipur",
};

export default function Home() {
  return (
    <main className="relative bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Chrome />
      <Hero />
      <Philosophy />

      <section id="work" aria-label="Featured projects" className="border-t border-line">
        <div className="reg-corners bg-void px-6 py-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[10px] tracking-[0.3em] text-amber">
              1480M — OPERATIONS // FEATURED SYSTEMS
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold uppercase md:text-6xl">
              Four systems, all live<span className="text-amber">.</span>
            </h2>
          </div>
        </div>
        {PROJECTS.map((p) => (
          <ProjectSection key={p.id} project={p} />
        ))}
      </section>

      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
