import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/common/FormField';
import PasswordInput from '../../components/common/PasswordInput';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { resetPassword } from '../../services/authService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token    = params.get('token') || '';

  const [form, setForm]     = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [done,    setDone]      = useState(false);

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This reset link is missing or invalid.">
        <Alert type="error" message="No reset token found. Please request a new password reset." />
        <Link to="/forgot-password" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 'var(--space-5)' }}>
          Request new link
        </Link>
      </AuthLayout>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
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
      await resetPassword(token, form.password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Password updated!" subtitle="Your password has been reset successfully.">
        <Alert type="success" message="All good! Redirecting you to sign in…" />
        <Link to="/login" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 'var(--space-5)' }}>
          Sign in now
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {apiError && <Alert type="error" message={apiError} />}

        <FormField label="New password" error={errors.password} hint="At least 8 characters" required>
          <PasswordInput name="password" value={form.password} onChange={handleChange}
            placeholder="New password" autoComplete="new-password" />
        </FormField>

        <FormField label="Confirm password" error={errors.confirm} required>
          <PasswordInput name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="Repeat new password" autoComplete="new-password" />
        </FormField>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
