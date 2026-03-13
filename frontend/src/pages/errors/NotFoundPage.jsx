import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg-app)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-8)', textAlign: 'center', fontFamily: 'var(--font-sans)',
    }}>
      {/* Decorative bg */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(73,169,108,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 'var(--space-10)', textDecoration: 'none' }}>
          <Logo size={40} />
        </Link>

        {/* 404 */}
        <div style={{
          fontSize: '7rem', fontWeight: 800, lineHeight: 1,
          background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '-0.04em', marginBottom: 'var(--space-4)',
          userSelect: 'none',
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 'var(--font-size-2xl)', fontWeight: 700,
          color: 'var(--color-text-primary)', letterSpacing: '-0.02em',
          marginBottom: 'var(--space-3)',
        }}>
          Page not found
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)',
          lineHeight: 1.7, marginBottom: 'var(--space-8)',
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            ← Go back
          </button>
          <Link to="/" className="btn btn-primary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
