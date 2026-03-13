const LoadingSpinner = ({ fullPage = false, size = 24, color = 'var(--color-primary)' }) => {
  const spinner = (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-bg-app)',
      }}>
        {spinner}
      </div>
    );
  }
  return spinner;
};

export default LoadingSpinner;
