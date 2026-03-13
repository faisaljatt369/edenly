import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 var(--space-8)',
      height: 64,
      background: 'var(--color-bg-card)',
      borderBottom: '1px solid var(--color-border-light)',
      boxShadow: 'var(--shadow-xs)',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo size={30} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {user?.first_name}
            </span>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
