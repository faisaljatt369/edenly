import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
const CustomerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const ProviderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const HelpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ── FAQ data ────────────────────────────────────────────────────────────────── */
const CUSTOMER_FAQS = [
  {
    q: 'How do I book a service on Edenly?',
    a: 'You can search for beauty professionals by service and location. Edenly also helps you discover providers who specialize in the service you are looking for. Once you choose a provider, select your service, pick an available time slot and confirm your booking.',
  },
  {
    q: 'Do I need an account to book an appointment?',
    a: 'Yes. Creating an account allows you to manage bookings, reschedule appointments and view your booking history.',
  },
  {
    q: 'Can I cancel or reschedule my appointment?',
    a: "Yes. Appointments can be cancelled or rescheduled according to the provider's cancellation policy (for example 24 or 72 hours before the appointment).",
  },
  {
    q: 'What happens if I arrive late to my appointment?',
    a: "Each provider can define their own waiting time for late clients. If you arrive later than the allowed waiting time, the provider may cancel the appointment.",
  },
  {
    q: 'What happens if I miss my appointment?',
    a: 'If you do not show up for your appointment, the provider may mark the booking as a no-show. Repeated no-shows may affect your ability to book with some providers.',
  },
  {
    q: 'How do payments work?',
    a: 'Depending on the provider, payments may be made online through the platform or directly to the provider at the appointment.',
  },
  {
    q: 'Can I leave a review?',
    a: 'Yes. After your appointment you can leave a review to share your experience with other customers.',
  },
  {
    q: 'Who is responsible for the service?',
    a: 'All services are provided independently by the beauty professionals listed on Edenly. Edenly acts only as a booking platform connecting clients with providers.',
  },
  {
    q: 'What if I have a problem with a booking?',
    a: 'You can contact the provider directly first. If you need additional assistance you can contact Edenly support.',
  },
];

const PROVIDER_FAQS = [
  {
    q: 'How do I become a provider on Edenly?',
    a: 'You can register as a provider by creating an account and setting up your profile, services, pricing and availability.',
  },
  {
    q: 'What services can I offer on Edenly?',
    a: 'Edenly allows beauty professionals to offer services such as braids, locs, natural hair styling, lashes, nails, brows, makeup, hair extensions, hair treatments, tooth gems and similar beauty services.',
  },
  {
    q: 'Can I set my own prices?',
    a: 'Yes. Providers are fully responsible for setting their own service prices.',
  },
  {
    q: 'Can I define my working hours?',
    a: 'Yes. You can set your availability and working hours in your provider dashboard.',
  },
  {
    q: 'Can I define how long I wait for late clients?',
    a: 'Yes. Providers can set a waiting time for late arrivals. If the client does not arrive within that time, the appointment may be cancelled.',
  },
  {
    q: 'Can clients cancel their appointments?',
    a: 'Yes. Clients can cancel bookings based on the cancellation policy you define.',
  },
  {
    q: 'Can providers cancel appointments?',
    a: 'Yes. Providers may cancel appointments in exceptional situations such as illness or emergencies. The client will be notified if this happens.',
  },
  {
    q: 'Can I upload photos of my work?',
    a: 'Yes. Providers can upload portfolio photos so clients can see examples of their work.',
  },
  {
    q: 'Do I need to run a registered business?',
    a: 'Providers are responsible for ensuring they comply with local regulations, including business registration and tax obligations where required.',
  },
];

