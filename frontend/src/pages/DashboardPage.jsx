import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  return (
    <AppLayout>
      <div style={{ maxWidth: 700 }}>
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <p className="section-label">Welcome back</p>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--space-2)' }}>
            Hello, {user?.first_name} 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            You're signed in as <strong style={{ color: 'var(--color-text-primary)' }}>{user?.email}</strong> ·{' '}
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { icon: '📅', title: 'Bookings', desc: 'Coming in Phase 3', badge: 'Phase 3' },
            { icon: '💬', title: 'Messages', desc: 'Coming in Phase 4', badge: 'Phase 4' },
            { icon: '⭐', title: 'Reviews',  desc: 'Coming in Phase 3', badge: 'Phase 3' },
            { icon: '⚙️', title: 'Settings', desc: 'Profile management', badge: 'Phase 2' },
          ].map((item) => (
            <div key={item.title} className="card card-sm" style={{ cursor: 'default' }}>
              <div style={{ fontSize: 28, marginBottom: 'var(--space-3)' }}>{item.icon}</div>
              <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 4 }}>{item.title}</p>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{item.desc}</p>
              <span className="badge badge-secondary" style={{ marginTop: 'var(--space-3)', fontSize: '0.7rem' }}>{item.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
