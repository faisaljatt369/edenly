const variants = {
  error:   { bg: 'rgba(235,87,87,0.08)',   border: '#EB5757', color: '#C0392B', icon: '✕' },
  success: { bg: 'rgba(39,174,96,0.08)',   border: '#27AE60', color: '#1A7A40', icon: '✓' },
  info:    { bg: 'rgba(2,65,57,0.06)',      border: '#024139', color: '#024139', icon: 'ℹ' },
  warning: { bg: 'rgba(242,201,76,0.12)',  border: '#F2C94C', color: '#9A7C00', icon: '⚠' },
};

const Alert = ({ type = 'error', message, style = {} }) => {
  if (!message) return null;
  const v = variants[type] || variants.error;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '12px 16px',
      background: v.bg, border: `1.5px solid ${v.border}`,
      borderRadius: 'var(--radius-md)', color: v.color,
      fontSize: 'var(--font-size-sm)', lineHeight: 1.5,
      ...style,
    }}>
      <span style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '1px', flexShrink: 0 }}>{v.icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
