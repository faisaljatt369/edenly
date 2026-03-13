import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../common/Logo';
import SocialIcons from '../common/SocialIcons';

const NAV_LINKS = [
  { to: '/providers',    label: 'Find Providers' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing',      label: 'Pricing' },
  { to: '/contact',      label: 'Contact' },
];

/* ── Reusable icon components ──────────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const Pipe = () => (
  <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 13, lineHeight: 1, userSelect: 'none', margin: '0 2px' }}>|</span>
);

const TopBarLink = ({ href, icon, children }) => (
  <a href={href} style={{
    display: 'flex', alignItems: 'center', gap: 6,
    color: 'rgba(255,255,255,0.82)', textDecoration: 'none',
    fontSize: 12.5, fontWeight: 400, letterSpacing: '0.015em',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
  }}
    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.82)'}
  >
    <span style={{ color: 'rgba(255,255,255,0.5)', display: 'flex' }}>{icon}</span>
    {children}
  </a>
);

/* ── Top bar ───────────────────────────────────────────────────────────────── */
const TopBar = () => (
  <div style={{
    background: 'linear-gradient(135deg, #01352d 0%, #02503f 45%, #024a3a 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.15)',
  }}>
    <div style={{
      maxWidth: 1440, margin: '0 auto',
      padding: '0 var(--space-6)',
      height: 36,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>

      {/* Left: contact */}
      <div className="tb-contact" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <TopBarLink href="tel:+4930000000" icon={<PhoneIcon />}>+49 30 000 000 00</TopBarLink>
        <Pipe />
        <TopBarLink href="mailto:hello@edenly.de" icon={<MailIcon />}>hello@edenly.de</TopBarLink>
        <Pipe />
        <span className="tb-hours" style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap',
        }}>
          <ClockIcon /> Mon – Sat &nbsp;9:00 – 18:00
        </span>
      </div>

      {/* Right: social */}
      <div className="tb-social" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <SocialIcons size={16} gap={3} light />
      </div>
    </div>
  </div>
);

/* ── Navbar ─────────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [dropOpen,  setDropOpen]  = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = async () => {
    setDropOpen(false);
    await logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    fontSize: 'var(--font-size-sm)', fontWeight: 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    textDecoration: 'none', padding: '6px 2px',
    borderBottom: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
    transition: 'color var(--transition-fast)',
  });

  return (
    <>
      {/* ── Sticky wrapper: top bar + header move as one ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 201 }}>
        <TopBar />

        {/* ── Main header ── */}
        <header style={{
          background: 'var(--color-bg-card)',
          borderBottom: '1px solid var(--color-border-light)',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'var(--shadow-xs)',
          transition: 'box-shadow var(--transition-base)',
        }}>
          <nav style={{
            maxWidth: 1440, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 var(--space-6)', height: 64,
          }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Logo size={32} />
            </Link>

            {/* Desktop nav */}
            <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to} style={linkStyle}>{label}</NavLink>
              ))}
            </div>

            {/* Right side: auth */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexShrink: 0 }}>
              {isAuthenticated ? (
                <div ref={dropRef} style={{ position: 'relative' }}>
                  <button onClick={() => setDropOpen((p) => !p)} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--color-bg-muted)', border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)', padding: '5px 14px 5px 6px',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--gradient-brand)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '-0.03em',
                    }}>
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {user?.first_name}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points={dropOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
                    </svg>
                  </button>

                  {dropOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 210,
                      background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 300,
                    }}>
                      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-light)' }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{user?.email}</p>
                        <span className="badge badge-primary" style={{ marginTop: 6, textTransform: 'capitalize', fontSize: 10 }}>{user?.role}</span>
                      </div>
                      {[
                        { icon: '📊', label: 'Dashboard', to: '/dashboard' },
                        { icon: '👤', label: 'My Profile', to: '/profile' },
                        ...(user?.role === 'provider' ? [{ icon: '🏪', label: 'Business Setup', to: '/onboarding' }] : []),
                      ].map(({ icon, label, to }) => (
                        <Link key={to} to={to} onClick={() => setDropOpen(false)} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: 'var(--space-3) var(--space-4)',
                          fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', textDecoration: 'none',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        ><span>{icon}</span>{label}</Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--color-border-light)' }}>
                        <button onClick={handleLogout} style={{
                          width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10,
                          padding: 'var(--space-3) var(--space-4)',
                          fontSize: 'var(--font-size-sm)', color: 'var(--color-error)',
                          background: 'none', border: 'none', cursor: 'pointer',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(235,87,87,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        ><span>🚪</span> Sign out</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </>
              )}

              {/* Hamburger */}
              <button className="nav-hamburger" onClick={() => setMenuOpen((p) => !p)}
                style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  {menuOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                  }
                </svg>
              </button>
            </div>
          </nav>

          {/* ── Mobile menu ── */}
          {menuOpen && (
            <div style={{
              borderTop: '1px solid var(--color-border-light)',
              background: 'var(--color-bg-card)',
              padding: 'var(--space-4) var(--space-5) var(--space-5)',
            }}>
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  display: 'block', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)', fontWeight: 500,
                  color: 'var(--color-text-primary)', textDecoration: 'none', marginBottom: 2,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >{label}</Link>
              ))}
              {!isAuthenticated && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                  <Link to="/login"    className="btn btn-outline btn-sm btn-block">Sign in</Link>
                  <Link to="/register" className="btn btn-primary btn-sm btn-block">Get Started</Link>
                </div>
              )}
              {/* Contact + social in mobile menu */}
              <div style={{
                marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)',
                borderTop: '1px solid var(--color-border-light)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
              }}>
                <a href="tel:+4930000000" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                  <PhoneIcon /> +49 30 000 000 00
                </a>
                <a href="mailto:hello@edenly.de" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
                  <MailIcon /> hello@edenly.de
                </a>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <SocialIcons size={28} gap={4} />
                </div>
              </div>
            </div>
          )}
        </header>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .tb-hours { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-hamburger { display: flex !important; }
          .tb-social { display: none !important; }
        }
        @media (max-width: 480px) {
          .tb-contact { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
