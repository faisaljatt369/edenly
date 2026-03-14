import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/* ─────────────────────────────────────────────────────────────────────────────
   Icons  (20px, strokeWidth 1.7)
───────────────────────────────────────────────────────────────────────────── */
const Icons = {
  home:     () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  calendar: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  bookings: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>,
  clients:  () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  services: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
  messages: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  reports:  () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  discover: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  settings: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  logout:   () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  bell:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  menu:     () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>,
  close:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevronD: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  chevronR: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Nav config
───────────────────────────────────────────────────────────────────────────── */
export const PROVIDER_NAV = [
  {
    section: 'Workspace',
    items: [
      { id: 'home',     label: 'Home',      path: '/dashboard',          icon: 'home'     },
      { id: 'calendar', label: 'Calendar',  path: '/dashboard/calendar', icon: 'calendar' },
      { id: 'bookings', label: 'Bookings',  path: '/dashboard/bookings', icon: 'bookings' },
      { id: 'clients',  label: 'Clients',   path: '/dashboard/clients',  icon: 'clients'  },
      { id: 'services', label: 'Services',  path: '/dashboard/services', icon: 'services' },
    ],
  },
  {
    section: 'Insights',
    items: [
      { id: 'messages', label: 'Messages',  path: '/dashboard/messages', icon: 'messages' },
      { id: 'reports',  label: 'Reports',   path: '/dashboard/reports',  icon: 'reports'  },
    ],
  },
];

export const CUSTOMER_NAV = [
  {
    section: 'Main',
    items: [
      { id: 'home',     label: 'Home',        path: '/dashboard',          icon: 'home'     },
      { id: 'bookings', label: 'My Bookings', path: '/dashboard/bookings', icon: 'bookings' },
      { id: 'discover', label: 'Discover',    path: '/dashboard/discover', icon: 'discover' },
      { id: 'messages', label: 'Messages',    path: '/dashboard/messages', icon: 'messages' },
    ],
  },
];

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
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        margin: '1px 0',
        borderRadius: 10,
        textDecoration: 'none',
        color: active ? 'var(--color-primary)' : '#64748B',
        background: active ? '#EEF5F2' : 'transparent',
        fontWeight: active ? 600 : 500,
        fontSize: 14,
        transition: 'all 0.14s ease',
        outline: 'none',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#F5F8F7'; e.currentTarget.style.color = '#374151'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; } }}
    >
      <span style={{
        display: 'flex', flexShrink: 0,
        color: active ? 'var(--color-primary)' : '#94A3B8',
        transition: 'color 0.14s',
      }}>
        {IconComp && <IconComp />}
      </span>
      <span style={{ flex: 1, lineHeight: 1 }}>{item.label}</span>
      {item.badge > 0 && (
        <span style={{
          background: 'var(--color-secondary)', color: '#fff',
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

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || '?';
  const fullName  = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();

  /* ── Sidebar inner content ── */
  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>

      {/* ── Logo ── */}
      <div style={{ padding: '22px 22px 16px', flexShrink: 0 }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Brand mark */}
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #024139 0%, #0A544A 60%, #49A96C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2,65,57,0.25)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 8v8l8 5 8-5V8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M12 3v13M4 8l8 5 8-5" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-sans)' }}>
              edenly
            </p>
            <p style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1, marginTop: 2 }}>
              {user?.role === 'provider' ? 'Business' : 'Customer'}
            </p>
          </div>
        </Link>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: '#F1F5F9', margin: '0 16px 14px' }} />

      {/* ── Nav sections ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 14px', scrollbarWidth: 'none' }}>
        {navItems.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 18 }}>
            {/* Section label */}
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#CBD5E1',
              padding: '0 4px 8px',
            }}>
              {group.section}
            </p>
            {/* Items */}
            {(group.items || [group]).map((item) => (
              <NavItem
                key={item.id || item.section}
                item={item}
                active={isActive(item.path)}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        ))}

        {/* Account section */}
        <div style={{ marginBottom: 8 }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: '#CBD5E1',
            padding: '0 4px 8px',
          }}>
            Account
          </p>
          <NavItem
            item={{ id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: 'settings' }}
            active={isActive('/dashboard/settings')}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      </nav>

      {/* ── User profile card (bottom) ── */}
      <div style={{ flexShrink: 0, padding: '10px 14px 18px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 11,
          padding: '10px 12px', borderRadius: 12,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
        }}>
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #024139, #49A96C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff',
            letterSpacing: '0.02em',
          }}>
            {initials}
          </div>

          {/* Name + role */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fullName || 'User'}
            </p>
            <p style={{
              fontSize: 10.5, fontWeight: 600, lineHeight: 1.2, marginTop: 2,
              color: 'var(--color-secondary)',
              textTransform: 'capitalize',
            }}>
              {user?.role}
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title="Log out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8,
              color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.14s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94A3B8'; }}
          >
            <Icons.logout />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F8F5', fontFamily: 'var(--font-sans)' }}>

      {/* ── Desktop sidebar ── */}
      <div
        className="db-sidebar"
        style={{
          width: 280, flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid #E8EEF2',
          position: 'sticky', top: 0, height: '100vh',
          overflowY: 'auto', overflowX: 'hidden',
          boxShadow: '2px 0 16px rgba(15,23,42,0.04)',
        }}
      >
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
              width: 280, height: '100%', background: '#fff',
              position: 'relative', zIndex: 201, overflowY: 'auto',
              boxShadow: '4px 0 24px rgba(15,23,42,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 14,
                background: '#F1F5F9', border: 'none', borderRadius: 8,
                color: '#64748B', cursor: 'pointer', padding: '6px 7px', display: 'flex',
              }}
            >
              <Icons.close />
            </button>
            {sidebarContent}
          </div>
          <div style={{ flex: 1, background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} />
        </div>
      )}

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Top bar ── */}
        <div style={{
          height: 60, background: '#fff',
          borderBottom: '1px solid #E8EEF2',
          display: 'flex', alignItems: 'center',
          padding: '0 28px 0 24px', gap: 16,
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
          flexShrink: 0,
        }}>
          {/* Mobile menu */}
          <button className="db-menu-btn" onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748B', display: 'none', padding: 4, borderRadius: 8,
          }}>
            <Icons.menu />
          </button>

          {/* Page title */}
          <h1 style={{ fontSize: 15.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', flex: 1 }}>
            {resolvedTitle}
          </h1>

          {topBarActions}

          {/* Notification bell */}
          <button style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', padding: '7px 8px', borderRadius: 9,
            display: 'flex', position: 'relative',
            transition: 'all 0.14s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#94A3B8'; }}>
            <Icons.bell />
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 22, background: '#E2E8F0' }} />

          {/* User chip */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
            padding: '5px 10px 5px 6px', borderRadius: 10, border: '1px solid #E2E8F0',
            transition: 'all 0.14s', background: '#fff',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg, #024139, #49A96C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>
              {initials}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>
              {user?.first_name}
            </span>
            <Icons.chevronD />
          </div>
        </div>

        {/* ── Page content ── */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .db-sidebar  { display: none !important; }
          .db-menu-btn { display: flex !important; }
        }
        nav::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
