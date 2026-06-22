import { Link } from 'react-router-dom';
import { Code2, TrendingUp, Globe, Search, Share2, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const services = [
  {
    id: 'web-development',
    icon: Code2,
    title: 'Web Development',
    description:
      'We build fast, modern, and scalable websites using React, TypeScript, and best-in-class tooling. Every site is optimized for performance, SEO, and user experience.',
    included: [
      'Custom React / TypeScript websites',
      'High-converting landing pages',
      'Full-stack web applications',
      'E-commerce integration',
      'CMS setup and management',
      'Performance & Core Web Vitals optimization',
    ],
    accent: 'bg-navy/8 border-navy/10',
    iconBg: 'bg-navy/10 text-navy',
  },
  {
    id: 'digital-marketing',
    icon: TrendingUp,
    title: 'Digital Marketing',
    description:
      'Strategic digital marketing that grows your audience, generates quality leads, and turns visitors into customers. Data-driven, transparent, and results-focused.',
    included: [
      'Search Engine Optimization (SEO)',
      'Local SEO for brick-and-mortar businesses',
      'Google Ads management',
      'Social media strategy & growth',
      'Content marketing & blog strategy',
      'Lead generation campaigns',
      'Monthly performance reports',
    ],
    accent: 'bg-teal/5 border-teal/10',
    iconBg: 'bg-teal/10 text-teal',
  },
];

const extraServices = [
  { icon: Globe, title: 'Domain & Hosting', description: 'We help you choose and set up the right hosting for your needs.' },
  { icon: Search, title: 'SEO Audits', description: 'Full audit of your current site with actionable recommendations.' },
  { icon: Share2, title: 'Social Media Management', description: 'Consistent, on-brand posting across Instagram, Facebook & more.' },
  { icon: Target, title: 'Lead Generation', description: 'Targeted campaigns designed to bring in qualified prospects.' },
];

export default function ServicesPage() {
  return (
    <main className="pt-20">
      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom text-center">
          <AnimatedSection>
            <p className="section-label text-teal">What We Offer</p>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
              Our Services
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              We specialize in two things and do them exceptionally well — 
              web development and digital marketing.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── MAIN SERVICES ──────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <div className="space-y-10">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.1}>
                <div className={`rounded-2xl border p-8 md:p-12 ${service.accent}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.iconBg}`}>
                        <service.icon size={26} />
                      </div>
                      <h2 className="text-3xl font-heading font-bold text-navy mb-4">
                        {service.title}
                      </h2>
                      <p className="text-charcoal/70 leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <Link to="/contact" className="btn-primary">
                        Get a Quote <ArrowRight size={16} />
                      </Link>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider mb-4">
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {service.included.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-teal mt-0.5 flex-shrink-0" />
                            <span className="text-charcoal/80 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ADDITIONAL SERVICES ────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <p className="section-label">Also Available</p>
            <h2 className="section-title">Additional Services</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {extraServices.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
                    <s.icon size={22} />
                  </div>
                  <h3 className="font-heading font-bold text-navy mb-2">{s.title}</h3>
                  <p className="text-charcoal/65 text-sm leading-relaxed">{s.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="section-sm bg-teal">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Not sure which service you need?
            </h2>
            <p className="text-white/80 mb-8">
              We'll help you figure it out. Book a free 20-minute consultation.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-teal font-semibold px-8 py-3.5 rounded-lg hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5">
              Book a Free Call <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
