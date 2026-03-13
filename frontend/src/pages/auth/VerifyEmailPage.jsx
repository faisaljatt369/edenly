import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { verifyEmail } from '../../services/authService';

const VerifyEmailPage = () => {
  const [params]  = useSearchParams();
  const token     = params.get('token') || '';
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return; }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <AuthLayout title="Email verification" subtitle="Verifying your email address…">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'center' }}>
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            <LoadingSpinner size={40} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Verifying your email…</p>
          </div>
        )}
        {status === 'success' && (
          <>
            <div style={{
              width: 72, height: 72, margin: '0 auto',
              background: 'rgba(39,174,96,0.1)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            }}>✅</div>
            <Alert type="success" message="Your email has been verified successfully! You can now sign in." />
            <Link to="/login" className="btn btn-primary btn-block btn-lg">Sign in</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <Alert type="error" message={message} />
            <Link to="/login" className="btn btn-outline btn-block">Back to Sign in</Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
