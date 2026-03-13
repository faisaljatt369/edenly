import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

const quotes = [
  { text: 'Your beauty, your rules.', sub: 'Connect with top-rated providers near you.' },
  { text: 'Grow your business with Edenly.', sub: 'Thousands of customers are looking for you.' },
  { text: 'Book in seconds, smile for hours.', sub: 'The marketplace for beauty & wellness.' },
];
const quote = quotes[Math.floor(Math.random() * quotes.length)];

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* ── Left Brand Panel ── */}
      <div style={{
        width: '42%',
        background: 'var(--gradient-brand)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}
        className="auth-brand-panel"
      >
        {/* Decorative circles */}
        <div style={{ position:'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ position:'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ position:'absolute', top: '45%', right: -40, width: 140, height: 140, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
          <Logo size={40} light showText />
        </Link>

        {/* Quote */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            color: '#fff', fontSize: 'var(--font-size-2xl)', fontWeight: 700,
            lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            "{quote.text}"
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--font-size-base)', lineHeight: 1.6 }}>
            {quote.sub}
          </p>
        </div>

        {/* Footer */}
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--font-size-xs)', position: 'relative', zIndex: 1 }}>
          © {new Date().getFullYear()} Edenly · All rights reserved
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: 'none', marginBottom: 'var(--space-8)' }}>
            <Logo size={36} />
          </div>

          {title && (
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h1 style={{
                fontSize: 'var(--font-size-2xl)', fontWeight: 700,
                color: 'var(--color-text-primary)', letterSpacing: '-0.02em',
                marginBottom: 8, lineHeight: 1.2,
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
          .auth-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
