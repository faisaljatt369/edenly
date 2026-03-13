import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import SocialIcons from '../common/SocialIcons';

const FooterSection = ({ title, links }) => (
  <div>
    <p style={{
      fontSize: 'var(--font-size-xs)', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      color: 'rgba(255,255,255,0.5)', marginBottom: 'var(--space-4)',
    }}>{title}</p>
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {links.map(({ label, to, href }) => (
        <li key={label}>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none', transition: 'color var(--transition-fast)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
            >{label}</a>
          ) : (
            <Link to={to} style={{
              fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none', transition: 'color var(--transition-fast)',
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
            >{label}</Link>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: 'var(--color-primary)',
      color: '#fff',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* ── Main footer grid ── */}
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: 'var(--space-12) var(--space-6) var(--space-8)',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 'var(--space-10)',
      }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <Logo size={36} light showText />
          <p style={{
            marginTop: 'var(--space-4)', marginBottom: 'var(--space-6)',
            fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7, maxWidth: 280,
          }}>
            The modern marketplace connecting customers with top-rated beauty &
            wellness providers across Germany.
          </p>
          <SocialIcons size={36} light gap={8} />
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <a href="mailto:hello@edenly.de" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              hello@edenly.de
            </a>
            <a href="tel:+4930000000" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.65)',
              textDecoration: 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +49 30 000 000 00
            </a>
          </div>
        </div>

        <FooterSection title="Platform" links={[
          { label: 'Find Providers',     to: '/providers' },
          { label: 'Become a Provider',  to: '/register' },
          { label: 'How It Works',       to: '/how-it-works' },
          { label: 'Pricing & Plans',    to: '/pricing' },
        ]} />

        <FooterSection title="Company" links={[
          { label: 'About Edenly',  to: '/about' },
          { label: 'Contact Us',    to: '/contact' },
          { label: 'Careers',       to: '/careers' },
          { label: 'Blog',          to: '/blog' },
        ]} />

        <FooterSection title="Legal" links={[
          { label: 'Privacy Policy',       to: '/privacy' },
          { label: 'Terms of Service',     to: '/terms' },
          { label: 'Cancellation Policy',  to: '/cancellation' },
          { label: 'Impressum',            to: '/impressum' },
        ]} />
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', maxWidth: 1440, margin: '0 auto' }} />

      {/* ── Bottom bar ── */}
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: 'var(--space-5) var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 'var(--space-3)',
      }}>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.4)' }}>
          © {year} Edenly GmbH · All rights reserved · Made with 💚 in Germany
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            {[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Impressum', to: '/impressum' },
            ].map(({ label, to }) => (
              <Link key={to} to={to} style={{
                fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none', transition: 'color var(--transition-fast)',
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >{label}</Link>
            ))}
          </div>
          {/* Language switcher placeholder */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-sm)',
            padding: '4px 10px', cursor: 'pointer',
          }}>
            🌐 EN / DE
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: var(--space-8) !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
