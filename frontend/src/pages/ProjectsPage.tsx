import AnimatedSection from '../components/AnimatedSection';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

export default function ProjectsPage() {
  return (
    <main className="pt-20">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom text-center">
          <AnimatedSection>
            <p className="section-label text-teal">What We've Built</p>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
              Our Projects
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              A curated selection of projects we've designed, built, and launched. 
              Each one represents a real challenge solved with thoughtful execution.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── PROJECTS GRID ──────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <AnimatedSection key={project.slug} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>

          {/* More projects coming note */}
          <AnimatedSection className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border-dashed-teal bg-white/60">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-charcoal/60 text-sm">
                More projects coming soon — Jarvis Assistant and others in progress
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
