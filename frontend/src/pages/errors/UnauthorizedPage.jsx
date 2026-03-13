import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import { useAuth } from '../../hooks/useAuth';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg-app)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-8)', textAlign: 'center', fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(235,87,87,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 'var(--space-10)', textDecoration: 'none' }}>
          <Logo size={40} />
        </Link>

        <div style={{
          width: 96, height: 96, margin: '0 auto var(--space-6)',
          background: 'rgba(235,87,87,0.1)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48,
        }}>
          🔒
        </div>

        <div style={{
          display: 'inline-block', marginBottom: 'var(--space-3)',
        }}>
          <span className="badge badge-error">403 Unauthorized</span>
        </div>

        <h1 style={{
          fontSize: 'var(--font-size-2xl)', fontWeight: 700,
          color: 'var(--color-text-primary)', letterSpacing: '-0.02em',
          marginBottom: 'var(--space-3)',
        }}>
          Access denied
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)',
          lineHeight: 1.7, marginBottom: 'var(--space-8)',
        }}>
          You don't have permission to view this page.
          If you think this is a mistake, please contact support.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>← Go back</button>
          {isAuthenticated
            ? <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
            : <Link to="/login"     className="btn btn-primary">Sign in</Link>
          }
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
