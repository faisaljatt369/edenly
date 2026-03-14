import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/common/FormField';
import PasswordInput from '../../components/common/PasswordInput';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi } from '../../services/authService';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password)        e.password = 'Password is required';
    return e;
  };

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors((p) => ({ ...p, [name]: '' }));
    setApiError('');
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setLoading(true);
    try {
      const { data } = await loginApi({ email: form.email.trim(), password: form.password });
      login(data.accessToken, data.user);

      // Redirect: back to attempted page → onboarding (incomplete provider) → dashboard
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === 'provider' && data.providerProfile && !data.providerProfile.is_onboarding_complete) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your Edenly account.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {apiError && <Alert type="error" message={apiError} />}

        {/* Email */}
        <FormField label="Email address" error={errors.email} required>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" autoComplete="email" autoFocus
            style={errors.email ? { borderColor: 'var(--color-error)', boxShadow: '0 0 0 3px rgba(235,87,87,0.1)' } : {}}
          />
        </FormField>

        {/* Password */}
        <FormField label="Password" error={errors.password} required>
          <PasswordInput
            name="password" value={form.password} onChange={handleChange}
            placeholder="Your password" autoComplete="current-password"
            style={errors.password ? { boxShadow: '0 0 0 3px rgba(235,87,87,0.1)' } : {}}
          />
        </FormField>

        {/* Remember me + Forgot password */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input
                type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
                style={{ position: 'absolute', opacity: 0, width: 16, height: 16, cursor: 'pointer', margin: 0 }}
              />
              <div style={{
                width: 16, height: 16, borderRadius: 4,
                border: `2px solid ${form.remember ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: form.remember ? 'var(--color-primary)' : 'var(--color-bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all var(--transition-fast)',
                pointerEvents: 'none',
              }}>
                {form.remember && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
              Remember me
            </span>
          </label>

          <Link to="/forgot-password" style={{
            fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)',
            fontWeight: 600, textDecoration: 'none',
          }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={loading}
          style={{ marginTop: 4 }}
        >
          {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Sign in'}
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          color: 'var(--color-border)', fontSize: 12,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
