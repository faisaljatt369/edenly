import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout, { PROVIDER_NAV, CUSTOMER_NAV } from '../../components/layout/DashboardLayout';

/* ─────────────────────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────────────────────── */

/** Generic stat card */
const StatCard = ({ label, value, sub, icon, accent = 'var(--color-primary)' }) => (
  <div style={{
    background: '#fff',
    border: '1px solid var(--color-border-light)',
    borderRadius: 14, padding: '20px 22px',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(2,65,57,0.06)',
    flex: 1, minWidth: 0,
  }}>
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 6 }}>{sub}</p>}
    </div>
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: `${accent}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent,
    }}>
      {icon}
    </div>
  </div>
);

/** Empty state placeholder */
const EmptyState = ({ icon, title, description, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px', textAlign: 'center',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(2,65,57,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-muted)', marginBottom: 20,
    }}>
      {icon}
    </div>
    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>{title}</p>
    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 320, lineHeight: 1.7, marginBottom: action ? 20 : 0 }}>{description}</p>
    {action}
  </div>
);

/** White content card */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', border: '1px solid var(--color-border-light)',
    borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)',
    overflow: 'hidden', ...style,
  }}>
    {children}
  </div>
);

/** Card header */
const CardHeader = ({ title, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)',
  }}>
    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</p>
    {action}
  </div>
);

/** Page section heading */
const SectionTitle = ({ children }) => (
  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
    {children}
  </p>
);

/** Placeholder page for coming-soon sections */
const ComingSoonPage = ({ title, description, icon }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>{title}</h2>
    </div>
    <Card>
      <EmptyState
        icon={icon}
        title={`${title} coming soon`}
        description={description}
      />
    </Card>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons (inline, for page content)
───────────────────────────────────────────────────────────────────────────── */
const CalSvg   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const BookSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const UsersSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const StarSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const EuroSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12"/></svg>;
const MsgSvg   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ChartSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const GearSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const SearchSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER PAGES
───────────────────────────────────────────────────────────────────────────── */

const ProviderHome = ({ user }) => {
  const firstName = user?.first_name || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
          {greeting}, {firstName}! 👋
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>Here's an overview of your business today.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Today's Bookings" value="0" sub="No appointments yet" icon={<CalSvg />} accent="var(--color-primary)" />
        <StatCard label="Revenue (week)" value="€0" sub="No transactions yet" icon={<EuroSvg />} accent="var(--color-secondary)" />
        <StatCard label="Total Clients" value="0" sub="Grow your client base" icon={<UsersSvg />} accent="#7C3AED" />
        <StatCard label="Active Services" value="—" sub="Add services to begin" icon={<StarSvg />} accent="#F59E0B" />
      </div>

      {/* Two-column row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

        {/* Upcoming appointments */}
        <Card>
          <CardHeader
            title="Upcoming Appointments"
            action={
              <Link to="/dashboard/calendar" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                View calendar →
              </Link>
            }
          />
          <EmptyState
            icon={<CalSvg />}
            title="No upcoming appointments"
            description="Once clients book with you, their appointments will appear here."
            action={
              <Link to="/dashboard/bookings" className="btn btn-primary" style={{ fontSize: 13 }}>
                Manage bookings
              </Link>
            }
          />
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Add a service',      to: '/dashboard/services', color: 'var(--color-primary)'   },
                { label: 'View your calendar', to: '/dashboard/calendar', color: 'var(--color-secondary)' },
                { label: 'See all bookings',   to: '/dashboard/bookings', color: '#7C3AED'                },
                { label: 'View clients',       to: '/dashboard/clients',  color: '#F59E0B'                },
              ].map(({ label, to, color }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 9, textDecoration: 'none',
                  color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500,
                  transition: 'background 0.12s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                    {label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              ))}
            </div>
          </Card>

          {/* Profile completion */}
          <Card>
            <CardHeader title="Profile Setup" />
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Completion</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>40%</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-border-light)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--gradient-brand)', borderRadius: 99, transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 10, lineHeight: 1.6 }}>
                Complete your profile to attract more clients.
              </p>
              <Link to="/onboarding" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                Continue setup →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <EmptyState
          icon={<ChartSvg />}
          title="No activity yet"
          description="Your booking history and client interactions will appear here."
        />
      </Card>
    </div>
  );
};

const ProviderCalendar = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Calendar</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your schedule and availability</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ New Appointment</button>
    </div>

    {/* Calendar shell */}
    <Card>
      {/* Calendar nav */}
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
        {['Day', 'Week', 'Month'].map((view) => (
          <button key={view} style={{
            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: view === 'Week' ? 'var(--color-primary)' : 'var(--color-bg-muted)',
            color: view === 'Week' ? '#fff' : 'var(--color-text-secondary)',
            transition: 'all 0.12s',
          }}>
            {view}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Today
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '›'].map((ch) => (
            <button key={ch} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: 'var(--color-text-secondary)' }}>{ch}</button>
          ))}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 140, textAlign: 'center' }}>
          March 2026
        </span>
      </div>

      {/* Calendar grid placeholder */}
      <div style={{ padding: 0 }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ padding: '10px 0' }} />
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <div key={d} style={{
              padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 600,
              color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderLeft: '1px solid var(--color-border-light)',
            }}>
              <p style={{ marginBottom: 2 }}>{d}</p>
              <p style={{
                fontSize: 16, fontWeight: i === 0 ? 800 : 400,
                color: i === 0 ? '#fff' : 'var(--color-text-primary)',
                background: i === 0 ? 'var(--color-primary)' : 'transparent',
                borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
              }}>
                {9 + i}
              </p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
          <div key={time} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--color-border-light)' }}>
            <div style={{ padding: '16px 10px 0', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'right', paddingRight: 12 }}>{time}</div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ height: 56, borderLeft: '1px solid var(--color-border-light)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
            ))}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ProviderBookings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Bookings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Track and manage all your appointments</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ New Booking</button>
    </div>

    {/* Filter tabs */}
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border-light)', paddingBottom: 0 }}>
      {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab, i) => (
        <button key={tab} style={{
          padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          borderBottom: i === 0 ? '2px solid var(--color-primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>
          {tab}
        </button>
      ))}
    </div>

    <Card>
      <EmptyState
        icon={<BookSvg />}
        title="No bookings yet"
        description="When clients book your services, all appointments will appear here for easy management."
        action={
          <Link to="/dashboard/services" className="btn btn-primary" style={{ fontSize: 13 }}>
            Set up your services
          </Link>
        }
      />
    </Card>
  </div>
);

const ProviderClients = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Clients</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Your client base and booking history</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ Add Client</button>
    </div>

    {/* Search bar */}
    <div style={{ position: 'relative', maxWidth: 340 }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
        <SearchSvg />
      </span>
      <input placeholder="Search clients…" style={{
        width: '100%', padding: '10px 14px 10px 40px',
        border: '1.5px solid var(--color-border)', borderRadius: 10,
        fontSize: 13, fontFamily: 'var(--font-sans)', background: '#fff',
        outline: 'none', boxSizing: 'border-box',
      }} />
    </div>

    <Card>
      <EmptyState
        icon={<UsersSvg />}
        title="No clients yet"
        description="Clients who book your services will automatically appear here. You can also add clients manually."
      />
    </Card>
  </div>
);

const ProviderServices = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Services</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage what you offer and your pricing</p>
      </div>
      <Link to="/onboarding" className="btn btn-primary" style={{ fontSize: 13, textDecoration: 'none' }}>+ Add Service</Link>
    </div>

    <Card>
      <EmptyState
        icon={<StarSvg />}
        title="No services added"
        description="Add the services you offer so clients can discover and book with you."
        action={
          <Link to="/onboarding" className="btn btn-primary" style={{ fontSize: 13 }}>
            Set up services
          </Link>
        }
      />
    </Card>
  </div>
);

const ProviderMessages = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 116px)' }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Messages</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Client conversations</p>
    </div>
    <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)' }}>
      {/* Conversation list */}
      <div style={{ width: 300, borderRight: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
          <input placeholder="Search messages…" style={{
            width: '100%', padding: '9px 13px',
            border: '1.5px solid var(--color-border)', borderRadius: 9,
            fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 24 }}>No conversations yet</p>
        </div>
      </div>
      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState
          icon={<MsgSvg />}
          title="No conversation selected"
          description="Select a conversation from the list, or wait for a client to reach out."
        />
      </div>
    </div>
  </div>
);

const ProviderReports = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Reports</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Track your business performance</p>
    </div>

    {/* Period selector */}
    <div style={{ display: 'flex', gap: 6 }}>
      {['This week', 'This month', 'Last 3 months', 'This year'].map((p, i) => (
        <button key={p} style={{
          padding: '7px 14px', borderRadius: 8, border: '1.5px solid',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          borderColor: i === 1 ? 'var(--color-primary)' : 'var(--color-border)',
          background: i === 1 ? 'rgba(2,65,57,0.06)' : '#fff',
          color: i === 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}>
          {p}
        </button>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <StatCard label="Total Revenue" value="€0" sub="This month" icon={<EuroSvg />} accent="var(--color-secondary)" />
      <StatCard label="Total Bookings" value="0" sub="This month" icon={<CalSvg />} accent="var(--color-primary)" />
      <StatCard label="New Clients" value="0" sub="This month" icon={<UsersSvg />} accent="#7C3AED" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <CardHeader title="Revenue Over Time" />
        <div style={{ padding: 24, display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: 0, background: 'rgba(2,65,57,0.12)', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', paddingBottom: 16 }}>No data yet — revenue will appear once you receive bookings</p>
      </Card>
      <Card>
        <CardHeader title="Bookings by Service" />
        <EmptyState icon={<ChartSvg />} title="No data yet" description="Service breakdown will appear once bookings come in." />
      </Card>
    </div>
  </div>
);

const ProviderSettings = () => {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your account and business preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Settings tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Profile', 'Business', 'Notifications', 'Payments', 'Privacy', 'Password'].map((tab, i) => (
            <button key={tab} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              background: i === 0 ? 'rgba(2,65,57,0.08)' : 'transparent',
              border: 'none', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
              fontSize: 13.5, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => { if (i !== 0) e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
            onMouseLeave={(e) => { if (i !== 0) e.currentTarget.style.background = 'transparent'; }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Settings content */}
        <Card>
          <CardHeader title="Profile Information" />
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>
                {`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase()}
              </div>
              <div>
                <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: '1.5px solid var(--color-primary)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
                  Change photo
                </button>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>JPG, PNG or GIF · Max 5MB</p>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'First name', value: user?.first_name || '' },
                { label: 'Last name',  value: user?.last_name  || '' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</label>
                  <input defaultValue={value} style={{
                    padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
                    fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Email address</label>
              <input defaultValue={user?.email || ''} type="email" style={{
                padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
                fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Phone number</label>
              <input placeholder="+49 000 000 0000" style={{
                padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
                fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>Save changes</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER PAGES
───────────────────────────────────────────────────────────────────────────── */

const CustomerHome = ({ user }) => {
  const firstName = user?.first_name || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
          {greeting}, {firstName}! 👋
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>Ready for your next beauty appointment?</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Upcoming Bookings" value="0" sub="No bookings scheduled" icon={<CalSvg />} accent="var(--color-primary)" />
        <StatCard label="Past Appointments" value="0" sub="Build your history" icon={<BookSvg />} accent="var(--color-secondary)" />
        <StatCard label="Favourite Providers" value="0" sub="Save your favourites" icon={<StarSvg />} accent="#F59E0B" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

        {/* Upcoming booking */}
        <Card>
          <CardHeader
            title="Your Next Appointment"
            action={
              <Link to="/dashboard/bookings" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                All bookings →
              </Link>
            }
          />
          <EmptyState
            icon={<CalSvg />}
            title="No upcoming appointments"
            description="Discover talented beauty professionals near you and book your first appointment."
            action={
              <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                Discover providers
              </Link>
            }
          />
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Discover CTA */}
          <div style={{
            background: 'var(--gradient-brand)',
            borderRadius: 14, padding: '22px 22px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', right: 20, bottom: -30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6, position: 'relative' }}>
              Find your perfect stylist
            </p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16, position: 'relative' }}>
              Browse hundreds of beauty professionals near you.
            </p>
            <Link to="/dashboard/discover" style={{
              display: 'inline-block', background: '#fff', color: 'var(--color-primary)',
              fontWeight: 700, fontSize: 12.5, padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none', position: 'relative',
            }}>
              Explore now →
            </Link>
          </div>

          {/* Recent history */}
          <Card>
            <CardHeader title="Recent Visits" />
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>No visits yet</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CustomerBookings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>My Bookings</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Your past and upcoming appointments</p>
    </div>

    {/* Filter tabs */}
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border-light)' }}>
      {['Upcoming', 'Past', 'Cancelled'].map((tab, i) => (
        <button key={tab} style={{
          padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          borderBottom: i === 0 ? '2px solid var(--color-primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>
          {tab}
        </button>
      ))}
    </div>

    <Card>
      <EmptyState
        icon={<CalSvg />}
        title="No upcoming bookings"
        description="You haven't booked any appointments yet. Find a provider and book your first session."
        action={
          <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
            Discover providers
          </Link>
        }
      />
    </Card>
  </div>
);

const CustomerDiscover = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Discover</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Find beauty professionals near you</p>
    </div>

    {/* Search + filters */}
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1 1 300px' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
          <SearchSvg />
        </span>
        <input placeholder="Search services, providers…" style={{
          width: '100%', padding: '11px 14px 11px 42px',
          border: '1.5px solid var(--color-border)', borderRadius: 10,
          fontSize: 13.5, fontFamily: 'var(--font-sans)', background: '#fff',
          outline: 'none', boxSizing: 'border-box',
        }} />
      </div>
      <button style={{ padding: '0 18px', background: '#fff', border: '1.5px solid var(--color-border)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        📍 Near me
      </button>
      <button style={{ padding: '0 18px', background: '#fff', border: '1.5px solid var(--color-border)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        Category ▾
      </button>
    </div>

    {/* Category chips */}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['All', 'Hair & Braids', 'Lashes', 'Nails', 'Skin & Facials', 'Brows', 'Makeup', 'Wellness'].map((cat, i) => (
        <button key={cat} style={{
          padding: '7px 15px', borderRadius: 99, border: '1.5px solid',
          borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
          background: i === 0 ? 'var(--color-primary)' : '#fff',
          color: i === 0 ? '#fff' : 'var(--color-text-secondary)',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.12s',
        }}>
          {cat}
        </button>
      ))}
    </div>

    {/* Provider grid placeholder */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--color-border-light)',
          borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(2,65,57,0.05)',
          cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(2,65,57,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(2,65,57,0.05)'; }}>
          {/* Cover image placeholder */}
          <div style={{ height: 130, background: `hsl(${140 + i * 20}, 25%, ${90 - i * 3}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>✂</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                  {['Studio Glow', 'Beauty by Ada', 'Lash Lab Berlin', 'Nail Art Studio', 'Brow Bar Co.', 'Skin & Spa'][i]}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {['Hair & Braids', 'Makeup', 'Lashes', 'Nails', 'Brows', 'Wellness'][i]}
                </p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                background: 'rgba(73,169,108,0.1)', color: 'var(--color-secondary)',
              }}>
                New
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>📍 Berlin</span>
              <span style={{ fontSize: 11, color: 'var(--color-border)' }}>·</span>
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>From €40</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CustomerMessages = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 116px)' }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Messages</h2>
    </div>
    <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)' }}>
      <div style={{ width: 300, borderRight: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-border-light)' }}>
          <input placeholder="Search conversations…" style={{
            width: '100%', padding: '9px 13px', border: '1.5px solid var(--color-border)',
            borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 24 }}>No conversations yet</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState icon={<MsgSvg />} title="No conversation selected" description="Book with a provider to start a conversation." />
      </div>
    </div>
  </div>
);

const CustomerSettings = () => {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your account preferences</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['Profile', 'Notifications', 'Privacy', 'Payment Methods', 'Password'].map((tab, i) => (
            <button key={tab} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              background: i === 0 ? 'rgba(2,65,57,0.08)' : 'transparent',
              border: 'none', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
              fontSize: 13.5, fontWeight: i === 0 ? 600 : 400,
              color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            }}>
              {tab}
            </button>
          ))}
        </div>
        <Card>
          <CardHeader title="Profile Information" />
          <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>
                {`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase()}
              </div>
              <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: '1.5px solid var(--color-primary)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
                Change photo
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[{ label: 'First name', value: user?.first_name || '' }, { label: 'Last name', value: user?.last_name || '' }].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</label>
                  <input defaultValue={value} style={{ padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Email</label>
              <input defaultValue={user?.email || ''} type="email" style={{ padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" style={{ fontSize: 13 }}>Save changes</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Shared finance helpers
───────────────────────────────────────────────────────────────────────────── */
const Badge = ({ label, color = '#64748B', bg }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11.5, fontWeight: 600,
    color, background: bg || `${color}18`,
  }}>{label}</span>
);

const StatusBadge = ({ status }) => {
  const map = {
    completed:  { label: 'Completed',  color: '#16a34a', bg: '#dcfce7' },
    paid:       { label: 'Paid',       color: '#16a34a', bg: '#dcfce7' },
    pending:    { label: 'Pending',    color: '#d97706', bg: '#fef3c7' },
    processing: { label: 'Processing', color: '#2563eb', bg: '#dbeafe' },
    failed:     { label: 'Failed',     color: '#dc2626', bg: '#fee2e2' },
    refunded:   { label: 'Refunded',   color: '#7c3aed', bg: '#ede9fe' },
    active:     { label: 'Active',     color: '#16a34a', bg: '#dcfce7' },
    cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: '#fee2e2' },
  };
  const s = map[status?.toLowerCase()] || { label: status, color: '#64748B', bg: '#F1F5F9' };
  return <Badge label={s.label} color={s.color} bg={s.bg} />;
};

const TableHeader = ({ cols }) => (
  <thead>
    <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
      {cols.map((col) => (
        <th key={col} style={{
          padding: '11px 16px', textAlign: 'left',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap',
        }}>{col}</th>
      ))}
    </tr>
  </thead>
);

const FilterTabs = ({ tabs, active, onSelect }) => (
  <div style={{ display: 'flex', gap: 4, padding: '4px', background: '#F1F5F9', borderRadius: 10, width: 'fit-content' }}>
    {tabs.map((tab) => (
      <button key={tab} onClick={() => onSelect(tab)} style={{
        padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontSize: 12.5, fontWeight: 600, transition: 'all 0.14s',
        background: active === tab ? '#fff' : 'transparent',
        color: active === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        boxShadow: active === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
      }}>{tab}</button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Payouts
───────────────────────────────────────────────────────────────────────────── */
const ProviderPayouts = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Payouts</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Track your earnings and payout history</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13 }}>Request Payout</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Earned" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="Pending Payout" value="€0.00" sub="Processing in 2–5 days" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        } accent="#F59E0B" />
        <StatCard label="Last Payout" value="—" sub="No payouts yet" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        } accent="var(--color-secondary)" />
      </div>

      {/* Bank account alert */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderRadius: 12,
        background: 'rgba(2,65,57,0.06)', border: '1px solid rgba(2,65,57,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(2,65,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Connect your bank account</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>Add a bank account to receive payouts from your bookings</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12.5, padding: '8px 16px' }}>Connect Bank</button>
      </div>

      {/* Payout history */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Payout History</p>
          <FilterTabs tabs={['All', 'Pending', 'Completed', 'Failed']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Reference', 'Bank Account', 'Amount', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={5}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                  title="No payouts yet"
                  description="Once you receive bookings and enable payouts, your payout history will appear here."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Transactions
───────────────────────────────────────────────────────────────────────────── */
const ProviderTransactions = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Transactions</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>All service order payments and revenue</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 9, border: '1.5px solid var(--color-border)',
          background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Revenue" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="This Month" value="€0.00" sub="March 2026" icon={<CalSvg />} accent="var(--color-secondary)" />
        <StatCard label="Avg. Transaction" value="—" sub="No data yet" icon={<ChartSvg />} accent="#7C3AED" />
      </div>

      {/* Table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Transaction History</p>
          <FilterTabs tabs={['All', 'Completed', 'Pending', 'Refunded']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Client', 'Service', 'Gross', 'Platform Fee', 'Net', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
                  title="No transactions yet"
                  description="Service order transactions will appear here once clients start booking your services."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Subscription
───────────────────────────────────────────────────────────────────────────── */
const ProviderSubscription = () => {
  const plans = [
    {
      name: 'Free',
      price: '€0',
      period: 'forever',
      current: true,
      color: '#64748B',
      features: ['Up to 30 bookings/mo', '1 staff member', 'Basic calendar', 'Client management', 'Email support'],
    },
    {
      name: 'Starter',
      price: '€29',
      period: '/month',
      current: false,
      color: 'var(--color-secondary)',
      recommended: false,
      features: ['Up to 200 bookings/mo', 'Up to 3 staff', 'Advanced calendar', 'Automated reminders', 'Reports & analytics', 'Priority support'],
    },
    {
      name: 'Pro',
      price: '€79',
      period: '/month',
      current: false,
      color: '#7C3AED',
      recommended: true,
      features: ['Unlimited bookings', 'Unlimited staff', 'Custom branding', 'Online payments', 'Advanced reports', 'API access', 'Dedicated support'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Subscription</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Manage your plan and billing</p>
      </div>

      {/* Current plan banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', borderRadius: 14,
        background: 'linear-gradient(135deg, #024139 0%, #0A544A 60%, #49A96C 100%)',
        color: '#fff',
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>Current Plan</p>
          <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>Free Plan</p>
          <p style={{ fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>30 bookings/month · 1 staff member</p>
        </div>
        <button style={{
          background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
          color: '#fff', padding: '9px 20px', borderRadius: 9,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}>
          Upgrade Plan
        </button>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            background: '#fff', borderRadius: 14, overflow: 'hidden',
            border: plan.recommended ? '2px solid #7C3AED' : '1px solid var(--color-border-light)',
            boxShadow: plan.recommended ? '0 4px 20px rgba(124,58,237,0.12)' : '0 1px 4px rgba(2,65,57,0.05)',
            position: 'relative',
          }}>
            {plan.recommended && (
              <div style={{
                background: '#7C3AED', color: '#fff', textAlign: 'center',
                padding: '5px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Most Popular
              </div>
            )}
            <div style={{ padding: '22px 22px 20px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: plan.color, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)', fontWeight: 500 }}>{plan.period}</span>
              </div>
              <div style={{ height: 1, background: 'var(--color-border-light)', margin: '16px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <div style={{ padding: '9px', textAlign: 'center', borderRadius: 9, background: '#F1F5F9', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Current Plan
                </div>
              ) : (
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: plan.recommended ? '#7C3AED' : 'var(--color-primary)',
                  color: '#fff', fontSize: 13, fontWeight: 600, transition: 'opacity 0.14s',
                }}>
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <Card>
        <CardHeader title="Billing History" />
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          title="No billing history"
          description="Invoices and receipts for your subscription will appear here."
        />
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER — Invoices
───────────────────────────────────────────────────────────────────────────── */
const CustomerInvoices = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Invoices</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>View and download your service invoices</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 9, border: '1.5px solid var(--color-border)',
          background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download All
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Spent" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="Paid Invoices" value="0" sub="Successfully paid" icon={<BookSvg />} accent="var(--color-secondary)" />
        <StatCard label="Pending" value="0" sub="Awaiting payment" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        } accent="#F59E0B" />
      </div>

      {/* Invoices table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Invoice History</p>
          <FilterTabs tabs={['All', 'Paid', 'Pending']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Invoice #', 'Provider', 'Service', 'Date', 'Amount', 'Status', '']} />
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  title="No invoices yet"
                  description="After you book and pay for services, your invoices will appear here for download."
                  action={
                    <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                      Discover services
                    </Link>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER — Transactions
───────────────────────────────────────────────────────────────────────────── */
const CustomerTransactions = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Transactions</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Your payment history for service orders</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Spent" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="This Month" value="€0.00" sub="March 2026" icon={<CalSvg />} accent="var(--color-secondary)" />
        <StatCard label="Bookings Paid" value="0" sub="Total services paid" icon={<BookSvg />} accent="#7C3AED" />
      </div>

      {/* Transactions table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Payment History</p>
          <FilterTabs tabs={['All', 'Completed', 'Pending', 'Refunded']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Description', 'Provider', 'Payment Method', 'Amount', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
                  title="No transactions yet"
                  description="Payment transactions for your service bookings will appear here."
                  action={
                    <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                      Book a service
                    </Link>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Page title map (for top bar)
───────────────────────────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  '/dashboard':                'Home',
  '/dashboard/calendar':       'Calendar',
  '/dashboard/bookings':       'Bookings',
  '/dashboard/clients':        'Clients',
  '/dashboard/services':       'Services',
  '/dashboard/payouts':        'Payouts',
  '/dashboard/transactions':   'Transactions',
  '/dashboard/subscription':   'Subscription',
  '/dashboard/invoices':       'Invoices',
  '/dashboard/messages':       'Messages',
  '/dashboard/reports':        'Reports',
  '/dashboard/discover':       'Discover',
  '/dashboard/settings':       'Settings',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main DashboardPage
───────────────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, role } = useAuth();
  const isProvider = role === 'provider';
  const navItems   = isProvider ? PROVIDER_NAV : CUSTOMER_NAV;

  return (
    <DashboardLayout navItems={navItems} pageTitleMap={PAGE_TITLES}>
      <Routes>
        {isProvider ? (
          <>
            <Route index                  element={<ProviderHome user={user} />} />
            <Route path="calendar"        element={<ProviderCalendar />} />
            <Route path="bookings"        element={<ProviderBookings />} />
            <Route path="clients"         element={<ProviderClients />} />
            <Route path="services"        element={<ProviderServices />} />
            <Route path="payouts"         element={<ProviderPayouts />} />
            <Route path="transactions"    element={<ProviderTransactions />} />
            <Route path="subscription"    element={<ProviderSubscription />} />
            <Route path="messages"        element={<ProviderMessages />} />
            <Route path="reports"         element={<ProviderReports />} />
            <Route path="settings"        element={<ProviderSettings />} />
          </>
        ) : (
          <>
            <Route index                  element={<CustomerHome user={user} />} />
            <Route path="bookings"        element={<CustomerBookings />} />
            <Route path="discover"        element={<CustomerDiscover />} />
            <Route path="invoices"        element={<CustomerInvoices />} />
            <Route path="transactions"    element={<CustomerTransactions />} />
            <Route path="messages"        element={<CustomerMessages />} />
            <Route path="settings"        element={<CustomerSettings />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
