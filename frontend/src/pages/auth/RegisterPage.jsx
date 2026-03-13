import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/common/FormField';
import PasswordInput from '../../components/common/PasswordInput';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { register as registerApi } from '../../services/authService';

const RoleCard = ({ value, selected, onSelect, icon, title, desc }) => (
  <button
    type="button" onClick={() => onSelect(value)}
    style={{
      flex: 1,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-md)',
      background: selected ? 'rgba(2,65,57,0.05)' : 'var(--color-bg-card)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      boxShadow: selected ? '0 0 0 3px rgba(2,65,57,0.08)' : 'none',
    }}
  >
    <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
    <div style={{ textAlign: 'left' }}>
      <p style={{ fontWeight: 600, color: selected ? 'var(--color-primary)' : 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.2 }}>{title}</p>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4, marginTop: 2 }}>{desc}</p>
    </div>
  </button>
);

const Checkbox = ({ name, checked, onChange, error, children }) => (
  <label style={{
    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
    cursor: 'pointer',
  }}>
    <div style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
      <input
        type="checkbox" name={name} checked={checked} onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 18, height: 18, cursor: 'pointer', margin: 0 }}
      />
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        border: `2px solid ${error ? 'var(--color-error)' : checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: checked ? 'var(--color-primary)' : 'var(--color-bg-card)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all var(--transition-fast)',
        pointerEvents: 'none',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
    <div>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {children}
      </span>
      {error && (
        <p style={{ fontSize: 11, color: 'var(--color-error)', marginTop: 2 }}>{error}</p>
      )}
    </div>
  </label>
);

const RegisterPage = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm: '',
    role: 'customer',
    // GDPR consents
    consent_terms: false, consent_privacy: false, consent_provider_legal: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  const isProvider = form.role === 'provider';

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim())  e.last_name  = 'Last name is required';
    if (!form.email)             e.email      = 'Email is required';
    if (!form.password)          e.password   = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';

    if (isProvider) {
      if (!form.consent_provider_legal) e.consent_provider_legal = 'This declaration is required';
    }

    if (!form.consent_terms)   e.consent_terms   = 'You must accept the Terms of Service';
    if (!form.consent_privacy) e.consent_privacy = 'You must accept the Privacy Policy';

    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };

  const handleRoleChange = (role) => {
    setForm((p) => ({ ...p, role }));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name:  form.last_name.trim(),
        email:      form.email.trim(),
        password:   form.password,
        role:       form.role,
        consents: {
          terms:          form.consent_terms,
          privacy:        form.consent_privacy,
          provider_legal: isProvider ? form.consent_provider_legal : false,
        },
      };

      const { data } = await registerApi(payload);
      login(data.accessToken, data.user);
      navigate(form.role === 'provider' ? '/onboarding' : '/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join Edenly — it's free to get started.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {apiError && <Alert type="error" message={apiError} />}

        {/* Role selector */}
        <div>
          <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>I want to…</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <RoleCard value="customer" selected={form.role === 'customer'} onSelect={handleRoleChange}
              icon="👤" title="Book Services" desc="Discover and book top beauty & wellness providers." />
            <RoleCard value="provider" selected={form.role === 'provider'} onSelect={handleRoleChange}
              icon="✂️" title="Offer Services" desc="Grow your business and manage bookings online." />
          </div>
        </div>

        {/* Full name */}
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <FormField label="First name" error={errors.first_name} required style={{ flex: 1 }}>
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange}
              placeholder="Jane" autoComplete="given-name"
              style={errors.first_name ? { borderColor: 'var(--color-error)' } : {}} />
          </FormField>
          <FormField label="Last name" error={errors.last_name} required style={{ flex: 1 }}>
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange}
              placeholder="Smith" autoComplete="family-name"
              style={errors.last_name ? { borderColor: 'var(--color-error)' } : {}} />
          </FormField>
        </div>

        {/* Email */}
        <FormField label="Email address" error={errors.email} required>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" autoComplete="email"
            style={errors.email ? { borderColor: 'var(--color-error)' } : {}} />
        </FormField>

        {/* Password */}
        <FormField label="Password" error={errors.password} hint="At least 8 characters" required>
          <PasswordInput name="password" value={form.password} onChange={handleChange}
            placeholder="Create a password" autoComplete="new-password" />
        </FormField>

        <FormField label="Confirm password" error={errors.confirm} required>
          <PasswordInput name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="Repeat your password" autoComplete="new-password" />
        </FormField>

        {/* GDPR Consent section */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 10,
          padding: '12px 14px',
          background: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-light)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Required agreements
          </p>

          <Checkbox name="consent_terms" checked={form.consent_terms} onChange={handleChange} error={errors.consent_terms}>
            I agree to the{' '}
            <Link to="/terms" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terms of Service</Link>
            {' '}*
          </Checkbox>

          <Checkbox name="consent_privacy" checked={form.consent_privacy} onChange={handleChange} error={errors.consent_privacy}>
            I agree to the{' '}
            <Link to="/privacy" target="_blank" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Privacy Policy</Link>
            {' '}and consent to the processing of my personal data in accordance with the GDPR *
          </Checkbox>

          {isProvider && (
            <Checkbox name="consent_provider_legal" checked={form.consent_provider_legal} onChange={handleChange} error={errors.consent_provider_legal}>
              I confirm that I am legally entitled to offer the listed services and that I am solely responsible for complying with all applicable tax, licensing, and business regulations in my jurisdiction *
            </Checkbox>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : `Create ${isProvider ? 'Provider' : ''} Account`}
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          * Required fields
        </p>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
