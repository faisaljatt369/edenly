import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import StepIndicator from '../../components/common/StepIndicator';
import FormField from '../../components/common/FormField';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const STEPS = ['Business', 'Location', 'Services', 'Preview'];

// ── Step 1 ─────────────────────────────────────────────────────────────────
const Step1 = ({ data, onChange, categories }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
    <FormField label="Business name" required>
      <input type="text" name="business_name" value={data.business_name}
        onChange={onChange} placeholder="e.g. Jane's Hair Studio" autoFocus />
    </FormField>
    <FormField label="Category" required>
      <select name="category_id" value={data.category_id} onChange={onChange}>
        <option value="">Select a category…</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </FormField>
    <FormField label="Description" hint="Tell customers what makes your business special">
      <textarea name="description" value={data.description} onChange={onChange}
        placeholder="Describe your services, experience, and style…" rows={4} />
    </FormField>
  </div>
);

// ── Step 2 ─────────────────────────────────────────────────────────────────
const Step2 = ({ data, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
    <FormField label="Street address">
      <input type="text" name="address" value={data.address} onChange={onChange} placeholder="e.g. Musterstraße 42" />
    </FormField>
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <FormField label="City" required style={{ flex: 2 }}>
        <input type="text" name="city" value={data.city} onChange={onChange} placeholder="Berlin" />
      </FormField>
      <FormField label="Postal code" required style={{ flex: 1 }}>
        <input type="text" name="postal_code" value={data.postal_code} onChange={onChange} placeholder="10115" />
      </FormField>
    </div>
    <FormField label="Country">
      <select name="country" value={data.country} onChange={onChange}>
        <option value="Germany">Germany</option>
        <option value="Austria">Austria</option>
        <option value="Switzerland">Switzerland</option>
        <option value="Other">Other</option>
      </select>
    </FormField>
  </div>
);

// ── Step 3 ─────────────────────────────────────────────────────────────────
const Step3 = () => (
  <div style={{
    textAlign: 'center', padding: 'var(--space-10) 0',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)',
  }}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'rgba(73,169,108,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
    }}>✂️</div>
    <h3 style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>Services & Pricing</h3>
    <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 360, fontSize: 'var(--font-size-sm)' }}>
      Services and pricing will be configured in <strong>Phase 2</strong>.
      You can add all your services, durations, and prices once your profile is live.
    </p>
    <span className="badge badge-secondary">Coming in Phase 2</span>
  </div>
);

// ── Step 4 Preview ──────────────────────────────────────────────────────────
const Step4 = ({ data, categories }) => {
  const cat = categories.find((c) => String(c.id) === String(data.category_id));
  const Row = ({ label, value }) => value ? (
    <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)' }}>
      <span style={{ width: 120, flexShrink: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  ) : null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Alert type="info" message="Review your information before submitting. You can always edit these later from your dashboard." />
      <div className="card card-sm">
        <Row label="Business"    value={data.business_name} />
        <Row label="Category"    value={cat?.name} />
        <Row label="Description" value={data.description} />
        <Row label="Address"     value={data.address} />
        <Row label="City"        value={`${data.city}${data.postal_code ? ', ' + data.postal_code : ''}`} />
        <Row label="Country"     value={data.country} />
      </div>
    </div>
  );
};

// ── Main Wizard ─────────────────────────────────────────────────────────────
const ProviderOnboardingPage = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const [step, setStep]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    business_name: '', category_id: '', description: '',
    address: '', city: '', postal_code: '', country: 'Germany',
  });

  // Load categories + resume onboarding step
  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || []));
    api.get('/providers/onboarding').then(({ data }) => {
      const p = data.profile;
      if (p) {
        setStep(p.onboarding_step || 1);
        setForm({
          business_name: p.business_name || '',
          category_id:   p.category_id   || '',
          description:   p.description   || '',
          address:       p.address       || '',
          city:          p.city          || '',
          postal_code:   p.postal_code   || '',
          country:       p.country       || 'Germany',
        });
      }
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleNext = async () => {
    setError('');
    setLoading(true);
    try {
      if (step === 1) {
        if (!form.business_name || !form.category_id) { setError('Business name and category are required.'); return; }
        await api.post('/providers/onboarding/1', { business_name: form.business_name, category_id: Number(form.category_id), description: form.description });
      } else if (step === 2) {
        if (!form.city || !form.postal_code) { setError('City and postal code are required.'); return; }
        await api.post('/providers/onboarding/2', { address: form.address, city: form.city, postal_code: form.postal_code, country: form.country });
      } else if (step === 3) {
        await api.post('/providers/onboarding/3');
      }
      setStep((s) => s + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await api.post('/providers/onboarding/complete');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg-app)',
      fontFamily: 'var(--font-sans)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--space-5) var(--space-8)',
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <Logo size={32} />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Hi, {user?.first_name} 👋 — Provider Setup
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'var(--space-10) var(--space-6)',
      }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <StepIndicator steps={STEPS} current={step} />

          <div className="card" style={{ marginTop: 'var(--space-2)' }}>
            <h2 style={{
              fontSize: 'var(--font-size-xl)', fontWeight: 700,
              color: 'var(--color-text-primary)', letterSpacing: '-0.01em',
              marginBottom: 'var(--space-2)',
            }}>
              {{
                1: 'Tell us about your business',
                2: 'Where are you located?',
                3: 'Your services',
                4: 'Preview & submit',
              }[step]}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
              {{
                1: 'Help customers find and trust your business.',
                2: 'Customers nearby will be able to discover you.',
                3: 'You can configure services after setup.',
                4: 'Everything look good? Submit your profile for review.',
              }[step]}
            </p>

            {error && <Alert type="error" message={error} style={{ marginBottom: 'var(--space-5)' }} />}

            {step === 1 && <Step1 data={form} onChange={handleChange} categories={categories} />}
            {step === 2 && <Step2 data={form} onChange={handleChange} />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 data={form} categories={categories} />}

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-outline"
                onClick={() => { setStep((s) => s - 1); setError(''); }}
                disabled={step === 1 || loading}
              >
                ← Back
              </button>
              {step < 4 ? (
                <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
                  {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Continue →'}
                </button>
              ) : (
                <button className="btn btn-secondary btn-lg" onClick={handleComplete} disabled={loading}>
                  {loading ? <LoadingSpinner size={18} color="#fff" /> : '🚀 Submit profile'}
                </button>
              )}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-6)' }}>
            Your progress is saved automatically. You can come back anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderOnboardingPage;
