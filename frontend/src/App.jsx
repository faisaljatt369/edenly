import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth pages
import LoginPage           from './pages/auth/LoginPage';
import RegisterPage        from './pages/auth/RegisterPage';
import ForgotPasswordPage  from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage   from './pages/auth/ResetPasswordPage';
import VerifyEmailPage     from './pages/auth/VerifyEmailPage';

// Onboarding
import ProviderOnboardingPage from './pages/onboarding/ProviderOnboardingPage';

// Error pages
import NotFoundPage     from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';

// Dashboard (Phase 1 placeholder)
import DashboardPage from './pages/DashboardPage';

// Contact & Legal
import ContactPage      from './pages/ContactPage';
import PrivacyPage      from './pages/legal/PrivacyPage';
import TermsPage        from './pages/legal/TermsPage';
import CancellationPage from './pages/legal/CancellationPage';
import ImpressumPage    from './pages/legal/ImpressumPage';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ── Public auth routes ── */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />
      <Route path="/verify-email"    element={<VerifyEmailPage />} />

      {/* ── Protected routes ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute roles={['provider']}><ProviderOnboardingPage /></ProtectedRoute>
      } />

      {/* ── Public pages ── */}
      <Route path="/contact"      element={<ContactPage />} />
      <Route path="/privacy"      element={<PrivacyPage />} />
      <Route path="/terms"        element={<TermsPage />} />
      <Route path="/cancellation" element={<CancellationPage />} />
      <Route path="/impressum"    element={<ImpressumPage />} />

      {/* ── Error pages ── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ── Root redirect ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
