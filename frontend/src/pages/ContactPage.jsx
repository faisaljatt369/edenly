import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import FormField from '../components/common/FormField';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const InfoCard = ({ icon, title, value, href }) => (
  <a href={href} style={{
    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
    padding: 'var(--space-5)', background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-lg)',
    textDecoration: 'none', transition: 'all var(--transition-base)',
    boxShadow: 'var(--shadow-sm)',
  }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{
      width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
      background: 'rgba(2,65,57,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
    }}>{icon}</div>
    <div>
      <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>{value}</p>
    </div>
  </a>
);

const ContactPage = () => {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [errors, setErrors] = useState({});
  const [sent,   setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
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
    // Simulate send — wire to backend in Phase 4
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <AppLayout>
      {/* ── Hero ── */}
      <div style={{
        textAlign: 'center', padding: 'var(--space-10) 0 var(--space-12)',
        maxWidth: 580, margin: '0 auto',
      }}>
        <p className="section-label" style={{ justifyContent: 'center' }}>Support</p>
        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
          Get in touch
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', lineHeight: 1.7 }}>
          Have a question, need help, or want to partner with us?
          We'd love to hear from you — our team usually replies within 24 hours.
        </p>
      </div>

      {/* ── Contact info cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--space-4)', marginBottom: 'var(--space-12)',
      }}
        className="contact-cards"
      >
        <InfoCard icon="✉️" title="Email us"       value="hello@edenly.de"         href="mailto:hello@edenly.de" />
        <InfoCard icon="📞" title="Call us"         value="+49 30 000 000 00"       href="tel:+4930000000" />
        <InfoCard icon="📍" title="Visit us"         value="Berlin, Germany"         href="https://maps.google.com" />
      </div>

      {/* ── Form + FAQ ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'start', marginBottom: 'var(--space-16)' }}
        className="contact-grid"
      >
        {/* Form */}
        <div className="card">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 'var(--space-2)' }}>
            Send us a message
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
            Fill out the form and we'll get back to you shortly.
          </p>

          {sent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
              <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>✅</div>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>Message sent!</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Thank you for reaching out. We'll respond to <strong>{form.email}</strong> within 24 hours.
              </p>
              <button className="btn btn-outline" style={{ marginTop: 'var(--space-5)' }} onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '', type: 'general' }); }}>
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {apiError && <Alert type="error" message={apiError} />}

              {/* Inquiry type */}
              <FormField label="Inquiry type">
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="general">General inquiry</option>
                  <option value="support">Technical support</option>
                  <option value="provider">Become a provider</option>
                  <option value="billing">Billing & payments</option>
                  <option value="partnership">Partnership</option>
                  <option value="press">Press & media</option>
                </select>
              </FormField>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
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

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 'var(--space-5)' }}>
            Frequently asked questions
          </h2>
          {[
            {
              q: 'How do I book a service?',
              a: "Search for providers, pick a service and time slot that works for you, and confirm your booking. You'll receive a confirmation by email.",
            },
            {
              q: 'How do I become a provider?',
              a: 'Register as a provider, complete your profile with your services and location, and our team will review and activate your listing.',
            },
            {
              q: 'What payment methods are accepted?',
              a: 'We accept all major credit/debit cards via Stripe. Providers may also accept deposits — all transactions are processed securely.',
            },
            {
              q: 'Is Edenly available outside Germany?',
              a: 'Currently Edenly is focused on the German market. We plan to expand to Austria and Switzerland soon.',
            },
            {
              q: 'How do I cancel a booking?',
              a: 'You can cancel a booking through your dashboard. Please check the provider\'s cancellation policy before booking.',
            },
            {
              q: 'How is my data protected?',
              a: 'We comply fully with GDPR. Your data is stored securely in Germany and is never shared with third parties without your consent.',
            },
          ].map(({ q, a }, i) => (
            <details key={i} style={{
              borderBottom: '1px solid var(--color-border-light)',
              paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)',
            }}>
              <summary style={{
                cursor: 'pointer', fontWeight: 600, fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-primary)', lineHeight: 1.5, listStyle: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                userSelect: 'none',
              }}>
                {q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{a}</p>
            </details>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-cards { grid-template-columns: 1fr !important; }
          .contact-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AppLayout>
  );
};

export default ContactPage;
