import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: 'braids', name: 'Braids', nameDE: 'Braids',
    img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'locs', name: 'Locs', nameDE: 'Locs',
    img: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'natural-hair', name: 'Natural Hair', nameDE: 'Naturhaar',
    img: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'hair-styling', name: 'Hair Styling', nameDE: 'Haarstyling',
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'hair-extensions', name: 'Hair Extensions', nameDE: 'Extensions',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'hair-treatments', name: 'Hair Treatments', nameDE: 'Haarpflege',
    img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'lashes', name: 'Lashes', nameDE: 'Wimpern',
    img: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'brows', name: 'Brows', nameDE: 'Augenbrauen',
    img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'nails', name: 'Nails', nameDE: 'Nägel',
    img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'makeup', name: 'Makeup', nameDE: 'Make-up',
    img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'tooth-gems', name: 'Tooth Gems', nameDE: 'Zahnschmuck',
    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=320&h=320&fit=crop&q=80&auto=format',
  },
  {
    id: 'hair-removal', name: 'Hair Removal', nameDE: 'Haarentfernung',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=320&h=320&fit=crop&q=80&auto=format',
  },
];

const POPULAR_TAGS = ['Braids', 'Box Braids', 'Lashes', 'Nails', 'Natural Hair', 'Makeup'];

const STATS = [
  { value: '2,400+', label: 'Beauty Professionals' },
  { value: '18 K+',  label: 'Appointments Booked' },
  { value: '40+',    label: 'Cities in Germany' },
  { value: '4.9',    label: 'Average Rating' },
];

const HOW_STEPS = [
  {
    n: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'Search',
    desc: 'Find top-rated Black beauty professionals near you by service, location, or availability.',
  },
  {
    n: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    title: 'Book Instantly',
    desc: 'Choose your time slot and confirm in seconds — no waiting, no phone calls needed.',
  },
  {
    n: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Enjoy & Review',
    desc: 'Show up and love your look. Leave a review and build a relationship with your stylist.',
  },
];

/* ─────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────── */
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* Filled star for ratings */
const StarFilled = ({ size = 14, color = '#F2C94C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* Scissors icon for hero card */
const ScissorsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

/* Benefit icons for Provider CTA */
const CalendarIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
  </svg>
);
const MegaphoneIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9v18L3 13"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
  </svg>
);
const CreditCardIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const StarOutlineIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);


