import { Link } from 'react-router-dom';
import AppLayout from './AppLayout';

const LEGAL_LINKS = [
  { to: '/privacy',      label: 'Privacy Policy' },
  { to: '/terms',        label: 'Terms of Service' },
  { to: '/cancellation', label: 'Cancellation Policy' },
  { to: '/impressum',    label: 'Impressum' },
];

const LegalLayout = ({ title, subtitle, lastUpdated, children }) => (
  <AppLayout>
    {/* Hero */}
    <div style={{
      background: 'var(--gradient-brand)', borderRadius: 'var(--radius-2xl)',
      padding: 'var(--space-10) var(--space-10)', marginBottom: 'var(--space-8)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <p className="section-label" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-2)' }}>Legal</p>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 'var(--space-2)' }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-base)', maxWidth: 500 }}>{subtitle}</p>}
      {lastUpdated && (
        <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.45)' }}>
          Last updated: {lastUpdated}
        </p>
      )}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-8)', alignItems: 'start', marginBottom: 'var(--space-16)' }}
      className="legal-grid"
    >
      {/* Sidebar */}
      <div style={{ position: 'sticky', top: 88 }} className="legal-sidebar">
        <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
          Legal Pages
        </p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LEGAL_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)', textDecoration: 'none',
              color: window.location.pathname === to ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: window.location.pathname === to ? 600 : 400,
              background: window.location.pathname === to ? 'rgba(2,65,57,0.06)' : 'transparent',
              transition: 'all var(--transition-fast)',
              display: 'block',
            }}
              onMouseEnter={(e) => { if (window.location.pathname !== to) e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
              onMouseLeave={(e) => { if (window.location.pathname !== to) e.currentTarget.style.background = 'transparent'; }}
            >{label}</Link>
          ))}
        </nav>
        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'rgba(2,65,57,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
          <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            Questions about legal matters?
          </p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-3)' }}>
            Contact our legal team directly.
          </p>
          <a href="mailto:legal@edenly.de" className="btn btn-outline btn-sm" style={{ fontSize: 'var(--font-size-xs)' }}>
            legal@edenly.de
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="card legal-content">
        {children}
      </div>
    </div>

    <style>{`
      .legal-content h2 {
        font-size: var(--font-size-xl); font-weight: 700;
        color: var(--color-text-primary); letter-spacing: -0.01em;
        margin-top: var(--space-8); margin-bottom: var(--space-4);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--color-border-light);
      }
      .legal-content h3 {
        font-size: var(--font-size-base); font-weight: 600;
        color: var(--color-text-primary);
        margin-top: var(--space-5); margin-bottom: var(--space-2);
      }
      .legal-content p {
        font-size: var(--font-size-sm); color: var(--color-text-secondary);
        line-height: 1.8; margin-bottom: var(--space-4);
      }
      .legal-content ul, .legal-content ol {
        padding-left: var(--space-5); margin-bottom: var(--space-4);
      }
      .legal-content li {
        font-size: var(--font-size-sm); color: var(--color-text-secondary);
        line-height: 1.8; margin-bottom: var(--space-2);
      }
      .legal-content strong { color: var(--color-text-primary); }
      .legal-content a { color: var(--color-primary); }
      @media (max-width: 768px) {
        .legal-grid    { grid-template-columns: 1fr !important; }
        .legal-sidebar { display: none !important; }
      }
    `}</style>
  </AppLayout>
);

export default LegalLayout;
