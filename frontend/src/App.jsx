import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Homepage
import HomePage from './pages/HomePage';

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

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Contact & Legal
import ContactPage      from './pages/ContactPage';
import FAQPage          from './pages/FAQPage';
import PrivacyPage      from './pages/legal/PrivacyPage';
import TermsPage        from './pages/legal/TermsPage';
import CancellationPage from './pages/legal/CancellationPage';
import ImpressumPage    from './pages/legal/ImpressumPage';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ── Homepage ── */}
      <Route path="/" element={<HomePage />} />

      {/* ── Public auth routes ── */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />
      <Route path="/verify-email"    element={<VerifyEmailPage />} />

      {/* ── Protected routes ── */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute roles={['provider']}><ProviderOnboardingPage /></ProtectedRoute>
      } />

      {/* ── Public pages ── */}
      <Route path="/contact"      element={<ContactPage />} />
      <Route path="/faq"          element={<FAQPage />} />
      <Route path="/privacy"      element={<PrivacyPage />} />
      <Route path="/terms"        element={<TermsPage />} />
      <Route path="/cancellation" element={<CancellationPage />} />
      <Route path="/impressum"    element={<ImpressumPage />} />

      {/* ── Error pages ── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