/* ─────────────────────────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────────────────────────── */
const Hero = () => {
  const [location,     setLocation]     = useState('');
  const [service,      setService]      = useState('');
  const [activeTag,    setActiveTag]    = useState(null);   // which pill is selected
  const [focusedInput, setFocusedInput] = useState(null);   // 'location' | 'service' | null
  const [barFocused,   setBarFocused]   = useState(false);  // any input inside bar focused
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/providers?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
  };

  const selectTag = (tag) => {
    setService(tag);
    setActiveTag(tag);
  };

  // Deselect tag if user manually edits the service input
  const handleServiceChange = (val) => {
    setService(val);
    if (activeTag && val !== activeTag) setActiveTag(null);
  };

  return (
    <section style={{
      background: '#ffffff',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Subtle decorative blob top-right */}
      <div aria-hidden style={{
        position: 'absolute', top: -120, right: -80,
        width: 520, height: 520,
        background: 'radial-gradient(circle, rgba(73,169,108,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle decorative blob bottom-left */}
      <div aria-hidden style={{
        position: 'absolute', bottom: -60, left: -60,
        width: 340, height: 340,
        background: 'radial-gradient(circle, rgba(2,65,57,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '0 var(--space-6)',
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        gap: 64,
        alignItems: 'center',
        minHeight: 600,
      }} className="hero-grid">

        {/* ── Left: copy + search ── */}
        <div style={{ padding: '80px 0 80px', position: 'relative', zIndex: 1 }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(73,169,108,0.10)',
            border: '1px solid rgba(73,169,108,0.22)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 14px',
            marginBottom: 24,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-secondary)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '0.04em' }}>
              Black Beauty · Made in Germany
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            margin: 0,
            marginBottom: 20,
          }}>
            Dein Beauty-Termin,<br />
            <span style={{ color: 'var(--color-primary)' }}>wann & wo du willst</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            maxWidth: 500,
            marginBottom: 36,
          }}>
            Entdecke und buche bei Black Beauty &amp; Wellness Profis in deiner Nähe —
            Braids, Locs, Natural Hair, Nails, Makeup und mehr.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 580 }}>
            <div
              className="search-bar"
              style={{
                display: 'flex',
                background: '#fff',
                border: `1.5px solid ${barFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: barFocused
                  ? '0 4px 28px rgba(2,65,57,0.16), 0 0 0 3px rgba(2,65,57,0.07)'
                  : '0 4px 20px rgba(2,65,57,0.07)',
                transition: 'border-color 0.18s, box-shadow 0.18s',
              }}
            >
              {/* Location section */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', flex: 1,
                  padding: '0 16px', gap: 10, minWidth: 0,
                  background: focusedInput === 'location' ? 'rgba(2,65,57,0.03)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ color: focusedInput === 'location' ? 'var(--color-primary)' : 'var(--color-text-muted)', flexShrink: 0, transition: 'color 0.15s' }}>
                  <MapPinIcon />
                </span>
                <input
                  className="search-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => { setFocusedInput('location'); setBarFocused(true); }}
                  onBlur={() => { setFocusedInput(null); setBarFocused(false); }}
                  placeholder="Stadt oder PLZ"
                  autoComplete="off"
                />
              </div>

              {/* Divider */}
              <div style={{ width: 1, background: 'var(--color-border)', margin: '14px 0', flexShrink: 0, opacity: barFocused ? 0.5 : 1, transition: 'opacity 0.18s' }} />

              {/* Service section */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', flex: 1,
                  padding: '0 16px', gap: 10, minWidth: 0,
                  background: focusedInput === 'service' ? 'rgba(2,65,57,0.03)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ color: focusedInput === 'service' ? 'var(--color-primary)' : 'var(--color-text-muted)', flexShrink: 0, transition: 'color 0.15s' }}>
                  <SearchIcon />
                </span>
                <input
                  className="search-input"
                  value={service}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  onFocus={() => { setFocusedInput('service'); setBarFocused(true); }}
                  onBlur={() => { setFocusedInput(null); setBarFocused(false); }}
                  placeholder="Service, z.B. Braids"
                  autoComplete="off"
                />
              </div>

              {/* Search CTA */}
              <button
                type="submit"
                className="search-btn"
                style={{
                  background: 'var(--color-primary)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-xl)',
                  margin: 5, padding: '0 26px',
                  fontSize: 15, fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'background 0.18s, transform 0.12s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <SearchIcon /> Suchen
              </button>
            </div>

            {/* Popular tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>Beliebt:</span>
              {POPULAR_TAGS.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectTag(isActive ? null : tag)}
                    style={{
                      fontSize: 12.5,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      background: isActive ? 'rgba(2,65,57,0.08)' : 'var(--color-bg-muted)',
                      border: `1.5px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-full)',
                      padding: '5px 13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    {tag}
                  </button>
                );
              })}
            </div>
          </form>
        </div>

        {/* ── Right: hero image ── */}
        <div className="hero-image-col" style={{
          position: 'relative', alignSelf: 'stretch',
          minHeight: 500,
        }}>
          {/* Background fill that extends to edge */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--color-bg-muted)',
            borderRadius: '24px 0 0 24px',
          }} />

          {/* Main portrait */}
          <img
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=900&h=1100&fit=crop&q=85&auto=format"
            alt="Beauty professional"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              borderRadius: '24px 0 0 24px',
            }}
          />

          {/* Gradient overlay bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
            background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 100%)',
            borderRadius: '0 0 0 24px',
          }} />

          {/* Floating rating card */}
          <div style={{
            position: 'absolute', top: 32, left: -20,
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            minWidth: 200,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', flexShrink: 0,
            }}><ScissorsIcon size={19} /></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                2,400+ Profis
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                in ganz Deutschland
              </p>
            </div>
          </div>

          {/* Floating stars card */}
          <div style={{
            position: 'absolute', bottom: 40, left: -16,
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '12px 18px',
          }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
              {[...Array(5)].map((_, i) => <StarFilled key={i} size={15} />)}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              4.9 / 5 Bewertungen
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
              Über 8,000+ Reviews
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          .hero-image-col { display: none !important; }
        }
        /* Remove ALL browser-native focus rings from search inputs */
        .search-input {
          flex: 1; border: none; outline: none !important;
          box-shadow: none !important;
          font-size: 15px; font-family: inherit;
          color: var(--color-text-primary);
          background: transparent; min-width: 0;
          padding: 17px 0;
          -webkit-appearance: none;
          appearance: none;
        }
        .search-input:focus,
        .search-input:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        .search-input:-webkit-autofill,
        .search-input:-webkit-autofill:hover,
        .search-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
          -webkit-text-fill-color: var(--color-text-primary) !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .search-input::placeholder { color: var(--color-text-muted); }
        .search-btn:focus-visible {
          outline: 2px solid var(--color-secondary);
          outline-offset: 2px;
        }
      `}</style>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SERVICE CATEGORIES
───────────────────────────────────────────────────────────────── */
const CategoryCard = ({ cat }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/providers?service=${cat.id}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: `1.5px solid ${hovered ? 'var(--color-secondary)' : 'var(--color-border-light)'}`,
        boxShadow: hovered ? '0 8px 28px rgba(2,65,57,0.12)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.22s var(--ease)',
        cursor: 'pointer',
      }}>
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '72%', overflow: 'hidden' }}>
          <img
            src={cat.img}
            alt={cat.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s var(--ease)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'var(--color-bg-muted)';
            }}
          />
          {/* Overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered
              ? 'linear-gradient(to top, rgba(2,65,57,0.55) 0%, transparent 60%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)',
            transition: 'background 0.3s',
          }} />
        </div>

        {/* Label */}
        <div style={{
          padding: '11px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 13.5, fontWeight: 600,
            color: hovered ? 'var(--color-primary)' : 'var(--color-text-primary)',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s',
          }}>
            {cat.name}
          </span>
          <span style={{
            color: hovered ? 'var(--color-secondary)' : 'var(--color-text-muted)',
            transition: 'color 0.2s',
            display: 'flex',
          }}>
            <ChevronIcon />
          </span>
        </div>
      </div>
    </Link>
  );
};

const CategoriesSection = () => (
  <section style={{ background: 'var(--color-bg-app)', padding: '80px 0' }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 var(--space-6)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 36, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--color-secondary)',
            marginBottom: 6,
          }}>Services</p>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            fontWeight: 700, letterSpacing: '-0.02em',
            color: 'var(--color-text-primary)', margin: 0,
          }}>
            Browse by Service
          </h2>
          <p style={{ marginTop: 8, fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 440 }}>
            From braids to brows — find a specialist for every look you love.
          </p>
        </div>
        <Link to="/providers" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 600, color: 'var(--color-primary)',
          textDecoration: 'none',
          border: '1.5px solid var(--color-primary)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          transition: 'all 0.18s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
        >
          See All Providers <ArrowRight />
        </Link>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 16,
      }} className="cat-grid">
        {CATEGORIES.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
      </div>
    </div>

    <style>{`
      @media (max-width: 1200px) { .cat-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      @media (max-width: 800px)  { .cat-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      @media (max-width: 560px)  { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────────────────────────── */
const HowItWorks = () => (
  <section style={{ background: '#ffffff', padding: '88px 0' }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 var(--space-6)' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 56px' }}>
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-secondary)',
          marginBottom: 8,
        }}>How It Works</p>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
          fontWeight: 700, letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)', margin: '0 0 12px',
        }}>
          Book in 3 Simple Steps
        </h2>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
          From discovery to appointment — fast, simple, and all in one place.
        </p>
      </div>

      {/* Steps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 32,
        position: 'relative',
      }} className="steps-grid">
        {/* Connector line */}
        <div aria-hidden style={{
          position: 'absolute',
          top: 44, left: '20%', right: '20%',
          height: 1,
          background: 'linear-gradient(to right, var(--color-border) 0%, var(--color-secondary) 50%, var(--color-border) 100%)',
          zIndex: 0,
        }} className="steps-connector" />

        {HOW_STEPS.map((step, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', padding: '0 16px',
            position: 'relative', zIndex: 1,
          }}>
            {/* Step number circle */}
            <div style={{
              width: 88, height: 88,
              background: i === 1 ? 'var(--color-primary)' : '#fff',
              border: `2px solid ${i === 1 ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: i === 1 ? '#fff' : 'var(--color-primary)',
              marginBottom: 28,
              boxShadow: i === 1 ? '0 8px 24px rgba(2,65,57,0.22)' : 'var(--shadow-sm)',
              position: 'relative',
            }}>
              {step.icon}
              {/* Step number badge */}
              <div style={{
                position: 'absolute', top: -6, right: -6,
                width: 22, height: 22, borderRadius: '50%',
                background: i === 1 ? 'var(--color-secondary)' : 'var(--color-bg-muted)',
                border: '2px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: i === 1 ? '#fff' : 'var(--color-text-muted)',
              }}>{i + 1}</div>
            </div>

            <h3 style={{
              fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em',
              color: 'var(--color-text-primary)', marginBottom: 10,
            }}>{step.title}</h3>
            <p style={{
              fontSize: 14.5, color: 'var(--color-text-secondary)',
              lineHeight: 1.65, maxWidth: 280,
            }}>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 52 }}>
        <Link to="/register" className="btn btn-primary">
          Jetzt kostenlos registrieren →
        </Link>
      </div>
    </div>

    <style>{`
      @media (max-width: 700px) {
        .steps-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        .steps-connector { display: none !important; }
      }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   STATS / TRUST STRIP
───────────────────────────────────────────────────────────────── */
const StatsStrip = () => (
  <section style={{
    background: 'linear-gradient(135deg, #024139 0%, #02503f 50%, #0A544A 100%)',
    padding: '60px 0',
  }}>
    <div style={{
      maxWidth: 1440, margin: '0 auto', padding: '0 var(--space-6)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 24,
      textAlign: 'center',
    }} className="stats-grid">
      {STATS.map((s) => (
        <div key={s.label}>
          <p style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#fff', margin: '0 0 6px',
          }}>{s.value}</p>
          <p style={{
            fontSize: 13.5, color: 'rgba(255,255,255,0.65)',
            fontWeight: 500, letterSpacing: '0.01em',
          }}>{s.label}</p>
        </div>
      ))}
    </div>
    <style>{`
      @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   FEATURED PROVIDERS TEASER
───────────────────────────────────────────────────────────────── */
const FEATURED = [
  {
    name: "Zara's Braid Studio",
    service: 'Braids & Locs',
    location: 'Berlin Mitte',
    rating: 4.9,
    reviews: 138,
    price: 'ab 75 €',
    badge: 'Top Rated',
    img: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=340&fit=crop&q=80&auto=format',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&q=80&auto=format',
  },
  {
    name: 'Amara Beauty Lounge',
    service: 'Natural Hair & Treatments',
    location: 'Hamburg Altona',
    rating: 4.8,
    reviews: 92,
    price: 'ab 60 €',
    badge: 'New',
    img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&h=340&fit=crop&q=80&auto=format',
    avatar: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=80&h=80&fit=crop&q=80&auto=format',
  },
  {
    name: 'Glam House München',
    service: 'Makeup & Lashes',
    location: 'München Schwabing',
    rating: 5.0,
    reviews: 61,
    price: 'ab 90 €',
    badge: 'Top Rated',
    img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=340&fit=crop&q=80&auto=format',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&q=80&auto=format',
  },
];

const ProviderCard = ({ p }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: `1.5px solid ${hov ? 'rgba(73,169,108,0.35)' : 'var(--color-border-light)'}`,
        boxShadow: hov ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.24s var(--ease)',
        cursor: 'pointer',
      }}
    >
      {/* Cover image */}
      <div style={{ position: 'relative', paddingBottom: '62%', overflow: 'hidden' }}>
        <img
          src={p.img}
          alt={p.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transform: hov ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s var(--ease)',
          }}
        />
        {/* Badge */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: p.badge === 'New' ? 'var(--color-accent)' : 'var(--color-primary)',
          color: p.badge === 'New' ? '#1A2B27' : '#fff',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
        }}>{p.badge}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        {/* Provider identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <img
            src={p.avatar} alt=""
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-border-light)', flexShrink: 0 }}
          />
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{p.name}</p>
            <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', marginTop: 2 }}>{p.service}</p>
          </div>
        </div>

        {/* Location + rating row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {p.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarFilled size={13} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)' }}>{p.rating}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>({p.reviews})</span>
          </span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--color-border-light)', margin: '14px 0' }} />

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>{p.price}</span>
          <button style={{
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-full)',
            padding: '8px 18px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.18s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            Buchen
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = () => (
  <section style={{ background: 'var(--color-bg-app)', padding: '80px 0' }}>
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 var(--space-6)' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        marginBottom: 36, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-secondary)', marginBottom: 6 }}>Featured</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-primary)', margin: 0 }}>
            Top Providers Near You
          </h2>
          <p style={{ marginTop: 8, fontSize: 15, color: 'var(--color-text-secondary)' }}>
            Hand-picked, highly rated beauty professionals.
          </p>
        </div>
        <Link to="/providers" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 14, fontWeight: 600, color: 'var(--color-primary)',
          textDecoration: 'none',
          border: '1.5px solid var(--color-primary)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 18px',
          transition: 'all 0.18s',
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
        >
          View All <ArrowRight />
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }} className="providers-grid">
        {FEATURED.map((p) => <ProviderCard key={p.name} p={p} />)}
      </div>
    </div>
    <style>{`
      @media (max-width: 900px) { .providers-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      @media (max-width: 560px) { .providers-grid { grid-template-columns: 1fr !important; } }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   PROVIDER CTA
───────────────────────────────────────────────────────────────── */
const ProviderCTA = () => (
  <section style={{
    background: 'linear-gradient(135deg, #024139 0%, #02503f 50%, #015040 100%)',
    padding: '96px 0',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* Decorative circles */}
    <div aria-hidden style={{
      position: 'absolute', top: -80, right: -80,
      width: 400, height: 400, borderRadius: '50%',
      background: 'rgba(73,169,108,0.12)',
      pointerEvents: 'none',
    }} />
    <div aria-hidden style={{
      position: 'absolute', bottom: -60, left: 80,
      width: 260, height: 260, borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
      pointerEvents: 'none',
    }} />

    <div style={{
      maxWidth: 1440, margin: '0 auto', padding: '0 var(--space-6)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'center',
    }} className="provider-cta-grid">
      {/* Left copy */}
      <div>
        <p style={{
          fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--color-secondary)',
          marginBottom: 12,
        }}>For Professionals</p>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: 700, letterSpacing: '-0.025em',
          color: '#fff', margin: '0 0 20px', lineHeight: 1.15,
        }}>
          Grow your beauty business with Edenly
        </h2>
        <p style={{
          fontSize: 15.5, color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.7, marginBottom: 36, maxWidth: 440,
        }}>
          Join thousands of Black beauty professionals across Germany.
          Manage bookings, reach new clients, and build your brand — all in one place.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            background: '#fff', color: 'var(--color-primary)',
            padding: '13px 28px', borderRadius: 'var(--radius-full)',
            fontWeight: 700, fontSize: 15, textDecoration: 'none',
            transition: 'all 0.18s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-secondary)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          >
            <span style={{ display:'flex', alignItems:'center', gap:8 }}>Kostenlos starten <ArrowRight /></span>
          </Link>
          <Link to="/contact" style={{
            color: 'rgba(255,255,255,0.8)', border: '1.5px solid rgba(255,255,255,0.3)',
            padding: '13px 28px', borderRadius: 'var(--radius-full)',
            fontWeight: 600, fontSize: 15, textDecoration: 'none',
            transition: 'all 0.18s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            Mehr erfahren
          </Link>
        </div>
      </div>

      {/* Right: benefits list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {[
          { icon: <CalendarIcon />,    title: 'Smart Booking System', desc: 'Online booking 24/7 — clients book while you sleep.' },
          { icon: <MegaphoneIcon />,   title: 'Reach New Clients',    desc: 'Get discovered by thousands of customers searching for your services.' },
          { icon: <CreditCardIcon />,  title: 'Integrated Payments',  desc: 'Get paid instantly and securely, every time.' },
          { icon: <StarOutlineIcon />, title: 'Build Your Reputation', desc: 'Collect reviews and showcase your work to grow trust.' },
        ].map((b) => (
          <div key={b.title} style={{
            display: 'flex', gap: 16, alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'rgba(73,169,108,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-secondary)', flexShrink: 0,
            }}>{b.icon}</div>
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: 14.5, marginBottom: 3 }}>{b.title}</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 860px) { .provider-cta-grid { grid-template-columns: 1fr !important; gap: 48px !important; } }
    `}</style>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   PAGE ASSEMBLY
───────────────────────────────────────────────────────────────── */
const HomePage = () => (
  <AppLayout fullWidth>
    <Hero />
    <CategoriesSection />
    <HowItWorks />
    <FeaturedSection />
    <StatsStrip />
    <ProviderCTA />
  </AppLayout>
);

export default HomePage;
