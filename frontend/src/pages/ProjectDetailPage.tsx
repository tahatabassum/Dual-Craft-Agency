import { useParams, Link, Navigate } from 'react-router-dom';
import { ExternalLink, GitBranch, ArrowLeft } from 'lucide-react';
import { projects } from '../data/projects';
import AnimatedSection from '../components/AnimatedSection';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <main className="pt-20">
      {/* ─── BACK + HEADER ─────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom">
          <AnimatedSection>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white/50 hover:text-teal text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Projects
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-2xl">
                <span className="badge bg-teal/20 text-teal mb-4">
                  {project.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
                  {project.title}
                </h1>
                <p className="text-white/60 text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center"
                >
                  <ExternalLink size={16} />
                  View Live Site
                </a>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-teal justify-center"
                  >
                    <GitBranch size={16} />
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CONTENT ─────────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thumbnail */}
              {project.thumbnail && (
                <AnimatedSection>
                  <div className="rounded-2xl overflow-hidden shadow-card-hover aspect-[16/9] bg-navy/5">
                    <img
                      src={project.thumbnail}
                      alt={`${project.title} screenshot`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </AnimatedSection>
              )}

              {!project.thumbnail && (
                <AnimatedSection>
                  <div className="rounded-2xl overflow-hidden shadow-card bg-navy/5 aspect-[16/9] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-navy/20 flex items-center justify-center mx-auto mb-3">
                        <span className="text-3xl font-bold text-navy/40">{project.title.charAt(0)}</span>
                      </div>
                      <p className="text-charcoal/40 text-sm">Screenshot coming soon</p>
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* Long description */}
              <AnimatedSection>
                <div className="card p-8">
                  <h2 className="text-2xl font-heading font-bold text-navy mb-5">About This Project</h2>
                  {project.longDescription ? (
                    <div className="space-y-4">
                      {project.longDescription.trim().split('\n\n').map((para, i) => (
                        <p key={i} className="text-charcoal/75 leading-relaxed">
                          {para.trim()}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-charcoal/75 leading-relaxed">{project.description}</p>
                  )}
                </div>
              </AnimatedSection>

              {/* Screenshots gallery */}
              {project.screenshots && project.screenshots.length > 0 && (
                <AnimatedSection>
                  <h2 className="text-xl font-heading font-bold text-navy mb-4">Screenshots</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.screenshots.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Screenshot ${i + 1}`}
                        className="rounded-xl shadow-card w-full object-cover"
                      />
                    ))}
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech stack */}
              <AnimatedSection from="right">
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider mb-4">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="badge-navy">{tech}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Live link */}
              <AnimatedSection from="right" delay={0.1}>
                <div className="card p-6">
                  <h3 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider mb-4">
                    Links
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-teal text-sm font-medium hover:underline"
                    >
                      <ExternalLink size={14} />
                      {project.liveUrl.replace('https://', '')}
                    </a>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-charcoal/60 text-sm font-medium hover:text-navy"
                      >
                        <GitBranch size={14} />
                        GitHub Repository
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>

              {/* CTA card */}
              <AnimatedSection from="right" delay={0.2}>
                <div className="bg-navy rounded-2xl p-6">
                  <h3 className="font-heading font-bold text-white mb-2 text-lg">
                    Like what you see?
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    We can build something like this for your business.
                  </p>
                  <Link to="/contact" className="btn-primary text-sm w-full justify-center">
                    Get a Quote
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
