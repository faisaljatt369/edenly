const FormField = ({ label, error, hint, children, required, style = {} }) => (
  <div className="form-group" style={style}>
    {label && (
      <label className="form-label">
        {label}{required && <span style={{ color: 'var(--color-error)', marginLeft: 3 }}>*</span>}
      </label>
    )}
    {children}
    {hint && !error && (
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 4 }}>{hint}</p>
    )}
    {error && (
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)', marginTop: 4 }}>{error}</p>
    )}
  </div>
);

export default FormField;
