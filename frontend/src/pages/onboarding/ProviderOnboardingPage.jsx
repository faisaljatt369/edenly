import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import api from '../../services/api';

/* ─────────────────────────────────────────────────────────────────────────────
   Icons
───────────────────────────────────────────────────────────────────────────── */
const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const PlusIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const DAYS = [
  { label: 'Monday',    short: 'Mon', value: 1 },
  { label: 'Tuesday',   short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday',  short: 'Thu', value: 4 },
  { label: 'Friday',    short: 'Fri', value: 5 },
  { label: 'Saturday',  short: 'Sat', value: 6 },
  { label: 'Sunday',    short: 'Sun', value: 0 },
];
const BUFFER_OPTIONS = [
  { label: 'None',   value: 0  },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '60 min', value: 60 },
];
const STEPS = [
  { id: 1,  label: 'Location'      },
  { id: 2,  label: 'Social Media'  },
  { id: 3,  label: 'Categories'    },
  { id: 4,  label: 'Services'      },
  { id: 5,  label: 'Availability'  },
  { id: 6,  label: 'Blocked Times' },
  { id: 7,  label: 'Policies'      },
  { id: 8,  label: 'Payments'      },
  { id: 9,  label: 'About'         },
  { id: 10, label: 'Review'        },
];
const STEP_DESCRIPTIONS = [
  'Where are you based? This helps customers find you.',
  'Add your social media so customers can see your work.',
  'Select all beauty categories that apply to your services.',
  'Add the services you offer. You can always update these later.',
  'Set your working days, hours and buffer time between appointments.',
  'Block dates when you are unavailable — vacations, breaks, etc.',
  'Define your cancellation and deposit policies.',
  'Connect Stripe to receive payouts from your bookings.',
  'Write a short bio to introduce yourself to customers.',
  'Review everything before publishing your profile.',
];

/* ─────────────────────────────────────────────────────────────────────────────
   Shared UI Primitives
───────────────────────────────────────────────────────────────────────────── */
const Field = ({ label, hint, error, required, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
    {label && (
      <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', gap: 3 }}>
        {label}
        {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
    )}
    {children}
    {hint && !error && (
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{hint}</span>
    )}
    {error && (
      <span style={{ fontSize: 11, color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5.5" stroke="var(--color-error)" strokeWidth="1"/><path d="M6 3.5v3" stroke="var(--color-error)" strokeWidth="1.2" strokeLinecap="round"/><circle cx="6" cy="8.5" r=".6" fill="var(--color-error)"/></svg>
        {error}
      </span>
    )}
  </div>
);

const inputStyle = (hasError) => ({
  width: '100%', padding: '10px 14px',
  border: `1.5px solid ${hasError ? 'var(--color-error)' : 'var(--color-border)'}`,
  borderRadius: 'var(--radius-md)', fontSize: 14, fontFamily: 'var(--font-sans)',
  background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
  outline: 'none', boxSizing: 'border-box',
  transition: 'border-color var(--transition-fast)',
  boxShadow: hasError ? '0 0 0 3px rgba(235,87,87,0.08)' : 'none',
});

const Input = ({ error, style, onFocus, onBlur, ...props }) => (
  <input
    {...props}
    style={{ ...inputStyle(!!error), ...style }}
    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = 'var(--shadow-focus)'; onFocus?.(e); }}
    onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(235,87,87,0.08)' : 'none'; onBlur?.(e); }}
  />
);

const Textarea = ({ error, rows = 4, ...props }) => (
  <textarea
    rows={rows} {...props}
    style={{ ...inputStyle(!!error), resize: 'vertical' }}
    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = 'var(--shadow-focus)'; }}
    onBlur={(e)  => { e.target.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)'; e.target.style.boxShadow = 'none'; }}
  />
);

const Select = ({ error, children, ...props }) => (
  <select {...props} style={{ ...inputStyle(!!error), cursor: 'pointer' }}>
    {children}
  </select>
);

/* Step navigation — Back (outline) + optional Skip + Continue (primary) */
const StepNav = ({ onBack, loading, nextLabel = 'Continue', canSkip, onSkip }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    marginTop: 36, paddingTop: 24,
    borderTop: '1px solid var(--color-border-light)',
  }}>
    {onBack ? (
      <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
    ) : <div />}
    <div style={{ flex: 1 }} />
    {canSkip && (
      <button type="button" onClick={onSkip}
        style={{ fontSize: 13, color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
        Skip for now
      </button>
    )}
    <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ minWidth: 140 }}>
      {loading ? <LoadingSpinner size={18} color="#fff" /> : nextLabel}
    </button>
  </div>
);

/* Inline checkbox */
const Checkbox = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
    <div onClick={onChange} style={{
      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
      border: `2px solid ${checked ? 'var(--color-primary)' : 'var(--color-border)'}`,
      background: checked ? 'var(--color-primary)' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    }}>
      {checked && <CheckIcon size={10} />}
    </div>
    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{label}</span>
  </label>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Step 1 – Location
