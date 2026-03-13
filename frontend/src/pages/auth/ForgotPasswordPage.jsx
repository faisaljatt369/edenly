import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import FormField from '../../components/common/FormField';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { forgotPassword } from '../../services/authService';

const ForgotPasswordPage = () => {
  const [email,    setEmail]    = useState('');
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent a password reset link.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, margin: '0 auto',
            background: 'rgba(39,174,96,0.1)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            ✉️
          </div>
          <Alert type="success" message={`If ${email} is registered, a reset link has been sent. Check your spam folder too.`} />
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            During development, the reset link is printed in the <strong>backend console</strong>.
          </p>
          <Link to="/login" className="btn btn-primary btn-block">Back to Sign in</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {error && <Alert type="error" message={error} />}

        <FormField label="Email address" error={error && email ? '' : undefined} required>
          <input
            type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="you@example.com" autoComplete="email" autoFocus
          />
        </FormField>

        <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Send reset link'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          Remembered it?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
