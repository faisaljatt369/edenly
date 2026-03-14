import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const AuthLayout = ({ title, subtitle, children }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    fontFamily: 'var(--font-sans)',
    background: 'var(--color-bg-app)',
  }}>
    {/* ── Left brand panel ────────────────────────────────────────── */}
    <div style={{
      display: 'none',
      width: '42%',
      flexShrink: 0,
      background: 'var(--gradient-brand)',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      padding: '48px 52px',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }} className="auth-left-panel">
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -80, right: -80,
        width: 320, height: 320, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 240, height: 240, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 140, right: -40,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
      }} />

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', zIndex: 1 }}>
        <Logo size={38} light />
      </Link>

      {/* Center copy */}
      <div style={{ zIndex: 1 }}>
        <p style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)',
          marginBottom: 16,
        }}>
          Beauty & Wellness Marketplace
        </p>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
          fontWeight: 700, color: '#fff',
          lineHeight: 1.25, letterSpacing: '-0.02em',
          marginBottom: 20,
        }}>
          Your beauty journey<br />starts here.
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 320 }}>
          Book top beauty and wellness professionals near you, or grow your own business on Edenly.
        </p>
      </div>

      {/* Bottom trust pill */}
      <div style={{
        display: 'flex', gap: 24, zIndex: 1,
        flexWrap: 'wrap',
      }}>
        {['Trusted providers', 'Secure booking', 'GDPR compliant'].map((tag) => (
          <div key={tag} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500,
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="rgba(255,255,255,0.85)"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {tag}
          </div>
        ))}
      </div>
    </div>

    {/* ── Right form panel ─────────────────────────────────────────── */}
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      overflowY: 'auto',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 460,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Mobile logo */}
        <div className="auth-mobile-logo" style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 28,
        }}>
          <Link to="/">
            <Logo size={36} />
          </Link>
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            {title && (
              <h1 style={{
                fontSize: 'var(--font-size-2xl)', fontWeight: 700,
                color: 'var(--color-text-primary)', letterSpacing: '-0.02em',
                marginBottom: 6,
              }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>

    {/* Responsive: show left panel on wide screens */}
    <style>{`
      @media (min-width: 700px) {
        .auth-left-panel { display: flex !important; }
        .auth-mobile-logo { display: none !important; }
      }
    `}</style>
  </div>
);

export default AuthLayout;