───────────────────────────────────────────────────────────────────────────── */
const StepLocation = ({ data, onSave }) => {
  const [form, setForm] = useState({
    city: data.city || '', address: data.address || '',
    postal_code: data.postal_code || '', country: data.country || 'Germany',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.city.trim())        err.city        = 'City is required';
    if (!form.postal_code.trim()) err.postal_code = 'Postal code is required';
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      await api.put('/providers/onboarding/location', form);
      onSave(form);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 20 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="City" error={errors.city} required>
            <Input value={form.city} onChange={set('city')} placeholder="Berlin" error={errors.city} />
          </Field>
          <Field label="Postal Code" error={errors.postal_code} required>
            <Input value={form.postal_code} onChange={set('postal_code')} placeholder="10115" error={errors.postal_code} />
          </Field>
        </div>
        <Field label="Street Address" hint="Optional — displayed on your public profile">
          <Input value={form.address} onChange={set('address')} placeholder="Musterstraße 12" />
        </Field>
        <Field label="Country">
          <Select value={form.country} onChange={set('country')}>
            <option value="Germany">Germany</option>
            <option value="Austria">Austria</option>
            <option value="Switzerland">Switzerland</option>
          </Select>
        </Field>
      </div>
      <StepNav loading={loading} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 2 – Social Media
───────────────────────────────────────────────────────────────────────────── */
const StepSocial = ({ data, onSave, onBack }) => {
  const [form, setForm]       = useState({ instagram: data.instagram || '', tiktok: data.tiktok || '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/providers/onboarding/social', { instagram: form.instagram || null, tiktok: form.tiktok || null });
      onSave(form);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 20 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Field label="Instagram Handle" hint="Shown on your public profile — helps customers find your work">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 14, pointerEvents: 'none', fontWeight: 500 }}>@</span>
            <Input value={form.instagram} onChange={set('instagram')} placeholder="yourhandle" style={{ paddingLeft: 28 }} />
          </div>
        </Field>
        <Field label="TikTok Handle" hint="Shown on your public profile">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: 14, pointerEvents: 'none', fontWeight: 500 }}>@</span>
            <Input value={form.tiktok} onChange={set('tiktok')} placeholder="yourhandle" style={{ paddingLeft: 28 }} />
          </div>
        </Field>
      </div>
      <StepNav onBack={onBack} loading={loading} canSkip onSkip={() => onSave(form)} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 3 – Categories
───────────────────────────────────────────────────────────────────────────── */
const CATEGORY_ICONS = {
  'hair': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M6 4a6 6 0 0 1 6 6v10M12 10a6 6 0 0 1 6-6"/><path d="M9 20h6"/></svg>),
  'braids': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M12 2v20M7 6c0 0 2 2 5 2s5-2 5-2M7 12c0 0 2 2 5 2s5-2 5-2M7 18c0 0 2 2 5 2s5-2 5-2"/></svg>),
  'nails': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><rect x="8" y="2" width="4" height="10" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/></svg>),
  'lashes': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M2 12c0 0 4-5 10-5s10 5 10 5"/><circle cx="12" cy="12" r="3"/><path d="M8 5l-1-2M12 4V2M16 5l1-2"/></svg>),
  'brows': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M2 10c1-3 4-5 8-5s7 2 8 5"/><path d="M6 13c1-2 3-3 6-3s5 1 6 3"/></svg>),
  'makeup': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M12 2c0 0-6 5-6 11a6 6 0 0 0 12 0c0-6-6-11-6-11z"/><path d="M12 13v5"/></svg>),
  'tooth-gems': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z"/></svg>),
  'laser-hair-removal': (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>),
};