/* ── Accordion item ──────────────────────────────────────────────────────────── */
const FAQItem = ({ q, a, open, onToggle, accent }) => (
  <div style={{
    borderRadius: 'var(--radius-lg)',
    border: `1px solid ${open ? (accent === 'provider' ? 'rgba(73,169,108,0.3)' : 'rgba(2,65,57,0.2)') : 'var(--color-border-light)'}`,
    background: open ? (accent === 'provider' ? 'rgba(73,169,108,0.03)' : 'rgba(2,65,57,0.02)') : 'var(--color-bg-card)',
    overflow: 'hidden',
    transition: 'all var(--transition-fast)',
  }}>
    <button
      type="button" onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: 16, padding: '18px 20px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.55, paddingTop: 1 }}>{q}</span>
      <span style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: open
          ? (accent === 'provider' ? 'var(--color-secondary)' : 'var(--color-primary)')
          : 'var(--color-bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all var(--transition-fast)',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={open ? '#fff' : 'var(--color-text-muted)'} strokeWidth="2.5" strokeLinecap="round">
          <polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
        </svg>
      </span>
    </button>
    {open && (
      <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(2,65,57,0.07)' }}>
        <p style={{ paddingTop: 14, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{a}</p>
      </div>
    )}
  </div>
);

/* ── Page ────────────────────────────────────────────────────────────────────── */
const FAQPage = () => {
  const [tab, setTab]             = useState('customer');
  const [openCustomer, setOpenCustomer] = useState(0);
  const [openProvider, setOpenProvider] = useState(0);

  const isCustomer = tab === 'customer';
  const faqs       = isCustomer ? CUSTOMER_FAQS : PROVIDER_FAQS;
  const openIdx    = isCustomer ? openCustomer  : openProvider;
  const setOpen    = isCustomer ? setOpenCustomer : setOpenProvider;

  return (
    <AppLayout>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: 'var(--space-12) 0 var(--space-10)', maxWidth: 640, margin: '0 auto' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--color-primary)', background: 'rgba(2,65,57,0.07)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 18,
        }}>
          <HelpIcon /> FAQ
        </span>
        <h1 style={{
          fontSize: 'var(--font-size-4xl)', fontWeight: 800, letterSpacing: '-0.03em',
          marginBottom: 16, color: 'var(--color-text-primary)', lineHeight: 1.1,
        }}>
          Frequently asked questions
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', lineHeight: 1.7 }}>
          Find answers to the most common questions from customers and providers.
        </p>
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex',
          background: 'var(--color-bg-muted)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-full)',
          padding: 4,
          gap: 4,
        }}>
          {[
            { key: 'customer', label: 'For Customers', icon: <CustomerIcon /> },
            { key: 'provider', label: 'For Providers', icon: <ProviderIcon /> },
          ].map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none', cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)', fontWeight: 600,
                  background: active ? 'var(--color-bg-card)' : 'transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  boxShadow: active ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span style={{ display: 'flex', color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section header ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '20px 24px',
          borderRadius: 'var(--radius-xl)',
          background: isCustomer
            ? 'linear-gradient(135deg, rgba(2,65,57,0.06) 0%, rgba(73,169,108,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(73,169,108,0.08) 0%, rgba(2,65,57,0.06) 100%)',
          border: `1px solid ${isCustomer ? 'rgba(2,65,57,0.1)' : 'rgba(73,169,108,0.2)'}`,
          marginBottom: 24,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: isCustomer ? 'var(--color-primary)' : 'var(--color-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}>
            {isCustomer ? <CustomerIcon /> : <ProviderIcon />}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
              {isCustomer ? 'FAQ for Customers' : 'FAQ for Providers'}
            </p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              {isCustomer
                ? `${CUSTOMER_FAQS.length} questions about booking, payments and appointments`
                : `${PROVIDER_FAQS.length} questions about listing, availability and business`}
            </p>
          </div>
        </div>

        {/* ── Accordion ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map(({ q, a }, i) => (
            <FAQItem
              key={i} q={q} a={a}
              accent={isCustomer ? 'customer' : 'provider'}
              open={openIdx === i}
              onToggle={() => setOpen(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* ── Still have questions CTA ── */}
      <div style={{
        maxWidth: 720, margin: '0 auto 80px',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #035c4e 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
      }}
        className="faq-cta"
      >
        <div>
          <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 'var(--font-size-lg)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Still have questions?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
            Our support team usually replies within 24 hours.
          </p>
        </div>
        <Link to="/contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#fff', color: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)', padding: '11px 24px',
          fontSize: 'var(--font-size-sm)', fontWeight: 700, textDecoration: 'none',
          flexShrink: 0,
          transition: 'opacity var(--transition-fast)',
        }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Contact support →
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .faq-cta { flex-direction: column !important; text-align: center; align-items: stretch !important; }
          .faq-cta a { justify-content: center; }
        }
      `}</style>
    </AppLayout>
  );
};

export default FAQPage;
