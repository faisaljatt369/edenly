const icons = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z"/>
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

const SOCIALS = [
  { key: 'instagram', href: 'https://instagram.com/edenly', label: 'Instagram' },
  { key: 'tiktok',    href: 'https://tiktok.com/@edenly',  label: 'TikTok' },
  { key: 'facebook',  href: 'https://facebook.com/edenly', label: 'Facebook' },
  { key: 'linkedin',  href: 'https://linkedin.com/company/edenly', label: 'LinkedIn' },
  { key: 'twitter',   href: 'https://x.com/edenly',        label: 'X / Twitter' },
];

const SocialIcons = ({ size = 36, light = false, gap = 8 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap }}>
    {SOCIALS.map(({ key, href, label }) => (
      <a
        key={key} href={href} target="_blank" rel="noopener noreferrer"
        aria-label={label}
        style={{
          width: size, height: size,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          background: light ? 'rgba(255,255,255,0.12)' : 'var(--color-bg-muted)',
          color: light ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)',
          transition: 'all var(--transition-base)',
          textDecoration: 'none',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = light ? 'rgba(255,255,255,0.22)' : 'var(--color-primary)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = light ? 'rgba(255,255,255,0.12)' : 'var(--color-bg-muted)';
          e.currentTarget.style.color = light ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {icons[key]}
      </a>
    ))}
  </div>
);

export default SocialIcons;