const StepCategories = ({ data, onSave, onBack }) => {
  const [allCats, setAllCats]   = useState([]);
  const [selected, setSelected] = useState(new Set(data.categories || []));
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/categories')
      .then(({ data: d }) => setAllCats(d.categories || []))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected.size) { setError('Please select at least one category'); return; }
    setSaving(true);
    try {
      await api.put('/providers/onboarding/categories', { category_ids: [...selected] });
      onSave({ categories: [...selected] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <LoadingSpinner size={32} />
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
            {allCats.map((cat) => {
              const active = selected.has(cat.id);
              return (
                <button key={cat.id} type="button" onClick={() => toggle(cat.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  background: active ? 'rgba(2,65,57,0.05)' : 'var(--color-bg-card)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  boxShadow: active ? '0 0 0 3px rgba(2,65,57,0.06)' : 'none',
                }}>
                  <span style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)', display: 'flex', flexShrink: 0 }}>
                    {CATEGORY_ICONS[cat.slug] || <PlusIcon />}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: active ? 'var(--color-primary)' : 'var(--color-text-primary)', flex: 1 }}>
                    {cat.name}
                  </span>
                  {active && (
                    <span style={{ color: 'var(--color-primary)', display: 'flex', flexShrink: 0 }}>
                      <CheckIcon size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {selected.size} {selected.size === 1 ? 'category' : 'categories'} selected
          </p>
        </>
      )}
      <StepNav onBack={onBack} loading={saving} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 4 – Services
───────────────────────────────────────────────────────────────────────────── */
const emptyService = () => ({
  _key: `${Date.now()}-${Math.random()}`,
  name: '', category_id: '', price: '', duration: '',
  description: '', is_custom: false, variants: [],
});
const emptyVariant = () => ({
  _key: `${Date.now()}-${Math.random()}`,
  name: '', price: '', duration: '',
});

const ServiceCard = ({ svc, allCats, onChange, onRemove, errors = {} }) => {
  const [open, setOpen] = useState(true);
  const set = (k) => (e) => onChange({ ...svc, [k]: e.target.value });
  const addVariant    = () => onChange({ ...svc, variants: [...svc.variants, emptyVariant()] });
  const removeVariant = (i) => onChange({ ...svc, variants: svc.variants.filter((_, j) => j !== i) });
  const setVariant = (i, k) => (e) => onChange({ ...svc, variants: svc.variants.map((v, j) => j === i ? { ...v, [k]: e.target.value } : v) });

  return (
    <div style={{
      border: `1.5px solid ${errors.name ? 'var(--color-error)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-xl)',
      background: 'var(--color-bg-card)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-xs)',
      transition: 'border-color var(--transition-fast)',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 18px',
          background: 'var(--color-bg-muted)',
          cursor: 'pointer',
          borderBottom: open ? '1px solid var(--color-border-light)' : 'none',
        }}
      >
        <span style={{ color: 'var(--color-text-muted)', display: 'flex', transition: 'transform var(--transition-fast)', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
          <ChevronIcon open={open} />
        </span>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-primary)', flex: 1 }}>
          {svc.name || 'New Service'}
        </span>
        {svc.is_custom && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
            color: '#92400e', background: 'rgba(217,119,6,0.1)',
            borderRadius: 'var(--radius-full)', padding: '3px 9px',
          }}>
            Pending approval
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            color: 'var(--color-text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', padding: 4, borderRadius: 6,
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          <TrashIcon />
        </button>
      </div>

      {open && (
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Name + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <Field label="Service Name" required error={errors.name}>
              <Input value={svc.name} onChange={set('name')} placeholder="e.g. Box Braids" error={errors.name} />
            </Field>
            <Field label="Category">
              <Select value={svc.category_id} onChange={set('category_id')}>
                <option value="">— Select —</option>
                {allCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
          </div>

          {/* Price + Duration (only if no variants) */}
          {!svc.variants.length && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Price (€)" hint="Leave blank if price varies by variant">
                <Input type="number" min="0" step="0.01" value={svc.price} onChange={set('price')} placeholder="e.g. 80" />
              </Field>
              <Field label="Duration (min)" hint="Estimated appointment length">
                <Input type="number" min="0" step="5" value={svc.duration} onChange={set('duration')} placeholder="e.g. 180" />
              </Field>
            </div>
          )}

          {/* Description */}
          <Field label="Description" hint="Optional — briefly describe this service">
            <Textarea value={svc.description} onChange={set('description')} rows={2} placeholder="Short description…" />
          </Field>

          {/* Variants */}
          {svc.variants.length > 0 && (
            <div>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 10,
              }}>
                Variants
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {svc.variants.map((v, i) => (
                  <div key={v._key || i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                    <Field label={i === 0 ? 'Name' : undefined}>
                      <Input value={v.name} onChange={setVariant(i, 'name')} placeholder="e.g. Short" />
                    </Field>
                    <Field label={i === 0 ? 'Price (€)' : undefined}>
                      <Input type="number" min="0" value={v.price} onChange={setVariant(i, 'price')} placeholder="0" />
                    </Field>
                    <Field label={i === 0 ? 'Duration (min)' : undefined}>
                      <Input type="number" min="0" value={v.duration} onChange={setVariant(i, 'duration')} placeholder="60" />
                    </Field>
                    <button type="button" onClick={() => removeVariant(i)} style={{
                      color: 'var(--color-text-muted)', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', paddingBottom: i === 0 ? 10 : 0,
                      transition: 'color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                      <TrashIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Variant */}
          <button type="button" onClick={addVariant} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 600, color: 'var(--color-primary)',
            background: 'rgba(2,65,57,0.05)',
            border: '1.5px dashed rgba(2,65,57,0.25)',
            borderRadius: 'var(--radius-md)', padding: '7px 14px',
            cursor: 'pointer', alignSelf: 'start',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.05)'}>
            <PlusIcon size={12} /> Add Variant
          </button>
        </div>
      )}
    </div>
  );
};

const StepServices = ({ data, onSave, onBack }) => {
  const [allCats, setAllCats]   = useState([]);
  const [services, setServices] = useState(
    (data.services || []).length
      ? data.services.map((s) => ({ ...s, _key: s.id || `${Date.now()}-${Math.random()}`, variants: s.variants || [] }))
      : [emptyService()]
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving]           = useState(false);
  const [apiError, setApiError]       = useState('');

  useEffect(() => {
    api.get('/categories').then(({ data: d }) => setAllCats(d.categories || []));
  }, []);

  const addService    = (custom = false) => setServices((p) => [...p, { ...emptyService(), is_custom: custom }]);
  const removeService = (i)              => setServices((p) => p.filter((_, j) => j !== i));
  const updateService = (i) => (updated) => {
    setServices((p) => p.map((s, j) => j === i ? updated : s));
    if (fieldErrors[i]?.name && updated.name.trim()) {
      setFieldErrors((p) => { const n = { ...p }; delete n[i]; return n; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Per-service validation
    const errs = {};
    services.forEach((s, i) => {
      if (!s.name.trim()) errs[i] = { name: 'Service name is required' };
    });
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    const named = services.filter((s) => s.name.trim());
    if (!named.length) { setApiError('Add at least one service'); return; }

    setSaving(true);
    try {
      await api.put('/providers/onboarding/services', { services: named });
      onSave({ services: named });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 16 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {services.map((svc, i) => (
          <ServiceCard
            key={svc._key} svc={svc} allCats={allCats}
            errors={fieldErrors[i] || {}}
            onChange={updateService(i)}
            onRemove={() => removeService(i)}
          />
        ))}
      </div>

      {/* Add service buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" onClick={() => addService(false)} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
          background: 'rgba(2,65,57,0.04)',
          border: '1.5px dashed rgba(2,65,57,0.25)',
          borderRadius: 'var(--radius-lg)', padding: '11px 16px',
          cursor: 'pointer', transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.09)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.04)'}>
          <PlusIcon /> Add Service
        </button>
        <button type="button" onClick={() => addService(true)} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontSize: 13, fontWeight: 600, color: '#92400e',
          background: 'rgba(217,119,6,0.05)',
          border: '1.5px dashed rgba(217,119,6,0.25)',
          borderRadius: 'var(--radius-lg)', padding: '11px 16px',
          cursor: 'pointer', transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(217,119,6,0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(217,119,6,0.05)'}>
          <PlusIcon /> Add Custom Service
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>
        Custom services require admin approval before appearing publicly.
      </p>
      <StepNav onBack={onBack} loading={saving} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 5 – Availability
───────────────────────────────────────────────────────────────────────────── */
const StepAvailability = ({ data, onSave, onBack }) => {
  const initSlots = () => {
    const map = {};
    (data.availability || []).forEach((s) => { map[s.day_of_week] = s; });
    return DAYS.map((d) => ({
      day_of_week: d.value,
      is_active:   map[d.value]?.is_active   ?? (d.value >= 1 && d.value <= 5),
      start_time:  map[d.value]?.start_time?.slice(0, 5) ?? '10:00',
      end_time:    map[d.value]?.end_time?.slice(0, 5)   ?? '19:00',
    }));
  };

  const [slots,      setSlots]      = useState(initSlots);
  const [bufferTime, setBufferTime] = useState(data.profile?.buffer_time ?? 0);
  const [saving,     setSaving]     = useState(false);
  const [apiError,   setApiError]   = useState('');

  const toggleDay = (i) => setSlots((p) => p.map((s, j) => j === i ? { ...s, is_active: !s.is_active } : s));
  const setHour   = (i, k) => (e) => setSlots((p) => p.map((s, j) => j === i ? { ...s, [k]: e.target.value } : s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/providers/onboarding/availability', { buffer_time: bufferTime, availability: slots });
      onSave({ availability: slots, profile: { ...(data.profile || {}), buffer_time: bufferTime } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 20 }} />}

      {/* Buffer time */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
          Buffer time between appointments
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {BUFFER_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setBufferTime(opt.value)} style={{
              padding: '8px 20px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: `1.5px solid ${bufferTime === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: bufferTime === opt.value ? 'rgba(2,65,57,0.07)' : 'var(--color-bg-card)',
              color: bufferTime === opt.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)',
            }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Working hours */}
      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>Working hours</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {slots.map((slot, i) => {
          const day = DAYS.find((d) => d.value === slot.day_of_week);
          return (
            <div key={slot.day_of_week} style={{
              display: 'grid', alignItems: 'center',
              gridTemplateColumns: '120px 1fr', gap: 16,
              padding: '11px 16px',
              border: `1.5px solid ${slot.is_active ? 'rgba(2,65,57,0.18)' : 'var(--color-border-light)'}`,
              borderRadius: 'var(--radius-md)',
              background: slot.is_active ? 'rgba(2,65,57,0.025)' : 'var(--color-bg-muted)',
              transition: 'all var(--transition-fast)',
            }}>
              <Checkbox
                checked={slot.is_active}
                onChange={() => toggleDay(i)}
                label={day?.label}
              />
              {slot.is_active ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="time" value={slot.start_time} onChange={setHour(i, 'start_time')} style={{
                    border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                    padding: '7px 10px', fontSize: 13, outline: 'none',
                    background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }} />
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>–</span>
                  <input type="time" value={slot.end_time} onChange={setHour(i, 'end_time')} style={{
                    border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                    padding: '7px 10px', fontSize: 13, outline: 'none',
                    background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }} />
                </div>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Closed</span>
              )}
            </div>
          );
        })}
      </div>
      <StepNav onBack={onBack} loading={saving} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 6 – Blocked Times
───────────────────────────────────────────────────────────────────────────── */
const emptyBlock = () => ({
  _key: `${Date.now()}-${Math.random()}`,
  date: '', start_time: '', end_time: '', note: '', full_day: true,
});

const StepBlockedTimes = ({ data, onSave, onBack }) => {
  const [blocks, setBlocks]     = useState(
    (data.blocked_times || []).length
      ? data.blocked_times.map((b) => ({ ...b, _key: `${Date.now()}-${Math.random()}`, full_day: !b.start_time }))
      : []
  );
  const [saving,   setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  const add       = () => setBlocks((p) => [...p, emptyBlock()]);
  const remove    = (i) => setBlocks((p) => p.filter((_, j) => j !== i));
  const set       = (i, k) => (e) => setBlocks((p) => p.map((b, j) => j === i ? { ...b, [k]: e.target.value } : b));
  const toggleFull = (i) => setBlocks((p) => p.map((b, j) => j === i ? { ...b, full_day: !b.full_day, start_time: '', end_time: '' } : b));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = blocks.filter((b) => b.date).map((b) => ({
        date: b.date, note: b.note || null,
        start_time: b.full_day ? null : b.start_time || null,
        end_time:   b.full_day ? null : b.end_time   || null,
      }));
      await api.put('/providers/onboarding/blocked-times', { blocked_times: payload });
      onSave({ blocked_times: payload });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const timeInputStyle = {
    border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)',
    padding: '10px 12px', fontSize: 14, outline: 'none',
    background: 'var(--color-bg-card)', color: 'var(--color-text-primary)',
    width: '100%', boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 16 }} />}
      {blocks.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '32px 20px',
          background: 'var(--color-bg-muted)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px dashed var(--color-border)',
          color: 'var(--color-text-muted)', fontSize: 14,
          marginBottom: 16,
        }}>
          No blocked times yet.
          <p style={{ fontSize: 12, marginTop: 4 }}>Add vacation days, breaks or personal time off.</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {blocks.map((b, i) => (
          <div key={b._key} style={{
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 18, display: 'flex', flexDirection: 'column', gap: 14,
            background: 'var(--color-bg-card)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'start' }}>
              <Field label="Date" required>
                <Input type="date" value={b.date} onChange={set(i, 'date')} />
              </Field>
              <button type="button" onClick={() => remove(i)} style={{
                color: 'var(--color-text-muted)', background: 'none', border: 'none',
                cursor: 'pointer', paddingTop: 26, display: 'flex',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
                <TrashIcon />
              </button>
            </div>
            <Checkbox checked={b.full_day} onChange={() => toggleFull(i)} label="Full day" />
            {!b.full_day && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
                <Field label="From">
                  <input type="time" value={b.start_time} onChange={set(i, 'start_time')} style={timeInputStyle} />
                </Field>
                <span style={{ paddingBottom: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>–</span>
                <Field label="To">
                  <input type="time" value={b.end_time} onChange={set(i, 'end_time')} style={timeInputStyle} />
                </Field>
              </div>
            )}
            <Field label="Note" hint="Optional — e.g. Vacation, Public holiday">
              <Input value={b.note} onChange={set(i, 'note')} placeholder="e.g. Vacation" />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
        background: 'rgba(2,65,57,0.04)',
        border: '1.5px dashed rgba(2,65,57,0.25)',
        borderRadius: 'var(--radius-lg)', padding: '11px 16px',
        cursor: 'pointer', width: '100%', marginTop: 12,
        transition: 'background var(--transition-fast)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.09)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.04)'}>
        <PlusIcon /> Block a Date
      </button>
      <StepNav onBack={onBack} loading={saving} canSkip onSkip={() => onSave({ blocked_times: [] })} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 7 – Policies
───────────────────────────────────────────────────────────────────────────── */
const StepPolicies = ({ data, onSave, onBack }) => {
  const pp = data.profile || {};
  const [form, setForm]   = useState({
    cancellation_policy: pp.cancellation_policy || '24h',
    deposit_type:        pp.deposit_type        || 'none',
    deposit_value:       pp.deposit_value       || '',
  });
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const setKey = (k) => (v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((p) => ({ ...p, [k]: '' })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (form.deposit_type !== 'none' && !form.deposit_value) {
      err.deposit_value = 'Please enter a deposit amount';
    }
    if (Object.keys(err).length) { setErrors(err); return; }
    setSaving(true);
    try {
      await api.put('/providers/onboarding/policies', {
        cancellation_policy: form.cancellation_policy,
        deposit_type:        form.deposit_type,
        deposit_value:       parseFloat(form.deposit_value) || 0,
      });
      onSave({ policies: form });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const CANCEL_OPTIONS = [
    { v: '24h', label: '24-hour notice', desc: 'Clients can cancel up to 24h before' },
    { v: '72h', label: '72-hour notice', desc: 'Clients can cancel up to 72h before' },
  ];
  const DEPOSIT_OPTIONS = [
    { v: 'none',       label: 'No deposit',   desc: 'Customers pay at the appointment' },
    { v: 'fixed',      label: 'Fixed amount', desc: 'e.g. €20 upfront'                },
    { v: 'percentage', label: 'Percentage',   desc: 'e.g. 30% of service price'        },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 20 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Cancellation */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
            Cancellation Policy
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {CANCEL_OPTIONS.map(({ v, label, desc }) => (
              <button key={v} type="button" onClick={() => setKey('cancellation_policy')(v)} style={{
                flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'left', cursor: 'pointer',
                border: `2px solid ${form.cancellation_policy === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: form.cancellation_policy === v ? 'rgba(2,65,57,0.05)' : 'var(--color-bg-card)',
                boxShadow: form.cancellation_policy === v ? '0 0 0 3px rgba(2,65,57,0.06)' : 'none',
                transition: 'all var(--transition-fast)',
              }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: form.cancellation_policy === v ? 'var(--color-primary)' : 'var(--color-text-primary)', marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Deposit */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
            Booking Deposit
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEPOSIT_OPTIONS.map(({ v, label, desc }) => (
              <button key={v} type="button" onClick={() => setKey('deposit_type')(v)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
                borderRadius: 'var(--radius-md)', textAlign: 'left', cursor: 'pointer',
                border: `1.5px solid ${form.deposit_type === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: form.deposit_type === v ? 'rgba(2,65,57,0.04)' : 'var(--color-bg-card)',
                transition: 'all var(--transition-fast)',
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${form.deposit_type === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: form.deposit_type === v ? 'var(--color-primary)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: form.deposit_type === v ? 'var(--color-primary)' : 'var(--color-text-primary)', marginBottom: 1 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
          {form.deposit_type !== 'none' && (
            <div style={{ marginTop: 14 }}>
              <Field
                label={form.deposit_type === 'fixed' ? 'Deposit amount (€)' : 'Deposit percentage (%)'}
                error={errors.deposit_value}
                required
              >
                <Input
                  type="number" min="0" step={form.deposit_type === 'fixed' ? '0.01' : '1'}
                  max={form.deposit_type === 'percentage' ? '100' : undefined}
                  value={form.deposit_value}
                  onChange={(e) => { setKey('deposit_value')(e.target.value); }}
                  placeholder={form.deposit_type === 'fixed' ? '20' : '30'}
                  error={errors.deposit_value}
                />
              </Field>
            </div>
          )}
        </div>
      </div>
      <StepNav onBack={onBack} loading={saving} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 8 – Payments (Stripe stub)
───────────────────────────────────────────────────────────────────────────── */
const StepPayments = ({ data, onSave, onBack }) => (
  <div>
    <div style={{ textAlign: 'center', padding: '20px 0 28px' }}>
      <div style={{
        width: 68, height: 68, borderRadius: '50%', margin: '0 auto 20px',
        background: 'linear-gradient(135deg, rgba(2,65,57,0.08), rgba(73,169,108,0.12))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(2,65,57,0.1)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', marginBottom: 8, color: 'var(--color-text-primary)' }}>
        Connect Stripe
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 24px' }}>
        To receive payouts, connect your Stripe account. Stripe handles identity verification and tax reporting.
      </p>
      {data.profile?.is_stripe_connected ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(73,169,108,0.1)', border: '1.5px solid rgba(73,169,108,0.3)', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)', fontWeight: 600, fontSize: 13 }}>
          <CheckIcon size={16} /> Stripe connected
        </div>
      ) : (
        <button type="button" disabled style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#635BFF', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'not-allowed', opacity: 0.6 }}>
          Connect with Stripe — Coming Soon
        </button>
      )}
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>
        Stripe integration will be available in a future update.
      </p>
    </div>
    <div style={{ display: 'flex', gap: 12, paddingTop: 24, borderTop: '1px solid var(--color-border-light)' }}>
      <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
      <div style={{ flex: 1 }} />
      <button type="button" onClick={() => onSave({})} className="btn btn-primary btn-lg" style={{ minWidth: 140 }}>Continue</button>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Step 9 – About
───────────────────────────────────────────────────────────────────────────── */
const StepDescription = ({ data, onSave, onBack }) => {
  const pp = data.profile || {};
  const [form, setForm]       = useState({ description: pp.description || '', service_type: pp.service_type || 'studio' });
  const [saving, setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/providers/onboarding/description', form);
      onSave({ profile: { ...pp, ...form } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  const SERVICE_TYPES = [
    { v: 'studio', label: 'Studio', desc: 'Clients come to you'   },
    { v: 'mobile', label: 'Mobile', desc: 'You go to clients'     },
    { v: 'both',   label: 'Both',   desc: 'Studio + mobile'       },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {apiError && <Alert type="error" message={apiError} style={{ marginBottom: 20 }} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Field label="About you & your services" hint="Tell customers what makes you special. Max 600 characters.">
          <Textarea
            value={form.description} onChange={set('description')}
            rows={5} maxLength={600}
            placeholder="Hi, I'm a professional braid artist based in Berlin…"
          />
          <span style={{ fontSize: 11, color: form.description.length > 550 ? 'var(--color-warning)' : 'var(--color-text-muted)', textAlign: 'right' }}>
            {form.description.length}/600
          </span>
        </Field>
        <Field label="Service type">
          <div style={{ display: 'flex', gap: 10 }}>
            {SERVICE_TYPES.map(({ v, label, desc }) => (
              <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, service_type: v }))} style={{
                flex: 1, padding: '13px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${form.service_type === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: form.service_type === v ? 'rgba(2,65,57,0.05)' : 'var(--color-bg-card)',
                boxShadow: form.service_type === v ? '0 0 0 3px rgba(2,65,57,0.06)' : 'none',
                transition: 'all var(--transition-fast)',
              }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: form.service_type === v ? 'var(--color-primary)' : 'var(--color-text-primary)', marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</p>
              </button>
            ))}
          </div>
        </Field>
      </div>
      <StepNav onBack={onBack} loading={saving} />
    </form>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Step 10 – Review & Publish
───────────────────────────────────────────────────────────────────────────── */
const ReviewRow = ({ label, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '11px 0', borderBottom: '1px solid var(--color-border-light)', fontSize: 14,
  }}>
    <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, minWidth: 120 }}>{label}</span>
    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
  </div>
);

const StepReview = ({ data, allCats, onPublish, onBack, loading }) => {
  const pp       = data.profile || {};
  const catNames = (data.categories || []).map((id) => allCats.find((c) => c.id === id)?.name).filter(Boolean).join(', ');
  const svcCount = (data.services || []).length;

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(2,65,57,0.05), rgba(73,169,108,0.06))',
        border: '1px solid rgba(2,65,57,0.1)',
        borderRadius: 'var(--radius-xl)', padding: '18px 22px', marginBottom: 24,
      }}>
        <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-primary)', marginBottom: 4 }}>Almost there!</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Review your profile below. You can always update everything from your dashboard.
        </p>
      </div>
      <ReviewRow label="Location"     value={[pp.city, pp.postal_code].filter(Boolean).join(', ')} />
      <ReviewRow label="Address"      value={pp.address} />
      <ReviewRow label="Instagram"    value={pp.instagram ? `@${pp.instagram}` : null} />
      <ReviewRow label="TikTok"       value={pp.tiktok   ? `@${pp.tiktok}`    : null} />
      <ReviewRow label="Categories"   value={catNames || null} />
      <ReviewRow label="Services"     value={svcCount ? `${svcCount} service${svcCount !== 1 ? 's' : ''}` : null} />
      <ReviewRow label="Cancellation" value={{ '24h': '24-hour notice', '72h': '72-hour notice' }[pp.cancellation_policy]} />
      <ReviewRow label="Deposit"      value={{ none: 'No deposit', fixed: `€${pp.deposit_value || 0} fixed`, percentage: `${pp.deposit_value || 0}% of price` }[pp.deposit_type]} />
      <ReviewRow label="Service type" value={{ studio: 'Studio only', mobile: 'Mobile only', both: 'Studio + Mobile' }[pp.service_type]} />
      <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--color-border-light)' }}>
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={onPublish} className="btn btn-primary btn-lg" disabled={loading} style={{ minWidth: 160 }}>
          {loading ? <LoadingSpinner size={18} color="#fff" /> : 'Publish Profile'}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
export default function ProviderOnboardingPage() {
  const navigate = useNavigate();
  const [step,       setStep]       = useState(1);
  const [data,       setData]       = useState({});
  const [allCats,    setAllCats]    = useState([]);
  const [booting,    setBooting]    = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [pubError,   setPubError]   = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/providers/onboarding/status'),
      api.get('/categories'),
    ]).then(([statusRes, catsRes]) => {
      setData(statusRes.data);
      setAllCats(catsRes.data.categories || []);
      const saved = Math.min(statusRes.data.profile?.onboarding_step || 1, 10);
      setStep(saved);
    }).catch(() => {}).finally(() => setBooting(false));
  }, []);

  const next = useCallback((updates = {}) => {
    setData((p) => ({ ...p, ...updates }));
    setStep((s) => Math.min(s + 1, 10));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const publish = async () => {
    setPublishing(true);
    try {
      await api.post('/providers/onboarding/complete');
      navigate('/dashboard');
    } catch (err) {
      setPubError(err.response?.data?.message || 'Failed to publish. Please try again.');
      setPublishing(false);
    }
  };

  if (booting) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-app)' }}>
      <LoadingSpinner size={36} />
    </div>
  );

  const stepInfo  = STEPS[step - 1];
  const progress  = (step / STEPS.length) * 100;
  const mergeProfile = (updates) => next({ profile: { ...(data.profile || {}), ...updates } });

  const stepComponent = () => {
    switch (step) {
      case 1:  return <StepLocation     data={data.profile || {}} onSave={mergeProfile} />;
      case 2:  return <StepSocial       data={data.profile || {}} onSave={mergeProfile} onBack={back} />;
      case 3:  return <StepCategories   data={data}               onSave={next}         onBack={back} />;
      case 4:  return <StepServices     data={data}               onSave={next}         onBack={back} />;
      case 5:  return <StepAvailability data={data}               onSave={next}         onBack={back} />;
      case 6:  return <StepBlockedTimes data={data}               onSave={next}         onBack={back} />;
      case 7:  return <StepPolicies     data={data}               onSave={next}         onBack={back} />;
      case 8:  return <StepPayments     data={data}               onSave={next}         onBack={back} />;
      case 9:  return <StepDescription  data={data}               onSave={next}         onBack={back} />;
      case 10: return <StepReview       data={data} allCats={allCats} onPublish={publish} onBack={back} loading={publishing} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '0 var(--space-8)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: 'var(--shadow-xs)',
      }}>
        <Logo size={30} />
        <div style={{ flex: 1, maxWidth: 440, margin: '0 40px' }}>
          <div style={{ height: 5, background: 'var(--color-border-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--gradient-brand)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s var(--ease)',
            }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'center', fontWeight: 500 }}>
            Step {step} of {STEPS.length} — {stepInfo.label}
          </p>
        </div>
        <a href="/dashboard" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500 }}>
          Save &amp; exit
        </a>
      </div>

      {/* ── Body ── */}
      <div style={{
        flex: 1, display: 'flex',
        padding: '40px 24px', gap: 32,
        maxWidth: 1060, margin: '0 auto', width: '100%', boxSizing: 'border-box',
      }}>

        {/* Sidebar */}
        <div className="onboarding-sidebar" style={{ width: 210, flexShrink: 0 }}>
          <div style={{ position: 'sticky', top: 84 }}>
            {STEPS.map((s) => {
              const done    = s.id < step;
              const current = s.id === step;
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 'var(--radius-md)', marginBottom: 2,
                  background: current ? 'rgba(2,65,57,0.08)' : 'transparent',
                  transition: 'background var(--transition-fast)',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    background: done ? 'var(--color-secondary)' : current ? 'var(--color-primary)' : 'var(--color-border)',
                    color: done || current ? '#fff' : 'var(--color-text-muted)',
                    transition: 'background var(--transition-base)',
                  }}>
                    {done ? <CheckIcon size={11} /> : s.id}
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: current ? 600 : done ? 500 : 400,
                    color: current ? 'var(--color-primary)' : done ? 'var(--color-text-secondary)' : 'var(--color-text-muted)',
                    transition: 'color var(--transition-fast)',
                  }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            padding: '36px 40px',
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-xl)', fontWeight: 700,
              letterSpacing: '-0.02em', marginBottom: 6,
              color: 'var(--color-text-primary)',
            }}>
              {stepInfo.label}
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              {STEP_DESCRIPTIONS[step - 1]}
            </p>
            {pubError && <Alert type="error" message={pubError} style={{ marginBottom: 20 }} />}
            {stepComponent()}
          </div>
        </div>
      </div>

      {/* Hide sidebar on small screens */}
      <style>{`
        @media (max-width: 700px) {
          .onboarding-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
