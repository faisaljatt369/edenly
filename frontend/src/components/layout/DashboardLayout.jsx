import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/* ─────────────────────────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  home:      () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
  calendar:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  bookings:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  clients:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  services:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  messages:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  reports:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  discover:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  settings:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  bell:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  menu:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevron:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Provider nav items
───────────────────────────────────────────────────────────────────────────── */
export const PROVIDER_NAV = [
  { id: 'home',     label: 'Home',      path: '/dashboard',          icon: 'home'     },
  { id: 'calendar', label: 'Calendar',  path: '/dashboard/calendar', icon: 'calendar' },
  { id: 'bookings', label: 'Bookings',  path: '/dashboard/bookings', icon: 'bookings' },
  { id: 'clients',  label: 'Clients',   path: '/dashboard/clients',  icon: 'clients'  },
  { id: 'services', label: 'Services',  path: '/dashboard/services', icon: 'services' },
  { id: 'messages', label: 'Messages',  path: '/dashboard/messages', icon: 'messages' },
  { id: 'reports',  label: 'Reports',   path: '/dashboard/reports',  icon: 'reports'  },
];

export const CUSTOMER_NAV = [
  { id: 'home',     label: 'Home',        path: '/dashboard',           icon: 'home'     },
  { id: 'bookings', label: 'My Bookings', path: '/dashboard/bookings',  icon: 'bookings' },
  { id: 'discover', label: 'Discover',    path: '/dashboard/discover',  icon: 'discover' },
  { id: 'messages', label: 'Messages',    path: '/dashboard/messages',  icon: 'messages' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Avatar
───────────────────────────────────────────────────────────────────────────── */
const Avatar = ({ name = '', size = 34 }) => {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(255,255,255,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff',
      letterSpacing: '0.02em',
    }}>
      {initials}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Sidebar nav item
───────────────────────────────────────────────────────────────────────────── */
const NavItem = ({ item, active, onClick }) => {
  const IconComp = Icons[item.icon];
  return (
    <Link
      to={item.path}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '10px 16px 10px 20px',
        borderRadius: 10,
        margin: '1px 8px',
        textDecoration: 'none',
        color: active ? '#fff' : 'rgba(255,255,255,0.62)',
        background: active ? 'rgba(255,255,255,0.13)' : 'transparent',
        fontWeight: active ? 600 : 400,
        fontSize: 13.5,
        transition: 'all 0.15s ease',
        position: 'relative',
        borderLeft: active ? '3px solid #49A96C' : '3px solid transparent',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {IconComp && <span style={{ display: 'flex', flexShrink: 0 }}><IconComp /></span>}
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge > 0 && (
        <span style={{
          background: '#49A96C', color: '#fff',
          fontSize: 10, fontWeight: 700, minWidth: 18, height: 18,
          borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 5px',
        }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   DashboardLayout
───────────────────────────────────────────────────────────────────────────── */
export default function DashboardLayout({ navItems = [], pageTitle, pageTitleMap = {}, children, topBarActions }) {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const resolvedTitle = pageTitle || pageTitleMap[location.pathname] || 'Dashboard';
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Logo */}
      <div style={{ padding: '20px 24px 18px', flexShrink: 0 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="rgba(255,255,255,0.12)"/>
            <path d="M20 8C13.37 8 8 13.37 8 20s5.37 12 12 12 12-5.37 12-12S26.63 8 20 8zm0 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z" fill="rgba(255,255,255,0.3)"/>
            <path d="M20 12v16M13 16l7-4 7 4M13 24l7 4 7-4" stroke="#49A96C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', fontFamily: 'var(--font-sans)' }}>
            edenly
          </span>
        </Link>
      </div>

      {/* Business/user name chip */}
      <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: 10,
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar name={`${user?.first_name || ''} ${user?.last_name || ''}`} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.first_name} {user?.last_name}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.2, textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav divider label */}
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', padding: '0 28px 8px' }}>
        Menu
      </p>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={isActive(item.path)}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, paddingBottom: 12 }}>
        <NavItem
          item={{ id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: 'settings' }}
          active={isActive('/dashboard/settings')}
          onClick={() => setMobileOpen(false)}
        />
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 16px 10px 20px', margin: '1px 8px',
            width: 'calc(100% - 16px)',
            background: 'none', border: 'none', cursor: 'pointer',
            borderRadius: 10, borderLeft: '3px solid transparent',
            color: 'rgba(255,255,255,0.5)', fontSize: 13.5,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(235,87,87,0.12)'; e.currentTarget.style.color = '#ff6b6b'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          <span style={{ display: 'flex', flexShrink: 0 }}><Icons.logout /></span>
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-app)', fontFamily: 'var(--font-sans)' }}>

      {/* ── Desktop sidebar ── */}
      <div className="db-sidebar" style={{
        width: 220, flexShrink: 0,
        background: 'var(--color-primary)',
        position: 'sticky', top: 0, height: '100vh',
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {sidebarContent}
      </div>

      {/* ── Mobile overlay sidebar ── */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              width: 240, height: '100%', background: 'var(--color-primary)',
              position: 'relative', zIndex: 201, overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
                color: '#fff', cursor: 'pointer', padding: 6, display: 'flex',
              }}
            >
              <Icons.close />
            </button>
            {sidebarContent}
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.45)' }} />
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid var(--color-border-light)',
          display: 'flex', alignItems: 'center',
          padding: '0 28px 0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 3px rgba(2,65,57,0.06)',
          flexShrink: 0,
        }}>
          {/* Mobile menu button */}
          <button className="db-menu-btn" onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-secondary)', display: 'none', padding: 4,
          }}>
            <Icons.menu />
          </button>

          {/* Page title */}
          <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', flex: 1 }}>
            {resolvedTitle}
          </h1>

          {/* Top-bar actions slot */}
          {topBarActions}

          {/* Notifications */}
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)', padding: 6, borderRadius: 8,
            display: 'flex', position: 'relative',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}>
            <Icons.bell />
          </button>

          {/* User avatar (top-right) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '5px 8px', borderRadius: 10, transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              {`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || '?'}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {user?.first_name}
            </span>
            <Icons.chevron />
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .db-sidebar { display: none !important; }
          .db-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
