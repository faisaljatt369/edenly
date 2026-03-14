/**
 * FormField — label + children (input slot) + optional hint + error message
 *
 * Usage:
 *   <FormField label="Email" error={errors.email} required hint="We'll never share it">
 *     <input type="email" ... />
 *   </FormField>
 */
const FormField = ({ label, error, hint, required, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && (
      <label style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        {label}
        {required && (
          <span style={{ color: 'var(--color-error)', fontWeight: 700, lineHeight: 1 }}>*</span>
        )}
      </label>
    )}

    {/* Input slot — children inherit full width via CSS */}
    <div style={{ position: 'relative' }}>
      {children}
    </div>

    {/* Hint (only shown when no error) */}
    {hint && !error && (
      <p style={{
        fontSize: 11,
        color: 'var(--color-text-muted)',
        lineHeight: 1.5,
      }}>
        {hint}
      </p>
    )}

    {/* Error message */}
    {error && (
      <p style={{
        fontSize: 11,
        color: 'var(--color-error)',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="6" cy="6" r="5.5" stroke="var(--color-error)" strokeWidth="1" />
          <path d="M6 3.5v3" stroke="var(--color-error)" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="6" cy="8.5" r="0.6" fill="var(--color-error)" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default FormField;
