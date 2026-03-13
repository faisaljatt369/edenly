const StepIndicator = ({ steps, current }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 'var(--space-8)' }}>
    {steps.map((label, i) => {
      const num     = i + 1;
      const done    = num < current;
      const active  = num === current;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          {/* Circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 'var(--font-size-sm)',
              background: done ? 'var(--color-secondary)' : active ? 'var(--color-primary)' : 'var(--color-bg-muted)',
              color: done || active ? '#fff' : 'var(--color-text-muted)',
              border: active ? '2px solid var(--color-primary)' : 'none',
              transition: 'all 0.2s',
            }}>
              {done ? '✓' : num}
            </div>
            <span style={{
              fontSize: 'var(--font-size-xs)', fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-primary)' : done ? 'var(--color-secondary)' : 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          </div>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: '0 8px', marginBottom: 22,
              background: done ? 'var(--color-secondary)' : 'var(--color-border)',
              transition: 'background 0.3s',
            }} />
          )}
        </div>
      );
    })}
  </div>
);

export default StepIndicator;
