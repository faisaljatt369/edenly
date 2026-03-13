const Logo = ({ size = 32, showText = true, light = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
    {/* Logomark */}
    <div style={{
      width: size, height: size,
      background: light ? 'rgba(255,255,255,0.2)' : 'var(--gradient-brand)',
      borderRadius: Math.round(size * 0.28),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
        <path d="M10 2C6 2 3 5.5 3 10s3 8 7 8 7-3.5 7-8-3-8-7-8z" fill={light ? '#fff' : '#fff'} fillOpacity="0.9"/>
        <path d="M10 6c0 0-1.5 2-1.5 4s1.5 4 1.5 4" stroke={light ? 'rgba(255,255,255,0.5)' : 'rgba(2,65,57,0.3)'} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    {showText && (
      <span style={{
        fontWeight: 700,
        fontSize: size * 0.56,
        color: light ? '#ffffff' : 'var(--color-primary)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}>
        Edenly
      </span>
    )}
  </div>
);

export default Logo;
