import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import FormField from '../components/common/FormField';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

/* ── Contact channel cards ──────────────────────────────────────────────────── */
const ChannelCard = ({ icon, label, value, sub, href }) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
    style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      padding: '24px 20px',
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border-light)',
      borderRadius: 'var(--radius-xl)',
      textDecoration: 'none',
      transition: 'all var(--transition-base)',
      boxShadow: 'var(--shadow-sm)',
      flex: 1,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,65,57,0.12)';
      e.currentTarget.style.borderColor = 'rgba(2,65,57,0.25)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      e.currentTarget.style.borderColor = 'var(--color-border-light)';
      e.currentTarget.style.transform = 'none';
    }}
  >
    <div style={{
      width: 46, height: 46, borderRadius: 14,
      background: 'linear-gradient(135deg, rgba(2,65,57,0.1) 0%, rgba(73,169,108,0.12) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-primary)',
    }}>{icon}</div>
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', marginBottom: 2 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{sub}</p>}
    </div>
  </a>
);

/* ── Page ───────────────────────────────────────────────────────────────────── */
const ContactPage = () => {
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [errors, setErrors]     = useState({});
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.email.trim())   e.email   = 'Email is required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <AppLayout>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: 'var(--space-12) 0 var(--space-10)', maxWidth: 600, margin: '0 auto' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--color-primary)', background: 'rgba(2,65,57,0.07)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 18,
        }}>
          <MessageIcon /> Support
        </span>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
          We're here to help
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', lineHeight: 1.7 }}>
          Have a question or need support? Reach out — our team usually replies within 24 hours.
        </p>
      </div>

      {/* ── Channel cards ── */}
      <div className="contact-channels" style={{ display: 'flex', gap: 16, marginBottom: 56 }}>
        <ChannelCard icon={<MailIcon />}   label="Email" value="hello@edenly.de"    sub="Usually replies within 24h"  href="mailto:hello@edenly.de" />
        <ChannelCard icon={<PhoneIcon />}  label="Phone" value="+49 30 000 000 00" sub="Mon – Sat, 9:00 – 18:00"      href="tel:+4930000000" />
        <ChannelCard icon={<MapPinIcon />} label="Office" value="Berlin, Germany"   sub="By appointment only"          href="https://maps.google.com" />
      </div>

      {/* ── Form + FAQ ── */}
      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start', marginBottom: 80 }}>

        {/* ── Left: form ── */}
        <div style={{
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          {/* Form header */}
          <div style={{ padding: '28px 28px 0' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Send us a message
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 24 }}>
              Fill out the form and we'll get back to you shortly.
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 28px 48px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                background: 'linear-gradient(135deg, rgba(2,65,57,0.1), rgba(73,169,108,0.15))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-primary)',
              }}><CheckCircleIcon /></div>
              <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 8 }}>Message sent!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                Thank you for reaching out. We'll respond to <strong>{form.email}</strong> within 24 hours.
              </p>
              <button className="btn btn-outline" style={{ marginTop: 24 }}
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '', type: 'general' }); }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ padding: '0 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {apiError && <Alert type="error" message={apiError} />}

              {/* Type pills */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Topic</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { value: 'general', label: 'General' },
                    { value: 'support', label: 'Support' },
                    { value: 'provider', label: 'Become a Provider' },
                    { value: 'billing', label: 'Billing' },
                    { value: 'partnership', label: 'Partnership' },
                    { value: 'press', label: 'Press' },
                  ].map(({ value, label }) => (
                    <button key={value} type="button"
                      onClick={() => setForm((p) => ({ ...p, type: value }))}
                      style={{
                        padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        border: `1.5px solid ${form.type === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: form.type === value ? 'var(--color-primary)' : 'transparent',
                        color: form.type === value ? '#fff' : 'var(--color-text-secondary)',
                        transition: 'all var(--transition-fast)',
                      }}
                    >{label}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <FormField label="Full name" error={errors.name} required style={{ flex: 1 }}>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith"
                    style={errors.name ? { borderColor: 'var(--color-error)' } : {}} />
                </FormField>
                <FormField label="Email" error={errors.email} required style={{ flex: 1 }}>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                    style={errors.email ? { borderColor: 'var(--color-error)' } : {}} />
                </FormField>
              </div>

              <FormField label="Subject" error={errors.subject} required>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?"
                  style={errors.subject ? { borderColor: 'var(--color-error)' } : {}} />
              </FormField>

              <FormField label="Message" error={errors.message} required>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell us more about your inquiry…" rows={5}
                  style={errors.message ? { borderColor: 'var(--color-error)' } : {}} />
              </FormField>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Send message →'}
              </button>
            </form>
          )}
        </div>

        {/* ── Right: FAQ link panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
              Frequently asked questions
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              We've put together answers for both customers and providers.
            </p>
          </div>

          {[
            {
              to: '/faq',
              state: 'customer',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              ),
              label: 'FAQ for Customers',
              desc: 'Booking, payments, cancellations & more',
              count: 9,
            },
            {
              to: '/faq',
              state: 'provider',
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              ),
              label: 'FAQ for Providers',
              desc: 'Listings, availability, policies & more',
              count: 9,
            },
          ].map(({ to, icon, label, desc, count }) => (
            <Link key={label} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 22px',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(2,65,57,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(2,65,57,0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--color-border-light)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(2,65,57,0.1) 0%, rgba(73,169,108,0.12) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)',
                }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: 'var(--color-primary)',
                    background: 'rgba(2,65,57,0.08)', borderRadius: 20, padding: '2px 10px',
                  }}>{count} questions</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}

          {/* Quick contact nudge */}
          <div style={{
            padding: '18px 22px',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(2,65,57,0.04)',
            border: '1px solid rgba(2,65,57,0.1)',
          }}>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
              Can't find your answer?{' '}
              <a href="mailto:hello@edenly.de" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Email us directly
              </a>
              {' '}and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #035c4e 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, marginBottom: 64,
        flexWrap: 'wrap',
      }}
        className="contact-cta"
      >
        <div>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'var(--font-size-xl)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Ready to grow your business?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
            Join hundreds of beauty &amp; wellness providers already on Edenly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <a href="/register" className="btn btn-sm" style={{
            background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
            color: '#fff', borderRadius: 'var(--radius-md)', padding: '10px 20px',
            fontSize: 'var(--font-size-sm)', fontWeight: 600, textDecoration: 'none',
          }}>
            Learn more
          </a>
          <a href="/register" className="btn btn-sm" style={{
            background: '#fff', border: 'none',
            color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '10px 20px',
            fontSize: 'var(--font-size-sm)', fontWeight: 700, textDecoration: 'none',
          }}>
            Get started free →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-channels { flex-direction: column !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-cta { flex-direction: column !important; text-align: center; }
          .contact-cta > div:last-child { justify-content: center; }
        }
      `}</style>
    </AppLayout>
  );
};

export default ContactPage;
