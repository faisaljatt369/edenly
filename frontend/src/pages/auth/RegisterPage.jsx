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
      flex: 1, padding: 'var(--space-5)', border: `2px solid`,
      borderColor: selected ? 'var(--color-primary)' : 'var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      background: selected ? 'rgba(2,65,57,0.04)' : 'var(--color-bg-card)',
      cursor: 'pointer', textAlign: 'left',
      transition: 'all var(--transition-base)',
    }}
  >
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: 'var(--font-size-sm)', marginBottom: 4 }}>{title}</p>
    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{desc}</p>
    {selected && (
      <div style={{ marginTop: 8 }}>
        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Selected</span>
      </div>
    )}
  </button>
);

const RegisterPage = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm]   = useState({ first_name: '', last_name: '', email: '', password: '', confirm: '', role: 'customer' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim())  e.last_name  = 'Last name is required';
    if (!form.email)             e.email      = 'Email is required';
    if (!form.password)          e.password   = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      const { data } = await registerApi({
        first_name: form.first_name.trim(),
        last_name:  form.last_name.trim(),
        email:      form.email.trim(),
        password:   form.password,
        role:       form.role,
      });
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
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {apiError && <Alert type="error" message={apiError} />}

        {/* Role selector */}
        <div>
          <label className="form-label" style={{ display: 'block', marginBottom: 'var(--space-3)' }}>I want to…</label>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <RoleCard value="customer" selected={form.role === 'customer'} onSelect={(v) => setForm((p) => ({ ...p, role: v }))}
              icon="👤" title="Book Services" desc="Discover and book top beauty & wellness providers." />
            <RoleCard value="provider" selected={form.role === 'provider'} onSelect={(v) => setForm((p) => ({ ...p, role: v }))}
              icon="✂️" title="Offer Services" desc="Grow your business and manage bookings online." />
          </div>
        </div>

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

        <FormField label="Email address" error={errors.email} required>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" autoComplete="email"
            style={errors.email ? { borderColor: 'var(--color-error)' } : {}} />
        </FormField>

        <FormField label="Password" error={errors.password} hint="At least 8 characters" required>
          <PasswordInput name="password" value={form.password} onChange={handleChange}
            placeholder="Create a password" autoComplete="new-password" />
        </FormField>

        <FormField label="Confirm password" error={errors.confirm} required>
          <PasswordInput name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="Repeat your password" autoComplete="new-password" />
        </FormField>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : `Create ${form.role === 'provider' ? 'Provider' : ''} Account`}
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={{ color: 'var(--color-primary)' }}>Terms</Link> and{' '}
          <Link to="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
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
