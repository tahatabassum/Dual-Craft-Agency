import { Link } from 'react-router-dom';
import { Target, Zap, Heart, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import TeamCard from '../components/TeamCard';
import { teamMembers } from '../data/teamMembers';

const values = [
  {
    icon: Target,
    title: 'Results-Oriented',
    description: 'We measure success by your business outcomes, not vanity metrics.',
  },
  {
    icon: Zap,
    title: 'Technical Excellence',
    description: 'Clean code, fast performance, and modern best practices — every time.',
  },
  {
    icon: Heart,
    title: 'Client-First',
    description: 'We communicate clearly, deliver on time, and treat your business like our own.',
  },
];

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom">
          <div className="max-w-2xl">
            <AnimatedSection>
              <p className="section-label text-teal">Our Story</p>
              <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
                About Dual Craft
              </h1>
              <p className="text-white/65 text-lg leading-relaxed">
                We started Dual Craft with a simple idea: businesses deserve an agency that 
                truly understands both the technical and marketing sides of the web — 
                not just one or the other.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── MISSION ─────────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection from="left">
              <p className="section-label">Our Mission</p>
              <h2 className="section-title mb-6">
                The Dual Craft Difference
              </h2>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Most agencies are either developers who outsource marketing, or marketers 
                who outsource development. That disconnect costs clients time, money, and 
                results. We eliminated that problem from day one.
              </p>
              <p className="text-charcoal/70 leading-relaxed mb-6">
                Dual Craft is built around two complementary skill sets — one partner 
                deeply rooted in web development and AI, the other a specialist in 
                digital marketing and SEO. Together, we deliver websites that are 
                technically excellent <em>and</em> strategically positioned to grow.
              </p>
              <p className="text-charcoal/70 leading-relaxed">
                Our clients aren't just tech startups. We work with local dental 
                clinics, retail shops, service providers, and entrepreneurs who need 
                a professional digital presence they can trust.
              </p>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection from="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '10+', label: 'Projects Delivered' },
                  { number: '100%', label: 'Client Satisfaction' },
                  { number: '2', label: 'Expert Partners' },
                  { number: '24h', label: 'Response Time' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="card p-8 text-center"
                  >
                    <p className="text-4xl font-heading font-black text-teal mb-2">
                      {stat.number}
                    </p>
                    <p className="text-charcoal/60 text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── VALUES ──────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <p className="section-label">How We Work</p>
            <h2 className="section-title">Our Core Values</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.12}>
                <div className="card p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-5">
                    <v.icon size={26} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-navy mb-3">{v.title}</h3>
                  <p className="text-charcoal/65 text-sm leading-relaxed">{v.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ────────────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <p className="section-label">The People Behind It</p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-3">
              My Team
            </h2>
            <p className="text-charcoal/60 text-base">
              The two minds behind Dual Craft
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {teamMembers.map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.15}>
                <TeamCard member={member} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section className="section-sm bg-navy">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to work with us?
            </h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Let's have a conversation about your project and see how we can help.
            </p>
            <Link to="/contact" className="btn-primary">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
