import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code2, TrendingUp, Users, CheckCircle2, ExternalLink } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    description: 'React & TypeScript sites, landing pages, and full-stack web applications built to perform.',
    color: 'bg-navy/10 text-navy',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'SEO, social media growth, and lead generation strategies that bring real, measurable results.',
    color: 'bg-teal/10 text-teal',
  },
  {
    icon: Users,
    title: 'Brand Strategy',
    description: 'Cohesive brand identity and online presence that builds trust with your audience.',
    color: 'bg-purple-100 text-purple-600',
  },
];

const whyUs = [
  'Combined expertise in development AND marketing — rare in one team',
  'We speak plain business language, not just tech jargon',
  'Transparent pricing with no hidden fees',
  'Fast turnaround without compromising quality',
  'Ongoing support after project launch',
  'Local business specialists — we understand your market',
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
      .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
  }, []);

  return (
    <main>
      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center bg-navy relative overflow-hidden pt-20"
      >
        {/* Geometric background accents */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-teal/5" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-teal/3" />
          <div className="absolute top-1/2 right-[-5%] w-72 h-72 rounded-full bg-white/2" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00C2B8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container-custom relative z-10 py-24">
          <div className="max-w-4xl">
            {/* Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-teal text-sm font-semibold tracking-wide">
                Web Dev + Digital Marketing Agency
              </span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.05] mb-6"
              style={{ opacity: 0 }}
            >
              We Build.{' '}
              <span className="text-teal">We Market.</span>{' '}
              You Grow.
            </h1>

            {/* Subheading */}
            <p
              ref={subRef}
              className="text-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
              style={{ opacity: 0 }}
            >
              Dual Craft is a two-partner agency combining technical web development 
              and digital marketing expertise to deliver results that actually matter 
              for your business.
            </p>

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row gap-4"
              style={{ opacity: 0 }}
            >
              <Link to="/contact" className="btn-primary text-base py-3.5 px-8">
                Get a Free Quote
                <ArrowRight size={18} />
              </Link>
              <Link to="/projects" className="btn-outline-teal text-base py-3.5 px-8">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES OVERVIEW ─────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-14">
            <p className="section-label">What We Do</p>
            <h2 className="section-title mb-4">Services That Drive Results</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              From beautiful, fast websites to strategic marketing campaigns — 
              we cover the full digital spectrum.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={i * 0.12}>
                <div className="card p-8 h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${service.color}`}>
                    <service.icon size={22} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-navy mb-3">
                    {service.title}
                  </h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Link
                    to="/services"
                    className="text-teal font-semibold text-sm inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY DUAL CRAFT ────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection from="left">
              <p className="section-label">Why Choose Us</p>
              <h2 className="section-title mb-6">
                Two Experts,{' '}
                <span className="text-teal">One Agency</span>
              </h2>
              <p className="text-charcoal/70 leading-relaxed mb-8">
                Most agencies specialize in either development or marketing. Dual Craft 
                brings both under one roof — a developer who understands SEO, and a 
                marketer who understands tech. This combination means your website is 
                built to rank and your campaigns are built to convert.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {whyUs.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-teal mt-0.5 flex-shrink-0" />
                    <span className="text-charcoal/80 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/about" className="btn-primary mt-8 inline-flex">
                Meet the Team <ArrowRight size={16} />
              </Link>
            </AnimatedSection>

            {/* Visual card */}
            <AnimatedSection from="right" className="hidden lg:block">
              <div className="relative">
                {/* Main card */}
                <div className="bg-navy rounded-2xl p-8 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center font-bold text-navy text-sm">
                      TT
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Taha Tabassum</p>
                      <p className="text-white/50 text-xs">Web Dev & AI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/20 border border-teal/30 flex items-center justify-center font-bold text-teal text-sm">
                      MS
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Mohsin Saeed</p>
                      <p className="text-white/50 text-xs">SEO & Marketing</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-white/60 text-sm">
                      "We combine technical excellence with marketing intelligence — 
                      because great websites deserve to be found."
                    </p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-5 -right-5 bg-teal text-white rounded-xl px-5 py-3 shadow-teal">
                  <p className="text-xs font-medium opacity-80">Projects Delivered</p>
                  <p className="text-2xl font-bold">10+</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-14">
            <p className="section-label">Our Work</p>
            <h2 className="section-title mb-4">Featured Projects</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              A sample of what we've built — from SaaS platforms to client websites.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <AnimatedSection key={project.slug} delay={i * 0.1}>
                <ProjectCard project={project} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link to="/projects" className="btn-secondary">
              View All Projects <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CONTACT CTA ───────────────────────────────────────────── */}
      <section className="section bg-navy relative overflow-hidden">
        {/* Subtle geometric accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[20%] w-48 h-48 rounded-full bg-teal/5" />
          <div className="absolute bottom-0 left-[10%] w-64 h-64 rounded-full bg-teal/5" />
        </div>

        <div className="container-custom relative z-10 text-center">
          <AnimatedSection>
            <p className="section-label text-teal">Ready to Start?</p>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
              Let's Build Something Great Together
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              Whether you need a website, a marketing strategy, or both — 
              we're ready to help your business grow online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-primary text-base py-3.5 px-8">
                Get a Free Quote <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/923216623367?text=Hi!%20I'd%20like%20to%20enquire%20about%20your%20services%20at%20Dual%20Craft."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-teal text-base py-3.5 px-8"
              >
                <ExternalLink size={16} />
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
