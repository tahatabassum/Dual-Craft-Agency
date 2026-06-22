import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { contactApi } from '../lib/api';

const contactDetails = [
  { icon: Mail, label: 'Email', value: 'dualcraft.agency@gmail.com', href: 'mailto:dualcraft.agency@gmail.com' },
  { icon: Phone, label: 'Phone / WhatsApp', value: '+92 321 662 3367', href: 'tel:+923216623367' },
  { icon: Clock, label: 'Business Hours', value: '24/7 Open', href: null },
  { icon: MapPin, label: 'Location', value: 'Pakistan', href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await contactApi.submit(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or WhatsApp us directly.');
    }
  };

  return (
    <main className="pt-20">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom text-center">
          <AnimatedSection>
            <p className="section-label text-teal">Let's Talk</p>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Tell us about your project and we'll get back to you within 24 hours. 
              No commitment, no pressure.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FORM + DETAILS ─────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatedSection from="left">
                <div className="card p-8 md:p-10">
                  <h2 className="text-2xl font-heading font-bold text-navy mb-7">
                    Send Us a Message
                  </h2>

                  {status === 'success' ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-5">
                        <CheckCircle2 size={32} className="text-teal" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-navy mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-charcoal/60">
                        We'll get back to you within 24 hours. 
                        You can also WhatsApp us for a faster response.
                      </p>
                      <button
                        onClick={() => setStatus('idle')}
                        className="mt-6 text-teal text-sm font-medium hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label htmlFor="contact-name" className="form-label">
                            Your Name <span className="text-teal">*</span>
                          </label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Smith"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="form-label">
                            Email Address <span className="text-teal">*</span>
                          </label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="form-input"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="form-label">
                            Phone Number
                          </label>
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+92 300 1234567"
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="form-label">
                          Message <span className="text-teal">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={6}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us about your project, goals, and budget..."
                          className="form-textarea"
                        />
                      </div>

                      {errorMsg && (
                        <p className="text-red-500 text-sm">{errorMsg}</p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="btn-primary w-full justify-center"
                        id="contact-submit"
                      >
                        {status === 'sending' ? (
                          <>
                            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Contact details */}
            <div className="space-y-4">
              <AnimatedSection from="right">
                <div className="card p-6">
                  <h3 className="font-heading font-bold text-navy mb-5">Contact Details</h3>
                  <div className="space-y-4">
                    {contactDetails.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal/10 text-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                          <item.icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-0.5">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-charcoal/80 text-sm hover:text-teal transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-charcoal/80 text-sm">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection from="right" delay={0.1}>
                <a
                  href="https://wa.me/923216623367?text=Hi!%20I'd%20like%20to%20enquire%20about%20your%20services%20at%20Dual%20Craft."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 card p-5 hover:shadow-card-hover transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-navy font-semibold text-sm">Chat on WhatsApp</p>
                    <p className="text-charcoal/50 text-xs">Get a faster response</p>
                  </div>
                </a>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
