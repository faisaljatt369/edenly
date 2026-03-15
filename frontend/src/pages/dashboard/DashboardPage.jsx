import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  updateProfile as apiUpdateProfile,
  changePassword as apiChangePassword,
  getPreferences as apiGetPrefs,
  updatePreferences as apiUpdatePrefs,
  createSetupIntent,
  listPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
  getProviderStatus,
  saveProviderServices,
  deleteProviderService,
} from '../../services/userService';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DashboardLayout, { PROVIDER_NAV, CUSTOMER_NAV } from '../../components/layout/DashboardLayout';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

/* ─────────────────────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────────────────────── */

/** Generic stat card */
const StatCard = ({ label, value, sub, icon, accent = 'var(--color-primary)' }) => (
  <div style={{
    background: '#fff',
    border: '1px solid var(--color-border-light)',
    borderRadius: 14, padding: '20px 22px',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(2,65,57,0.06)',
    flex: 1, minWidth: 0,
  }}>
    <div>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 6 }}>{sub}</p>}
    </div>
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: `${accent}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent,
    }}>
      {icon}
    </div>
  </div>
);

/** Empty state placeholder */
const EmptyState = ({ icon, title, description, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px', textAlign: 'center',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(2,65,57,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--color-text-muted)', marginBottom: 20,
    }}>
      {icon}
    </div>
    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>{title}</p>
    <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 320, lineHeight: 1.7, marginBottom: action ? 20 : 0 }}>{description}</p>
    {action}
  </div>
);

/** White content card */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', border: '1px solid var(--color-border-light)',
    borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)',
    overflow: 'hidden', ...style,
  }}>
    {children}
  </div>
);

/** Card header */
const CardHeader = ({ title, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)',
  }}>
    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>{title}</p>
    {action}
  </div>
);

/** Page section heading */
const SectionTitle = ({ children }) => (
  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
    {children}
  </p>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Phone Input with country flag + dial code — ALL countries
───────────────────────────────────────────────────────────────────────────── */
const COUNTRIES = [
  { code:'AF', flag:'🇦🇫', dial:'+93',   name:'Afghanistan' },
  { code:'AL', flag:'🇦🇱', dial:'+355',  name:'Albania' },
  { code:'DZ', flag:'🇩🇿', dial:'+213',  name:'Algeria' },
  { code:'AD', flag:'🇦🇩', dial:'+376',  name:'Andorra' },
  { code:'AO', flag:'🇦🇴', dial:'+244',  name:'Angola' },
  { code:'AG', flag:'🇦🇬', dial:'+1268', name:'Antigua and Barbuda' },
  { code:'AR', flag:'🇦🇷', dial:'+54',   name:'Argentina' },
  { code:'AM', flag:'🇦🇲', dial:'+374',  name:'Armenia' },
  { code:'AU', flag:'🇦🇺', dial:'+61',   name:'Australia' },
  { code:'AT', flag:'🇦🇹', dial:'+43',   name:'Austria' },
  { code:'AZ', flag:'🇦🇿', dial:'+994',  name:'Azerbaijan' },
  { code:'BS', flag:'🇧🇸', dial:'+1242', name:'Bahamas' },
  { code:'BH', flag:'🇧🇭', dial:'+973',  name:'Bahrain' },
  { code:'BD', flag:'🇧🇩', dial:'+880',  name:'Bangladesh' },
  { code:'BB', flag:'🇧🇧', dial:'+1246', name:'Barbados' },
  { code:'BY', flag:'🇧🇾', dial:'+375',  name:'Belarus' },
  { code:'BE', flag:'🇧🇪', dial:'+32',   name:'Belgium' },
  { code:'BZ', flag:'🇧🇿', dial:'+501',  name:'Belize' },
  { code:'BJ', flag:'🇧🇯', dial:'+229',  name:'Benin' },
  { code:'BT', flag:'🇧🇹', dial:'+975',  name:'Bhutan' },
  { code:'BO', flag:'🇧🇴', dial:'+591',  name:'Bolivia' },
  { code:'BA', flag:'🇧🇦', dial:'+387',  name:'Bosnia and Herzegovina' },
  { code:'BW', flag:'🇧🇼', dial:'+267',  name:'Botswana' },
  { code:'BR', flag:'🇧🇷', dial:'+55',   name:'Brazil' },
  { code:'BN', flag:'🇧🇳', dial:'+673',  name:'Brunei' },
  { code:'BG', flag:'🇧🇬', dial:'+359',  name:'Bulgaria' },
  { code:'BF', flag:'🇧🇫', dial:'+226',  name:'Burkina Faso' },
  { code:'BI', flag:'🇧🇮', dial:'+257',  name:'Burundi' },
  { code:'CV', flag:'🇨🇻', dial:'+238',  name:'Cabo Verde' },
  { code:'KH', flag:'🇰🇭', dial:'+855',  name:'Cambodia' },
  { code:'CM', flag:'🇨🇲', dial:'+237',  name:'Cameroon' },
  { code:'CA', flag:'🇨🇦', dial:'+1',    name:'Canada' },
  { code:'CF', flag:'🇨🇫', dial:'+236',  name:'Central African Republic' },
  { code:'TD', flag:'🇹🇩', dial:'+235',  name:'Chad' },
  { code:'CL', flag:'🇨🇱', dial:'+56',   name:'Chile' },
  { code:'CN', flag:'🇨🇳', dial:'+86',   name:'China' },
  { code:'CO', flag:'🇨🇴', dial:'+57',   name:'Colombia' },
  { code:'KM', flag:'🇰🇲', dial:'+269',  name:'Comoros' },
  { code:'CG', flag:'🇨🇬', dial:'+242',  name:'Congo' },
  { code:'CR', flag:'🇨🇷', dial:'+506',  name:'Costa Rica' },
  { code:'HR', flag:'🇭🇷', dial:'+385',  name:'Croatia' },
  { code:'CU', flag:'🇨🇺', dial:'+53',   name:'Cuba' },
  { code:'CY', flag:'🇨🇾', dial:'+357',  name:'Cyprus' },
  { code:'CZ', flag:'🇨🇿', dial:'+420',  name:'Czech Republic' },
  { code:'DK', flag:'🇩🇰', dial:'+45',   name:'Denmark' },
  { code:'DJ', flag:'🇩🇯', dial:'+253',  name:'Djibouti' },
  { code:'DM', flag:'🇩🇲', dial:'+1767', name:'Dominica' },
  { code:'DO', flag:'🇩🇴', dial:'+1809', name:'Dominican Republic' },
  { code:'EC', flag:'🇪🇨', dial:'+593',  name:'Ecuador' },
  { code:'EG', flag:'🇪🇬', dial:'+20',   name:'Egypt' },
  { code:'SV', flag:'🇸🇻', dial:'+503',  name:'El Salvador' },
  { code:'GQ', flag:'🇬🇶', dial:'+240',  name:'Equatorial Guinea' },
  { code:'ER', flag:'🇪🇷', dial:'+291',  name:'Eritrea' },
  { code:'EE', flag:'🇪🇪', dial:'+372',  name:'Estonia' },
  { code:'SZ', flag:'🇸🇿', dial:'+268',  name:'Eswatini' },
  { code:'ET', flag:'🇪🇹', dial:'+251',  name:'Ethiopia' },
  { code:'FJ', flag:'🇫🇯', dial:'+679',  name:'Fiji' },
  { code:'FI', flag:'🇫🇮', dial:'+358',  name:'Finland' },
  { code:'FR', flag:'🇫🇷', dial:'+33',   name:'France' },
  { code:'GA', flag:'🇬🇦', dial:'+241',  name:'Gabon' },
  { code:'GM', flag:'🇬🇲', dial:'+220',  name:'Gambia' },
  { code:'GE', flag:'🇬🇪', dial:'+995',  name:'Georgia' },
  { code:'DE', flag:'🇩🇪', dial:'+49',   name:'Germany' },
  { code:'GH', flag:'🇬🇭', dial:'+233',  name:'Ghana' },
  { code:'GR', flag:'🇬🇷', dial:'+30',   name:'Greece' },
  { code:'GD', flag:'🇬🇩', dial:'+1473', name:'Grenada' },
  { code:'GT', flag:'🇬🇹', dial:'+502',  name:'Guatemala' },
  { code:'GN', flag:'🇬🇳', dial:'+224',  name:'Guinea' },
  { code:'GW', flag:'🇬🇼', dial:'+245',  name:'Guinea-Bissau' },
  { code:'GY', flag:'🇬🇾', dial:'+592',  name:'Guyana' },
  { code:'HT', flag:'🇭🇹', dial:'+509',  name:'Haiti' },
  { code:'HN', flag:'🇭🇳', dial:'+504',  name:'Honduras' },
  { code:'HU', flag:'🇭🇺', dial:'+36',   name:'Hungary' },
  { code:'IS', flag:'🇮🇸', dial:'+354',  name:'Iceland' },
  { code:'IN', flag:'🇮🇳', dial:'+91',   name:'India' },
  { code:'ID', flag:'🇮🇩', dial:'+62',   name:'Indonesia' },
  { code:'IR', flag:'🇮🇷', dial:'+98',   name:'Iran' },
  { code:'IQ', flag:'🇮🇶', dial:'+964',  name:'Iraq' },
  { code:'IE', flag:'🇮🇪', dial:'+353',  name:'Ireland' },
  { code:'IL', flag:'🇮🇱', dial:'+972',  name:'Israel' },
  { code:'IT', flag:'🇮🇹', dial:'+39',   name:'Italy' },
  { code:'JM', flag:'🇯🇲', dial:'+1876', name:'Jamaica' },
  { code:'JP', flag:'🇯🇵', dial:'+81',   name:'Japan' },
  { code:'JO', flag:'🇯🇴', dial:'+962',  name:'Jordan' },
  { code:'KZ', flag:'🇰🇿', dial:'+7',    name:'Kazakhstan' },
  { code:'KE', flag:'🇰🇪', dial:'+254',  name:'Kenya' },
  { code:'KI', flag:'🇰🇮', dial:'+686',  name:'Kiribati' },
  { code:'KW', flag:'🇰🇼', dial:'+965',  name:'Kuwait' },
  { code:'KG', flag:'🇰🇬', dial:'+996',  name:'Kyrgyzstan' },
  { code:'LA', flag:'🇱🇦', dial:'+856',  name:'Laos' },
  { code:'LV', flag:'🇱🇻', dial:'+371',  name:'Latvia' },
  { code:'LB', flag:'🇱🇧', dial:'+961',  name:'Lebanon' },
  { code:'LS', flag:'🇱🇸', dial:'+266',  name:'Lesotho' },
  { code:'LR', flag:'🇱🇷', dial:'+231',  name:'Liberia' },
  { code:'LY', flag:'🇱🇾', dial:'+218',  name:'Libya' },
  { code:'LI', flag:'🇱🇮', dial:'+423',  name:'Liechtenstein' },
  { code:'LT', flag:'🇱🇹', dial:'+370',  name:'Lithuania' },
  { code:'LU', flag:'🇱🇺', dial:'+352',  name:'Luxembourg' },
  { code:'MG', flag:'🇲🇬', dial:'+261',  name:'Madagascar' },
  { code:'MW', flag:'🇲🇼', dial:'+265',  name:'Malawi' },
  { code:'MY', flag:'🇲🇾', dial:'+60',   name:'Malaysia' },
  { code:'MV', flag:'🇲🇻', dial:'+960',  name:'Maldives' },
  { code:'ML', flag:'🇲🇱', dial:'+223',  name:'Mali' },
  { code:'MT', flag:'🇲🇹', dial:'+356',  name:'Malta' },
  { code:'MH', flag:'🇲🇭', dial:'+692',  name:'Marshall Islands' },
  { code:'MR', flag:'🇲🇷', dial:'+222',  name:'Mauritania' },
  { code:'MU', flag:'🇲🇺', dial:'+230',  name:'Mauritius' },
  { code:'MX', flag:'🇲🇽', dial:'+52',   name:'Mexico' },
  { code:'FM', flag:'🇫🇲', dial:'+691',  name:'Micronesia' },
  { code:'MD', flag:'🇲🇩', dial:'+373',  name:'Moldova' },
  { code:'MC', flag:'🇲🇨', dial:'+377',  name:'Monaco' },
  { code:'MN', flag:'🇲🇳', dial:'+976',  name:'Mongolia' },
  { code:'ME', flag:'🇲🇪', dial:'+382',  name:'Montenegro' },
  { code:'MA', flag:'🇲🇦', dial:'+212',  name:'Morocco' },
  { code:'MZ', flag:'🇲🇿', dial:'+258',  name:'Mozambique' },
  { code:'MM', flag:'🇲🇲', dial:'+95',   name:'Myanmar' },
  { code:'NA', flag:'🇳🇦', dial:'+264',  name:'Namibia' },
  { code:'NR', flag:'🇳🇷', dial:'+674',  name:'Nauru' },
  { code:'NP', flag:'🇳🇵', dial:'+977',  name:'Nepal' },
  { code:'NL', flag:'🇳🇱', dial:'+31',   name:'Netherlands' },
  { code:'NZ', flag:'🇳🇿', dial:'+64',   name:'New Zealand' },
  { code:'NI', flag:'🇳🇮', dial:'+505',  name:'Nicaragua' },
  { code:'NE', flag:'🇳🇪', dial:'+227',  name:'Niger' },
  { code:'NG', flag:'🇳🇬', dial:'+234',  name:'Nigeria' },
  { code:'NO', flag:'🇳🇴', dial:'+47',   name:'Norway' },
  { code:'OM', flag:'🇴🇲', dial:'+968',  name:'Oman' },
  { code:'PK', flag:'🇵🇰', dial:'+92',   name:'Pakistan' },
  { code:'PW', flag:'🇵🇼', dial:'+680',  name:'Palau' },
  { code:'PA', flag:'🇵🇦', dial:'+507',  name:'Panama' },
  { code:'PG', flag:'🇵🇬', dial:'+675',  name:'Papua New Guinea' },
  { code:'PY', flag:'🇵🇾', dial:'+595',  name:'Paraguay' },
  { code:'PE', flag:'🇵🇪', dial:'+51',   name:'Peru' },
  { code:'PH', flag:'🇵🇭', dial:'+63',   name:'Philippines' },
  { code:'PL', flag:'🇵🇱', dial:'+48',   name:'Poland' },
  { code:'PT', flag:'🇵🇹', dial:'+351',  name:'Portugal' },
  { code:'QA', flag:'🇶🇦', dial:'+974',  name:'Qatar' },
  { code:'RO', flag:'🇷🇴', dial:'+40',   name:'Romania' },
  { code:'RU', flag:'🇷🇺', dial:'+7',    name:'Russia' },
  { code:'RW', flag:'🇷🇼', dial:'+250',  name:'Rwanda' },
  { code:'KN', flag:'🇰🇳', dial:'+1869', name:'Saint Kitts and Nevis' },
  { code:'LC', flag:'🇱🇨', dial:'+1758', name:'Saint Lucia' },
  { code:'VC', flag:'🇻🇨', dial:'+1784', name:'Saint Vincent and the Grenadines' },
  { code:'WS', flag:'🇼🇸', dial:'+685',  name:'Samoa' },
  { code:'SM', flag:'🇸🇲', dial:'+378',  name:'San Marino' },
  { code:'ST', flag:'🇸🇹', dial:'+239',  name:'São Tomé and Príncipe' },
  { code:'SA', flag:'🇸🇦', dial:'+966',  name:'Saudi Arabia' },
  { code:'SN', flag:'🇸🇳', dial:'+221',  name:'Senegal' },
  { code:'RS', flag:'🇷🇸', dial:'+381',  name:'Serbia' },
  { code:'SC', flag:'🇸🇨', dial:'+248',  name:'Seychelles' },
  { code:'SL', flag:'🇸🇱', dial:'+232',  name:'Sierra Leone' },
  { code:'SG', flag:'🇸🇬', dial:'+65',   name:'Singapore' },
  { code:'SK', flag:'🇸🇰', dial:'+421',  name:'Slovakia' },
  { code:'SI', flag:'🇸🇮', dial:'+386',  name:'Slovenia' },
  { code:'SB', flag:'🇸🇧', dial:'+677',  name:'Solomon Islands' },
  { code:'SO', flag:'🇸🇴', dial:'+252',  name:'Somalia' },
  { code:'ZA', flag:'🇿🇦', dial:'+27',   name:'South Africa' },
  { code:'SS', flag:'🇸🇸', dial:'+211',  name:'South Sudan' },
  { code:'ES', flag:'🇪🇸', dial:'+34',   name:'Spain' },
  { code:'LK', flag:'🇱🇰', dial:'+94',   name:'Sri Lanka' },
  { code:'SD', flag:'🇸🇩', dial:'+249',  name:'Sudan' },
  { code:'SR', flag:'🇸🇷', dial:'+597',  name:'Suriname' },
  { code:'SE', flag:'🇸🇪', dial:'+46',   name:'Sweden' },
  { code:'CH', flag:'🇨🇭', dial:'+41',   name:'Switzerland' },
  { code:'SY', flag:'🇸🇾', dial:'+963',  name:'Syria' },
  { code:'TW', flag:'🇹🇼', dial:'+886',  name:'Taiwan' },
  { code:'TJ', flag:'🇹🇯', dial:'+992',  name:'Tajikistan' },
  { code:'TZ', flag:'🇹🇿', dial:'+255',  name:'Tanzania' },
  { code:'TH', flag:'🇹🇭', dial:'+66',   name:'Thailand' },
  { code:'TL', flag:'🇹🇱', dial:'+670',  name:'Timor-Leste' },
  { code:'TG', flag:'🇹🇬', dial:'+228',  name:'Togo' },
  { code:'TO', flag:'🇹🇴', dial:'+676',  name:'Tonga' },
  { code:'TT', flag:'🇹🇹', dial:'+1868', name:'Trinidad and Tobago' },
  { code:'TN', flag:'🇹🇳', dial:'+216',  name:'Tunisia' },
  { code:'TR', flag:'🇹🇷', dial:'+90',   name:'Turkey' },
  { code:'TM', flag:'🇹🇲', dial:'+993',  name:'Turkmenistan' },
  { code:'TV', flag:'🇹🇻', dial:'+688',  name:'Tuvalu' },
  { code:'UG', flag:'🇺🇬', dial:'+256',  name:'Uganda' },
  { code:'UA', flag:'🇺🇦', dial:'+380',  name:'Ukraine' },
  { code:'AE', flag:'🇦🇪', dial:'+971',  name:'United Arab Emirates' },
  { code:'GB', flag:'🇬🇧', dial:'+44',   name:'United Kingdom' },
  { code:'US', flag:'🇺🇸', dial:'+1',    name:'United States' },
  { code:'UY', flag:'🇺🇾', dial:'+598',  name:'Uruguay' },
  { code:'UZ', flag:'🇺🇿', dial:'+998',  name:'Uzbekistan' },
  { code:'VU', flag:'🇻🇺', dial:'+678',  name:'Vanuatu' },
  { code:'VE', flag:'🇻🇪', dial:'+58',   name:'Venezuela' },
  { code:'VN', flag:'🇻🇳', dial:'+84',   name:'Vietnam' },
  { code:'YE', flag:'🇾🇪', dial:'+967',  name:'Yemen' },
  { code:'ZM', flag:'🇿🇲', dial:'+260',  name:'Zambia' },
  { code:'ZW', flag:'🇿🇼', dial:'+263',  name:'Zimbabwe' },
];

const parsePhone = (val = '') => {
  // Sort by dial length descending so +1868 matches before +1
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    if (val.startsWith(c.dial)) return { country: c, number: val.slice(c.dial.length).trim() };
  }
  return { country: COUNTRIES.find(c => c.code === 'DE'), number: val.replace(/^\+\d{1,4}\s?/, '') };
};

const PhoneInput = ({ value = '', onChange }) => {
  const parsed = parsePhone(value);
  const [country, setCountry] = useState(parsed.country);
  const [number, setNumber]   = useState(parsed.number);
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const btnRef  = useRef(null);
  const dropRef = useRef(null);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 280 });

  // Emit combined value outward
  useEffect(() => {
    onChange(`${country.dial}${number ? ' ' + number : ''}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, number]);

  // Sync inward on first mount
  useEffect(() => {
    const p = parsePhone(value);
    setCountry(p.country);
    setNumber(p.number);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate fixed position of dropdown from button's bounding rect
  const openDropdown = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width + 160, 280) });
    }
    setOpen(true);
    setSearch('');
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (btnRef.current?.contains(e.target) || dropRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = search
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search))
    : COUNTRIES;

  const border = '1.5px solid var(--color-border)';
  const baseStyle = { padding: '10px 13px', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', background: '#fff' };

  return (
    <>
      <div style={{ display: 'flex' }}>
        {/* Flag + dial button */}
        <button
          ref={btnRef}
          type="button"
          onClick={() => open ? setOpen(false) : openDropdown()}
          style={{
            ...baseStyle,
            display: 'flex', alignItems: 'center', gap: 6,
            border, borderRight: 'none', borderRadius: '9px 0 0 9px',
            padding: '10px 12px', cursor: 'pointer', flexShrink: 0,
            minWidth: 92, justifyContent: 'space-between',
            background: open ? '#f8fafb' : '#fff',
          }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{country.flag}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{country.dial}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--color-text-muted)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^\d\s\-()+]/g, ''))}
          placeholder="000 000 0000"
          style={{ ...baseStyle, border, borderRadius: '0 9px 9px 0', flex: 1, minWidth: 0, boxSizing: 'border-box' }}
        />
      </div>

      {/* Portal-style fixed dropdown */}
      {open && (
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: dropPos.top,
            left: dropPos.left,
            width: dropPos.width,
            zIndex: 9999,
            background: '#fff',
            border: '1.5px solid var(--color-border)',
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(2,65,57,0.18)',
            overflow: 'hidden',
          }}>
          {/* Search */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border-light)' }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or dial code…"
              style={{
                width: '100%', padding: '8px 12px',
                border: '1.5px solid var(--color-border)', borderRadius: 8,
                fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* List */}
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <p style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: 'var(--color-text-muted)' }}>No results</p>
              : filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { setCountry(c); setOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px',
                    background: c.code === country.code ? 'rgba(2,65,57,0.07)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (c.code !== country.code) e.currentTarget.style.background = '#f8fafb'; }}
                  onMouseLeave={(e) => { if (c.code !== country.code) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-primary)', flex: 1, textAlign: 'left' }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, flexShrink: 0 }}>{c.dial}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

/** Placeholder page for coming-soon sections */
const ComingSoonPage = ({ title, description, icon }) => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>{title}</h2>
    </div>
    <Card>
      <EmptyState
        icon={icon}
        title={`${title} coming soon`}
        description={description}
      />
    </Card>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SVG Icons (inline, for page content)
───────────────────────────────────────────────────────────────────────────── */
const CalSvg   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const BookSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const UsersSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const StarSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const EuroSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M4 14h12M19 6a7 7 0 1 0 0 12"/></svg>;
const MsgSvg   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ChartSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const GearSvg  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const SearchSvg = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

/** Reusable toast notification */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: ok ? '#dcfce7' : '#fee2e2',
      color: ok ? '#16a34a' : '#dc2626',
      border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', gap: 8,
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 15 }}>{ok ? '✓' : '✕'}</span>
      {toast.msg}
    </div>
  );
};

/** iOS-style toggle switch */
const ToggleSwitch = ({ defaultOn = false, onChange }) => {
  const [on, setOn] = useState(defaultOn);
  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };
  return (
    <button onClick={toggle} style={{
      width: 44, height: 26, borderRadius: 99, border: 'none', cursor: 'pointer',
      background: on ? 'var(--color-primary)' : '#CBD5E1',
      position: 'relative', flexShrink: 0, padding: 0,
      transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER PAGES
───────────────────────────────────────────────────────────────────────────── */

const ProviderHome = ({ user }) => {
  const firstName = user?.first_name || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
          {greeting}, {firstName}! 👋
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>Here's an overview of your business today.</p>
      </div>

      {/* Stats row */}
      <div className="db-grid-4">
        <StatCard label="Today's Bookings" value="0" sub="No appointments yet" icon={<CalSvg />} accent="var(--color-primary)" />
        <StatCard label="Revenue (week)" value="€0" sub="No transactions yet" icon={<EuroSvg />} accent="var(--color-secondary)" />
        <StatCard label="Total Clients" value="0" sub="Grow your client base" icon={<UsersSvg />} accent="#7C3AED" />
        <StatCard label="Active Services" value="—" sub="Add services to begin" icon={<StarSvg />} accent="#F59E0B" />
      </div>

      {/* Two-column row */}
      <div className="db-grid-aside-lg">

        {/* Upcoming appointments */}
        <Card>
          <CardHeader
            title="Upcoming Appointments"
            action={
              <Link to="/dashboard/calendar" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                View calendar →
              </Link>
            }
          />
          <EmptyState
            icon={<CalSvg />}
            title="No upcoming appointments"
            description="Once clients book with you, their appointments will appear here."
            action={
              <Link to="/dashboard/bookings" className="btn btn-primary" style={{ fontSize: 13 }}>
                Manage bookings
              </Link>
            }
          />
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Add a service',      to: '/dashboard/services', color: 'var(--color-primary)'   },
                { label: 'View your calendar', to: '/dashboard/calendar', color: 'var(--color-secondary)' },
                { label: 'See all bookings',   to: '/dashboard/bookings', color: '#7C3AED'                },
                { label: 'View clients',       to: '/dashboard/clients',  color: '#F59E0B'                },
              ].map(({ label, to, color }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 9, textDecoration: 'none',
                  color: 'var(--color-text-primary)', fontSize: 13, fontWeight: 500,
                  transition: 'background 0.12s',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-muted)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                    {label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              ))}
            </div>
          </Card>

          {/* Profile completion */}
          <Card>
            <CardHeader title="Profile Setup" />
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Completion</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>40%</span>
              </div>
              <div style={{ height: 6, background: 'var(--color-border-light)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: 'var(--gradient-brand)', borderRadius: 99, transition: 'width 0.5s ease' }} />
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 10, lineHeight: 1.6 }}>
                Complete your profile to attract more clients.
              </p>
              <Link to="/onboarding" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-block', marginTop: 8 }}>
                Continue setup →
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <EmptyState
          icon={<ChartSvg />}
          title="No activity yet"
          description="Your booking history and client interactions will appear here."
        />
      </Card>
    </div>
  );
};

const ProviderCalendar = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Calendar</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your schedule and availability</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ New Appointment</button>
    </div>

    {/* Calendar shell */}
    <Card>
      {/* Calendar nav */}
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
        {['Day', 'Week', 'Month'].map((view) => (
          <button key={view} style={{
            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: view === 'Week' ? 'var(--color-primary)' : 'var(--color-bg-muted)',
            color: view === 'Week' ? '#fff' : 'var(--color-text-secondary)',
            transition: 'all 0.12s',
          }}>
            {view}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Today
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '›'].map((ch) => (
            <button key={ch} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: 'var(--color-text-secondary)' }}>{ch}</button>
          ))}
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 140, textAlign: 'center' }}>
          March 2026
        </span>
      </div>

      {/* Calendar grid placeholder */}
      <div style={{ padding: 0 }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--color-border-light)' }}>
          <div style={{ padding: '10px 0' }} />
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
            <div key={d} style={{
              padding: '10px 0', textAlign: 'center', fontSize: 12, fontWeight: 600,
              color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderLeft: '1px solid var(--color-border-light)',
            }}>
              <p style={{ marginBottom: 2 }}>{d}</p>
              <p style={{
                fontSize: 16, fontWeight: i === 0 ? 800 : 400,
                color: i === 0 ? '#fff' : 'var(--color-text-primary)',
                background: i === 0 ? 'var(--color-primary)' : 'transparent',
                borderRadius: '50%', width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
              }}>
                {9 + i}
              </p>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
          <div key={time} style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid var(--color-border-light)' }}>
            <div style={{ padding: '16px 10px 0', fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'right', paddingRight: 12 }}>{time}</div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ height: 56, borderLeft: '1px solid var(--color-border-light)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,65,57,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'} />
            ))}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const ProviderBookings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Bookings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Track and manage all your appointments</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ New Booking</button>
    </div>

    {/* Filter tabs */}
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border-light)', paddingBottom: 0 }}>
      {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab, i) => (
        <button key={tab} style={{
          padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          borderBottom: i === 0 ? '2px solid var(--color-primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>
          {tab}
        </button>
      ))}
    </div>

    <Card>
      <EmptyState
        icon={<BookSvg />}
        title="No bookings yet"
        description="When clients book your services, all appointments will appear here for easy management."
        action={
          <Link to="/dashboard/services" className="btn btn-primary" style={{ fontSize: 13 }}>
            Set up your services
          </Link>
        }
      />
    </Card>
  </div>
);

const ProviderClients = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Clients</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Your client base and booking history</p>
      </div>
      <button className="btn btn-primary" style={{ fontSize: 13 }}>+ Add Client</button>
    </div>

    {/* Search bar */}
    <div style={{ position: 'relative', maxWidth: 340 }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
        <SearchSvg />
      </span>
      <input placeholder="Search clients…" style={{
        width: '100%', padding: '10px 14px 10px 40px',
        border: '1.5px solid var(--color-border)', borderRadius: 10,
        fontSize: 13, fontFamily: 'var(--font-sans)', background: '#fff',
        outline: 'none', boxSizing: 'border-box',
      }} />
    </div>

    <Card>
      <EmptyState
        icon={<UsersSvg />}
        title="No clients yet"
        description="Clients who book your services will automatically appear here. You can also add clients manually."
      />
    </Card>
  </div>
);

/* ── Service form modal ──────────────────────────────────────────────────────── */
const EMPTY_SERVICE = { name: '', price: '', duration: '', description: '', category_id: '', images: [], title_image_index: 0 };

const ServiceModal = ({ service, categories, onSave, onClose }) => {
  const initForm = service
    ? { ...service, price: service.price ?? '', duration: service.duration ?? '', category_id: service.category_id ?? '', images: Array.isArray(service.images) ? service.images : [], title_image_index: service.title_image_index ?? 0 }
    : { ...EMPTY_SERVICE };

  const [form, setForm]         = useState(initForm);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr]           = useState('');
  const [imgErr, setImgErr]     = useState('');
  const imgInputRef             = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  /* ── image helpers ── */
  const compressImage = (file) => new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) { reject(new Error('Not an image')); return; }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  const handleImageFiles = async (files) => {
    setImgErr('');
    const arr = Array.from(files);
    if (!arr.length) return;
    const slots = 10 - form.images.length;
    if (slots <= 0) { setImgErr('Maximum 10 images allowed'); return; }
    const invalid = arr.find(f => !f.type.startsWith('image/'));
    if (invalid) { setImgErr('Only image files are supported'); return; }
    setUploading(true);
    try {
      const compressed = await Promise.all(arr.slice(0, slots).map(compressImage));
      setForm((f) => ({ ...f, images: [...f.images, ...compressed] }));
    } catch {
      setImgErr('Failed to process one or more images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setForm((f) => {
      const imgs = f.images.filter((_, i) => i !== idx);
      const titleIdx = f.title_image_index >= imgs.length ? Math.max(0, imgs.length - 1) : f.title_image_index;
      return { ...f, images: imgs, title_image_index: titleIdx };
    });
  };

  const setTitle = (idx) => set('title_image_index', idx);

  const handleDrop = (e) => {
    e.preventDefault();
    handleImageFiles(e.dataTransfer.files);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setErr('Service name is required'); return; }
    setSaving(true); setErr('');
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const inp = {
    padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
    fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, width: '100%', maxWidth: 680,
        maxHeight: '92vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 72px rgba(2,65,57,0.22)',
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>{form.id ? 'Edit Service' : 'Add Service'}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>Fill in the details for this service offering</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 22, lineHeight: 1, padding: '4px 8px' }}>×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', flex: 1 }}>
          {err && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#DC2626' }}>{err}</div>}

          {/* Service name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Service name *</label>
            <input style={inp} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Box Braids, Lash Lift, Deep Tissue Massage" />
          </div>

          {/* Price + Duration + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Price (€)</label>
              <input style={inp} type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="e.g. 80" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Duration (min)</label>
              <input style={inp} type="number" min="0" step="5" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 60" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Category</label>
              <select style={{ ...inp, background: '#fff' }} value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
                <option value="">— Select —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Description</label>
            <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What's included, preparation tips, aftercare notes…" />
          </div>

          {/* Images section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Service Photos</label>
                <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 1 }}>Up to 10 photos · Click ★ to set cover image</p>
              </div>
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>{form.images.length}/10</span>
            </div>

            {imgErr && <div style={{ fontSize: 12, color: '#DC2626', padding: '6px 10px', background: 'rgba(239,68,68,0.07)', borderRadius: 7 }}>{imgErr}</div>}

            {/* Image grid */}
            {form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', border: idx === form.title_image_index ? '2.5px solid var(--color-primary)' : '2px solid var(--color-border)', boxShadow: idx === form.title_image_index ? '0 0 0 3px rgba(2,65,57,0.12)' : 'none', transition: 'all 0.15s' }}>
                    <img src={img} alt={`service-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {/* Cover badge */}
                    {idx === form.title_image_index && (
                      <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--color-primary)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, letterSpacing: '0.02em' }}>COVER</div>
                    )}
                    {/* Action buttons */}
                    <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4 }}>
                      {idx !== form.title_image_index && (
                        <button
                          title="Set as cover"
                          onClick={() => setTitle(idx)}
                          style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.88)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, lineHeight: 1, backdropFilter: 'blur(4px)' }}>
                          ★
                        </button>
                      )}
                      <button
                        title="Remove"
                        onClick={() => removeImage(idx)}
                        style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(239,68,68,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, lineHeight: 1, backdropFilter: 'blur(4px)' }}>
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add more tile */}
                {form.images.length < 10 && (
                  <div
                    onClick={() => !uploading && imgInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    style={{ aspectRatio: '1', borderRadius: 10, border: '2px dashed var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: uploading ? 'default' : 'pointer', gap: 4, color: 'var(--color-text-muted)', transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(2,65,57,0.03)'; }}}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'transparent'; }}>
                    <span style={{ fontSize: uploading ? 14 : 22 }}>{uploading ? '⏳' : '+'}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600 }}>{uploading ? 'Processing…' : 'Add photo'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Drop zone (shown when no images yet) */}
            {form.images.length === 0 && (
              <div
                onClick={() => !uploading && imgInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ border: `2px dashed ${uploading ? 'var(--color-primary)' : 'var(--color-border)'}`, borderRadius: 12, padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: uploading ? 'default' : 'pointer', transition: 'all 0.15s', color: 'var(--color-text-muted)', background: uploading ? 'rgba(2,65,57,0.03)' : 'transparent' }}
                onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(2,65,57,0.03)'; }}}
                onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'transparent'; }}}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(2,65,57,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {uploading ? '⏳' : '🖼️'}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  {uploading ? 'Compressing images…' : 'Upload service photos'}
                </p>
                {!uploading && <p style={{ fontSize: 11.5, textAlign: 'center' }}>Drag & drop or click to browse · PNG, JPG, WEBP</p>}
              </div>
            )}

            <input
              ref={imgInputRef} type="file" accept="image/*" multiple
              style={{ display: 'none' }}
              onChange={(e) => { handleImageFiles(e.target.files); e.target.value = ''; }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border-light)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0, background: '#fafbfa', borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || uploading} style={{ minWidth: 130 }}>
            {uploading ? 'Processing images…' : saving ? 'Saving…' : (form.id ? 'Save changes' : 'Add service')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProviderServices = () => {
  const [services, setServices]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(null); // null | 'add' | serviceObj
  const [deleting, setDeleting]     = useState(null);
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    getProviderStatus()
      .then(({ data }) => {
        setServices(data.services || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // Also fetch categories
    import('../../services/api').then(({ default: api }) => {
      api.get('/categories').then(({ data }) => setCategories(data.categories || []));
    });
  }, []);

  const handleSave = async (form) => {
    const payload = {
      id: form.id || undefined,
      name: form.name,
      price: form.price ? parseFloat(form.price) : null,
      duration: form.duration ? parseInt(form.duration) : null,
      description: form.description || null,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      images: Array.isArray(form.images) ? form.images : [],
      title_image_index: typeof form.title_image_index === 'number' ? form.title_image_index : 0,
    };
    await saveProviderServices({ services: [payload] });
    // Reload
    const { data } = await getProviderStatus();
    setServices(data.services || []);
    showToast(form.id ? 'Service updated!' : 'Service added!');
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteProviderService(id);
      setServices((s) => s.filter((x) => x.id !== id));
      showToast('Service removed');
    } finally { setDeleting(null); }
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 2000,
          background: 'var(--color-primary)', color: '#fff',
          padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
          boxShadow: '0 4px 16px rgba(2,65,57,0.25)',
        }}>{toast}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Services</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage what you offer and your pricing</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setModal('add')}>+ Add Service</button>
      </div>

      {loading ? (
        <Card><div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>Loading…</div></Card>
      ) : services.length === 0 ? (
        <Card>
          <EmptyState
            icon={<StarSvg />}
            title="No services added"
            description="Add the services you offer so clients can discover and book with you."
            action={<button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setModal('add')}>Add your first service</button>}
          />
        </Card>
      ) : (
        <Card>
          <div style={{ padding: '8px 0' }}>
            {services.map((svc, i) => {
              const imgs = Array.isArray(svc.images) ? svc.images : [];
              const coverImg = imgs.length > 0 ? imgs[svc.title_image_index ?? 0] || imgs[0] : null;
              const openEdit = () => setModal({ ...svc, price: svc.price ?? '', duration: svc.duration ?? '', category_id: svc.category_id ?? '', images: imgs, title_image_index: svc.title_image_index ?? 0 });
              return (
                <div
                  key={svc.id}
                  onClick={openEdit}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                    padding: '14px 22px',
                    borderTop: i > 0 ? '1px solid var(--color-border-light)' : 'none',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(2,65,57,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Cover thumbnail */}
                  <div style={{ width: 52, height: 52, borderRadius: 10, flexShrink: 0, overflow: 'hidden', background: 'rgba(2,65,57,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--color-border-light)' }}>
                    {coverImg
                      ? <img src={coverImg} alt={svc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 20 }}>🖼️</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{svc.name}</p>
                      {catName(svc.category_id) && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'rgba(2,65,57,0.08)', color: 'var(--color-primary)' }}>{catName(svc.category_id)}</span>
                      )}
                      {imgs.length > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>📷 {imgs.length}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                      {svc.price != null && <span style={{ fontSize: 12.5, color: 'var(--color-secondary)', fontWeight: 600 }}>€{parseFloat(svc.price).toFixed(2)}</span>}
                      {svc.duration != null && <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)' }}>{svc.duration} min</span>}
                      {svc.description && <span style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{svc.description}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={e => { e.stopPropagation(); openEdit(); }}
                      style={{ padding: '6px 14px', fontSize: 12.5, fontWeight: 600, borderRadius: 8, border: '1.5px solid var(--color-border)', background: '#fff', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                      Edit
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(svc.id); }}
                      disabled={deleting === svc.id}
                      style={{ padding: '6px 14px', fontSize: 12.5, fontWeight: 600, borderRadius: 8, border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#DC2626' }}>
                      {deleting === svc.id ? '…' : 'Remove'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <ServiceModal
          service={modal === 'add' ? null : modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

const ProviderMessages = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 116px)' }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Messages</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Client conversations</p>
    </div>
    <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)' }}>
      {/* Conversation list */}
      <div style={{ width: 300, borderRight: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border-light)' }}>
          <input placeholder="Search messages…" style={{
            width: '100%', padding: '9px 13px',
            border: '1.5px solid var(--color-border)', borderRadius: 9,
            fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 24 }}>No conversations yet</p>
        </div>
      </div>
      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState
          icon={<MsgSvg />}
          title="No conversation selected"
          description="Select a conversation from the list, or wait for a client to reach out."
        />
      </div>
    </div>
  </div>
);

const ProviderReports = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Reports</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Track your business performance</p>
    </div>

    {/* Period selector */}
    <div style={{ display: 'flex', gap: 6 }}>
      {['This week', 'This month', 'Last 3 months', 'This year'].map((p, i) => (
        <button key={p} style={{
          padding: '7px 14px', borderRadius: 8, border: '1.5px solid',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          borderColor: i === 1 ? 'var(--color-primary)' : 'var(--color-border)',
          background: i === 1 ? 'rgba(2,65,57,0.06)' : '#fff',
          color: i === 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        }}>
          {p}
        </button>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <StatCard label="Total Revenue" value="€0" sub="This month" icon={<EuroSvg />} accent="var(--color-secondary)" />
      <StatCard label="Total Bookings" value="0" sub="This month" icon={<CalSvg />} accent="var(--color-primary)" />
      <StatCard label="New Clients" value="0" sub="This month" icon={<UsersSvg />} accent="#7C3AED" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <CardHeader title="Revenue Over Time" />
        <div style={{ padding: 24, display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: '100%', height: 0, background: 'rgba(2,65,57,0.12)', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', paddingBottom: 16 }}>No data yet — revenue will appear once you receive bookings</p>
      </Card>
      <Card>
        <CardHeader title="Bookings by Service" />
        <EmptyState icon={<ChartSvg />} title="No data yet" description="Service breakdown will appear once bookings come in." />
      </Card>
    </div>
  </div>
);

/* ── Stripe Add Card form ─────────────────────────────────────────────────── */
const AddCardForm = ({ onSuccess, onCancel }) => {
  const stripe   = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSaving(true); setErr('');
    try {
      const { data } = await createSetupIntent();
      const clientSecret = data.client_secret;
      const { error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (stripeErr) { setErr(stripeErr.message); return; }
      onSuccess();
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to save card');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {err && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12.5, color: '#DC2626' }}>{err}</div>}
      <div style={{ border: '1.5px solid var(--color-border)', borderRadius: 9, padding: '11px 13px' }}>
        <CardElement options={{ style: { base: { fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#1a2b2a' } } }} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn btn-primary" style={{ fontSize: 13 }} disabled={saving || !stripe}>
          {saving ? 'Saving…' : 'Save card'}
        </button>
        <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const ProviderSettings = () => {
  const { user, setUser } = useAuth();
  const [tab, setTab]           = useState('Profile');
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState('');

  // Profile state
  const fileRef    = useRef(null);
  const [firstName, setFirstName]   = useState(user?.first_name || '');
  const [lastName, setLastName]     = useState(user?.last_name  || '');
  const [phone, setPhone]           = useState(user?.phone      || '');
  const [avatar, setAvatar]         = useState(user?.avatar_url || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [curPwd, setCurPwd]         = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [savingPwd, setSavingPwd]   = useState(false);

  // Payment methods state
  const [cards, setCards]           = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [showAddCard, setShowAddCard]   = useState(false);

  // Privacy state
  const [privacyPrefs, setPrivacyPrefs]   = useState({ profile_visible: true, show_in_search: true });
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const showToast = (msg, isErr = false) => {
    if (isErr) { setToastErr(msg); setTimeout(() => setToastErr(''), 4000); }
    else       { setToast(msg);    setTimeout(() => setToast(''), 3000); }
  };

  // Load cards when tab changes to Payment
  useEffect(() => {
    if (tab !== 'Payment') return;
    setLoadingCards(true);
    listPaymentMethods()
      .then(({ data }) => setCards(data.payment_methods || []))
      .catch(() => {})
      .finally(() => setLoadingCards(false));
  }, [tab]);

  // Load privacy prefs when tab changes to Privacy
  useEffect(() => {
    if (tab !== 'Privacy') return;
    apiGetPrefs()
      .then(({ data }) => {
        const p = data.preferences?.privacy;
        if (p) setPrivacyPrefs(typeof p === 'string' ? JSON.parse(p) : p);
      })
      .catch(() => {});
  }, [tab]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { data } = await apiUpdateProfile({ first_name: firstName, last_name: lastName, phone, avatar_url: avatar || undefined });
      if (setUser) setUser(data.user);
      showToast('Profile saved!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to save', true);
    } finally { setSavingProfile(false); }
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) { showToast('Passwords do not match', true); return; }
    if (newPwd.length < 8)     { showToast('New password must be at least 8 characters', true); return; }
    setSavingPwd(true);
    try {
      await apiChangePassword({ current_password: curPwd, new_password: newPwd });
      setCurPwd(''); setNewPwd(''); setConfirmPwd('');
      showToast('Password changed!');
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to change password', true);
    } finally { setSavingPwd(false); }
  };

  const handleRemoveCard = async (pmId) => {
    try {
      await removePaymentMethod(pmId);
      setCards((c) => c.filter((x) => x.id !== pmId));
      showToast('Card removed');
    } catch { showToast('Failed to remove card', true); }
  };

  const handleSetDefault = async (pmId) => {
    try {
      await setDefaultPaymentMethod(pmId);
      setCards((c) => c.map((x) => ({ ...x, is_default: x.id === pmId })));
      showToast('Default card updated');
    } catch { showToast('Failed to update default', true); }
  };

  const handleCardAdded = async () => {
    setShowAddCard(false);
    setLoadingCards(true);
    const { data } = await listPaymentMethods();
    setCards(data.payment_methods || []);
    setLoadingCards(false);
    showToast('Card saved!');
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await apiUpdatePrefs({ privacy: privacyPrefs });
      showToast('Privacy settings saved!');
    } catch { showToast('Failed to save', true); }
    finally { setSavingPrivacy(false); }
  };

  const TABS = ['Profile', 'Password', 'Payment', 'Privacy'];
  const inp = {
    padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
    fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', width: '100%', boxSizing: 'border-box',
  };

  const cardBrandIcon = (brand) => ({ visa: '💳', mastercard: '💳', amex: '💳' }[brand] || '💳');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Toasts */}
      {toast    && <div style={{ position:'fixed', top:20, right:20, zIndex:2000, background:'var(--color-primary)', color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, boxShadow:'0 4px 16px rgba(2,65,57,0.25)' }}>{toast}</div>}
      {toastErr && <div style={{ position:'fixed', top:20, right:20, zIndex:2000, background:'#DC2626', color:'#fff', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, boxShadow:'0 4px 16px rgba(220,38,38,0.25)' }}>{toastErr}</div>}

      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your account and preferences</p>
      </div>

      <div className="db-grid-settings" style={{ alignItems: 'start' }}>
        {/* Tab sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              display: 'flex', alignItems: 'center', padding: '10px 14px',
              background: tab === t ? 'rgba(2,65,57,0.08)' : 'transparent',
              border: 'none', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
              fontSize: 13.5, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              transition: 'background 0.12s',
            }}
            onMouseEnter={(e) => { if (tab !== t) e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
            onMouseLeave={(e) => { if (tab !== t) e.currentTarget.style.background = 'transparent'; }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Profile tab ───────────────────────────────────────────────────── */}
        {tab === 'Profile' && (
          <Card>
            <CardHeader title="Profile Information" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: avatar ? 'transparent' : 'var(--gradient-brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: '#fff', overflow: 'hidden',
                }}>
                  {avatar
                    ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?'}
                </div>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                  <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: '1.5px solid var(--color-primary)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}
                    onClick={() => fileRef.current?.click()}>
                    Change photo
                  </button>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 5 }}>JPG, PNG or GIF · Max 5MB</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>First name</label>
                  <input style={inp} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Last name</label>
                  <input style={inp} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Email address</label>
                <input style={{ ...inp, background: '#f9fafb', color: 'var(--color-text-muted)' }} value={user?.email || ''} readOnly />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Phone number</label>
                <PhoneInput value={phone} onChange={setPhone} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={handleSaveProfile} disabled={savingProfile}>
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Password tab ──────────────────────────────────────────────────── */}
        {tab === 'Password' && (
          <Card>
            <CardHeader title="Change Password" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Current password</label>
                <input style={inp} type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>New password</label>
                <input style={inp} type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>Minimum 8 characters</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Confirm new password</label>
                <input style={inp} type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={handleChangePassword} disabled={savingPwd || !curPwd || !newPwd}>
                  {savingPwd ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* ── Payment tab ───────────────────────────────────────────────────── */}
        {tab === 'Payment' && (
          <Card>
            <CardHeader
              title="Payment Methods"
              action={!showAddCard && <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setShowAddCard(true)}>+ Add card</button>}
            />
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {showAddCard && (
                <div style={{ background: 'var(--color-bg-muted)', borderRadius: 10, padding: '18px 20px' }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 14 }}>Add a new card</p>
                  <Elements stripe={stripePromise}>
                    <AddCardForm onSuccess={handleCardAdded} onCancel={() => setShowAddCard(false)} />
                  </Elements>
                </div>
              )}
              {loadingCards ? (
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>Loading…</p>
              ) : cards.length === 0 && !showAddCard ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>No payment methods saved yet</p>
                  <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={() => setShowAddCard(true)}>Add your first card</button>
                </div>
              ) : cards.map((card) => (
                <div key={card.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  border: '1.5px solid', borderColor: card.is_default ? 'var(--color-primary)' : 'var(--color-border)',
                  borderRadius: 10, padding: '14px 16px', flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>{cardBrandIcon(card.brand)}</span>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                        {card.brand} •••• {card.last4}
                        {card.is_default && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(2,65,57,0.08)', padding: '2px 7px', borderRadius: 99 }}>Default</span>}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Expires {card.exp_month}/{card.exp_year}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!card.is_default && (
                      <button onClick={() => handleSetDefault(card.id)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: '1.5px solid var(--color-border)', background: '#fff', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                        Set default
                      </button>
                    )}
                    <button onClick={() => handleRemoveCard(card.id)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#DC2626' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Privacy tab ───────────────────────────────────────────────────── */}
        {tab === 'Privacy' && (
          <Card>
            <CardHeader title="Privacy Settings" />
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { key: 'profile_visible', label: 'Public profile', desc: 'Allow clients to view your profile and services' },
                { key: 'show_in_search',  label: 'Show in search', desc: 'Appear in search results and discovery' },
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{desc}</p>
                  </div>
                  <button
                    onClick={() => setPrivacyPrefs((p) => ({ ...p, [key]: !p[key] }))}
                    style={{
                      width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
                      background: privacyPrefs[key] ? 'var(--color-primary)' : '#CBD5E1',
                      position: 'relative', transition: 'background 0.2s',
                    }}>
                    <span style={{
                      position: 'absolute', top: 3, left: privacyPrefs[key] ? 23 : 3,
                      width: 18, height: 18, borderRadius: '50%', background: '#fff',
                      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }} />
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--color-border-light)' }}>
                <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={handleSavePrivacy} disabled={savingPrivacy}>
                  {savingPrivacy ? 'Saving…' : 'Save preferences'}
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER PAGES
───────────────────────────────────────────────────────────────────────────── */

const CustomerHome = ({ user }) => {
  const firstName = user?.first_name || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Greeting */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>
          {greeting}, {firstName}! 👋
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--color-text-muted)' }}>Ready for your next beauty appointment?</p>
      </div>

      {/* Stats */}
      <div className="db-grid-3">
        <StatCard label="Upcoming Bookings" value="0" sub="No bookings scheduled" icon={<CalSvg />} accent="var(--color-primary)" />
        <StatCard label="Past Appointments" value="0" sub="Build your history" icon={<BookSvg />} accent="var(--color-secondary)" />
        <StatCard label="Favourite Providers" value="0" sub="Save your favourites" icon={<StarSvg />} accent="#F59E0B" />
      </div>

      {/* Two columns */}
      <div className="db-grid-aside-md">

        {/* Upcoming booking */}
        <Card>
          <CardHeader
            title="Your Next Appointment"
            action={
              <Link to="/dashboard/bookings" style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                All bookings →
              </Link>
            }
          />
          <EmptyState
            icon={<CalSvg />}
            title="No upcoming appointments"
            description="Discover talented beauty professionals near you and book your first appointment."
            action={
              <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                Discover providers
              </Link>
            }
          />
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Discover CTA */}
          <div style={{
            background: 'var(--gradient-brand)',
            borderRadius: 14, padding: '22px 22px 22px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', right: 20, bottom: -30, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6, position: 'relative' }}>
              Find your perfect stylist
            </p>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 16, position: 'relative' }}>
              Browse hundreds of beauty professionals near you.
            </p>
            <Link to="/dashboard/discover" style={{
              display: 'inline-block', background: '#fff', color: 'var(--color-primary)',
              fontWeight: 700, fontSize: 12.5, padding: '8px 16px', borderRadius: 8,
              textDecoration: 'none', position: 'relative',
            }}>
              Explore now →
            </Link>
          </div>

          {/* Recent history */}
          <Card>
            <CardHeader title="Recent Visits" />
            <div style={{ padding: '16px 20px' }}>
              <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>No visits yet</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const CustomerBookings = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>My Bookings</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Your past and upcoming appointments</p>
    </div>

    {/* Filter tabs */}
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--color-border-light)' }}>
      {['Upcoming', 'Past', 'Cancelled'].map((tab, i) => (
        <button key={tab} style={{
          padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
          borderBottom: i === 0 ? '2px solid var(--color-primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>
          {tab}
        </button>
      ))}
    </div>

    <Card>
      <EmptyState
        icon={<CalSvg />}
        title="No upcoming bookings"
        description="You haven't booked any appointments yet. Find a provider and book your first session."
        action={
          <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
            Discover providers
          </Link>
        }
      />
    </Card>
  </div>
);

const CustomerDiscover = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Discover</h2>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Find beauty professionals near you</p>
    </div>

    {/* Search + filters */}
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: '1 1 300px' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', display: 'flex' }}>
          <SearchSvg />
        </span>
        <input placeholder="Search services, providers…" style={{
          width: '100%', padding: '11px 14px 11px 42px',
          border: '1.5px solid var(--color-border)', borderRadius: 10,
          fontSize: 13.5, fontFamily: 'var(--font-sans)', background: '#fff',
          outline: 'none', boxSizing: 'border-box',
        }} />
      </div>
      <button style={{ padding: '0 18px', background: '#fff', border: '1.5px solid var(--color-border)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        📍 Near me
      </button>
      <button style={{ padding: '0 18px', background: '#fff', border: '1.5px solid var(--color-border)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        Category ▾
      </button>
    </div>

    {/* Category chips */}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {['All', 'Hair & Braids', 'Lashes', 'Nails', 'Skin & Facials', 'Brows', 'Makeup', 'Wellness'].map((cat, i) => (
        <button key={cat} style={{
          padding: '7px 15px', borderRadius: 99, border: '1.5px solid',
          borderColor: i === 0 ? 'var(--color-primary)' : 'var(--color-border)',
          background: i === 0 ? 'var(--color-primary)' : '#fff',
          color: i === 0 ? '#fff' : 'var(--color-text-secondary)',
          fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.12s',
        }}>
          {cat}
        </button>
      ))}
    </div>

    {/* Provider grid placeholder */}
    <div className="db-grid-providers">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          background: '#fff', border: '1px solid var(--color-border-light)',
          borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(2,65,57,0.05)',
          cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(2,65,57,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(2,65,57,0.05)'; }}>
          {/* Cover image placeholder */}
          <div style={{ height: 130, background: `hsl(${140 + i * 20}, 25%, ${90 - i * 3}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>✂</span>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                  {['Studio Glow', 'Beauty by Ada', 'Lash Lab Berlin', 'Nail Art Studio', 'Brow Bar Co.', 'Skin & Spa'][i]}
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {['Hair & Braids', 'Makeup', 'Lashes', 'Nails', 'Brows', 'Wellness'][i]}
                </p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                background: 'rgba(73,169,108,0.1)', color: 'var(--color-secondary)',
              }}>
                New
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>📍 Berlin</span>
              <span style={{ fontSize: 11, color: 'var(--color-border)' }}>·</span>
              <span style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>From €40</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CustomerMessages = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: 'calc(100vh - 116px)' }}>
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Messages</h2>
    </div>
    <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden', background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 14, boxShadow: '0 1px 4px rgba(2,65,57,0.05)' }}>
      <div style={{ width: 300, borderRight: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--color-border-light)' }}>
          <input placeholder="Search conversations…" style={{
            width: '100%', padding: '9px 13px', border: '1.5px solid var(--color-border)',
            borderRadius: 9, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: 24 }}>No conversations yet</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <EmptyState icon={<MsgSvg />} title="No conversation selected" description="Book with a provider to start a conversation." />
      </div>
    </div>
  </div>
);

const CustomerSettings = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  /* ── form state ── */
  const [form, setForm] = useState({ first_name: '', last_name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });

  /* Sync form from user */
  useEffect(() => {
    if (user) setForm({ first_name: user.first_name || '', last_name: user.last_name || '', phone: user.phone || '' });
    if (user?.avatar_url) setAvatarPreview(user.avatar_url);
  }, [user]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── avatar pick ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'Image must be under 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── save profile ── */
  const handleProfileSave = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      showToast('error', 'First and last name are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name:  form.last_name.trim(),
        phone:      form.phone.trim() || undefined,
      };
      if (avatarPreview && avatarPreview !== user?.avatar_url) {
        payload.avatar_url = avatarPreview;
      }
      const { data } = await apiUpdateProfile(payload);
      setUser(data.user);
      showToast('success', 'Profile updated successfully');
    } catch (e) {
      showToast('error', e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /* ── change password ── */
  const handlePasswordSave = async () => {
    if (!pwForm.current_password) { showToast('error', 'Current password is required'); return; }
    if (pwForm.new_password.length < 8) { showToast('error', 'New password must be at least 8 characters'); return; }
    if (pwForm.new_password !== pwForm.confirm_password) { showToast('error', 'Passwords do not match'); return; }
    setSaving(true);
    try {
      await apiChangePassword({ current_password: pwForm.current_password, new_password: pwForm.new_password });
      setPwForm({ current_password: '', new_password: '', confirm_password: '' });
      showToast('success', 'Password changed successfully');
    } catch (e) {
      showToast('error', e.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  /* ── preferences state ── */
  const DEFAULT_NOTIF  = { booking_confirmations: true, appointment_reminders: true, new_messages: true, promotional_offers: false, security_alerts: true };
  const DEFAULT_PRIVACY = { profile_visibility: true, booking_history_sharing: false, analytics: true };
  const [notifPrefs,  setNotifPrefs]  = useState(DEFAULT_NOTIF);
  const [privacyPrefs, setPrivacyPrefs] = useState(DEFAULT_PRIVACY);
  const [prefsLoading, setPrefsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'Notifications' || activeTab === 'Privacy') {
      setPrefsLoading(true);
      apiGetPrefs()
        .then(({ data }) => {
          if (data.preferences?.notifications) setNotifPrefs(data.preferences.notifications);
          if (data.preferences?.privacy)       setPrivacyPrefs(data.preferences.privacy);
        })
        .catch(() => {})
        .finally(() => setPrefsLoading(false));
    }
  }, [activeTab]);

  const handlePrefsSave = async (type) => {
    setSaving(true);
    try {
      const payload = type === 'notifications'
        ? { notifications: notifPrefs }
        : { privacy: privacyPrefs };
      await apiUpdatePrefs(payload);
      showToast('success', 'Preferences saved');
    } catch (e) {
      showToast('error', e.response?.data?.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  /* SVG icons for the settings sidebar */
  const TabIcons = {
    Profile:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Password:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    Notifications:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    'Payment Methods': () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    Privacy:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  };

  const TABS = ['Profile', 'Password', 'Notifications', 'Payment Methods', 'Privacy'];

  const IS = { /* inputStyle */
    padding: '10px 13px', border: '1.5px solid var(--color-border)', borderRadius: 9,
    fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
    width: '100%', boxSizing: 'border-box', color: 'var(--color-text-primary)', background: '#fff',
  };
  const LS = { fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-primary)' }; /* labelStyle */
  const FS = { display: 'flex', flexDirection: 'column', gap: 5 };                    /* fieldStyle */

  const pwStrength = pwForm.new_password.length >= 12 ? 3 : pwForm.new_password.length >= 8 ? 2 : pwForm.new_password.length > 0 ? 1 : 0;
  const pwStrengthColor  = ['#CBD5E1', '#dc2626', '#F59E0B', '#16a34a'][pwStrength];
  const pwStrengthLabel  = ['', 'Weak', 'Good', 'Strong'][pwStrength];
  const pwStrengthWidth  = [0, 33, 66, 100][pwStrength];

  const initials = `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || '?';

  /* ── payment cards (real Stripe) ── */
  const [cards, setCards]             = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [showAddCard, setShowAddCard]   = useState(false);

  useEffect(() => {
    if (activeTab !== 'Payment Methods') return;
    setLoadingCards(true);
    listPaymentMethods()
      .then(({ data }) => setCards(data.payment_methods || []))
      .catch(() => {})
      .finally(() => setLoadingCards(false));
  }, [activeTab]);

  const handleCardAdded = async () => {
    setShowAddCard(false);
    setLoadingCards(true);
    const { data } = await listPaymentMethods();
    setCards(data.payment_methods || []);
    setLoadingCards(false);
    showToast('success', 'Card saved successfully');
  };

  const handleRemoveCard = async (pmId) => {
    try {
      await removePaymentMethod(pmId);
      setCards((c) => c.filter((x) => x.id !== pmId));
      showToast('success', 'Card removed');
    } catch { showToast('error', 'Failed to remove card'); }
  };

  const handleSetDefault = async (pmId) => {
    try {
      await setDefaultPaymentMethod(pmId);
      setCards((c) => c.map((x) => ({ ...x, is_default: x.id === pmId })));
      showToast('success', 'Default card updated');
    } catch { showToast('error', 'Failed to update default'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Toast toast={toast} />

      {/* Page heading */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Manage your account preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Sidebar tabs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {TABS.map((id) => {
            const active = activeTab === id;
            const Icon = TabIcons[id];
            return (
              <button key={id} onClick={() => setActiveTab(id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: active ? 'rgba(2,65,57,0.08)' : 'transparent',
                border: 'none', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                fontSize: 13.5, fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-bg-muted)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)', display: 'flex' }}><Icon /></span>
                {id}
              </button>
            );
          })}
        </div>

        {/* ── Content panel ── */}
        <div>

          {/* ════ PROFILE ════ */}
          {activeTab === 'Profile' && (
            <Card>
              <CardHeader title="Profile Information" />
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {avatarPreview
                      ? <img src={avatarPreview} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-border-light)' }} />
                      : (
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}>
                          {initials}
                        </div>
                      )
                    }
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'var(--color-primary)', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#fff', fontSize: 13,
                      }}
                    >✎</button>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>{user?.first_name} {user?.last_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{user?.email}</p>
                    <button onClick={() => fileRef.current?.click()} style={{ marginTop: 8, fontSize: 12.5, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: '1.5px solid var(--color-primary)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer' }}>
                      Change photo
                    </button>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>JPG, PNG · Max 5 MB</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </div>

                {/* Name row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={FS}>
                    <label style={LS}>First name</label>
                    <input value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} style={IS} />
                  </div>
                  <div style={FS}>
                    <label style={LS}>Last name</label>
                    <input value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} style={IS} />
                  </div>
                </div>

                {/* Email — read-only */}
                <div style={FS}>
                  <label style={LS}>Email address</label>
                  <input value={user?.email || ''} readOnly style={{ ...IS, background: '#F8FAFC', color: 'var(--color-text-muted)', cursor: 'not-allowed' }} />
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Email address cannot be changed</p>
                </div>

                {/* Phone */}
                <div style={FS}>
                  <label style={LS}>Phone number</label>
                  <PhoneInput value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} />
                </div>

                {/* Verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                    background: user?.is_email_verified ? '#dcfce7' : '#fef3c7',
                    color: user?.is_email_verified ? '#16a34a' : '#d97706',
                  }}>
                    {user?.is_email_verified ? '✓ Email verified' : '! Email not verified'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
                  <button onClick={handleProfileSave} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, minWidth: 120, opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* ════ PASSWORD ════ */}
          {activeTab === 'Password' && (
            <Card>
              <CardHeader title="Change Password" />
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={FS}>
                  <label style={LS}>Current password</label>
                  <input type="password" value={pwForm.current_password} onChange={(e) => setPwForm(f => ({ ...f, current_password: e.target.value }))} placeholder="Enter your current password" style={IS} />
                </div>
                <div style={FS}>
                  <label style={LS}>New password</label>
                  <input type="password" value={pwForm.new_password} onChange={(e) => setPwForm(f => ({ ...f, new_password: e.target.value }))} placeholder="At least 8 characters" style={IS} />
                  {pwForm.new_password.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{ height: 4, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, width: `${pwStrengthWidth}%`, background: pwStrengthColor, transition: 'width 0.3s, background 0.3s' }} />
                      </div>
                      <p style={{ fontSize: 11, color: pwStrengthColor, marginTop: 4, fontWeight: 600 }}>{pwStrengthLabel}</p>
                    </div>
                  )}
                </div>
                <div style={FS}>
                  <label style={LS}>Confirm new password</label>
                  <input
                    type="password"
                    value={pwForm.confirm_password}
                    onChange={(e) => setPwForm(f => ({ ...f, confirm_password: e.target.value }))}
                    placeholder="Repeat your new password"
                    style={{ ...IS, borderColor: pwForm.confirm_password && pwForm.confirm_password !== pwForm.new_password ? '#dc2626' : 'var(--color-border)' }}
                  />
                  {pwForm.confirm_password && pwForm.confirm_password !== pwForm.new_password && (
                    <p style={{ fontSize: 11, color: '#dc2626', fontWeight: 600 }}>Passwords do not match</p>
                  )}
                </div>
                <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(2,65,57,0.04)', border: '1px solid rgba(2,65,57,0.1)' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                    🔐 Use 8+ characters with a mix of letters, numbers, and symbols for a strong password.
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handlePasswordSave} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, minWidth: 140, opacity: saving ? 0.7 : 1 }}>
                    {saving ? 'Updating…' : 'Update password'}
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* ════ NOTIFICATIONS ════ */}
          {activeTab === 'Notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" />
              {prefsLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>Loading…</div>
              ) : (
                <div style={{ padding: '8px 28px 8px' }}>
                  {[
                    { key: 'booking_confirmations', label: 'Booking confirmations',  sub: 'Get notified when an appointment is confirmed'     },
                    { key: 'appointment_reminders', label: 'Appointment reminders',  sub: 'Reminder 24 hours before your booking'             },
                    { key: 'new_messages',          label: 'New messages',           sub: 'When you receive a message from a provider'        },
                    { key: 'promotional_offers',    label: 'Promotional offers',     sub: 'Deals and discounts from providers you follow'     },
                    { key: 'security_alerts',       label: 'Security alerts',        sub: 'Unusual sign-in attempts or password changes'      },
                  ].map(({ key, label, sub }, i, arr) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                    }}>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>{sub}</p>
                      </div>
                      <ToggleSwitch
                        key={key + notifPrefs[key]}
                        defaultOn={!!notifPrefs[key]}
                        onChange={(val) => setNotifPrefs(p => ({ ...p, [key]: val }))}
                      />
                    </div>
                  ))}
                  <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => handlePrefsSave('notifications')} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, minWidth: 120, opacity: saving ? 0.7 : 1 }}>
                      {saving ? 'Saving…' : 'Save preferences'}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ════ PAYMENT METHODS ════ */}
          {activeTab === 'Payment Methods' && (
            <Card>
              <CardHeader
                title="Payment Methods"
                action={!showAddCard && (
                  <button onClick={() => setShowAddCard(true)} style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    + Add card
                  </button>
                )}
              />
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {showAddCard && (
                  <div style={{ background: 'var(--color-bg-muted)', borderRadius: 10, padding: '18px 20px' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 14 }}>Add a new card</p>
                    <Elements stripe={stripePromise}>
                      <AddCardForm onSuccess={handleCardAdded} onCancel={() => setShowAddCard(false)} />
                    </Elements>
                  </div>
                )}
                {loadingCards ? (
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>Loading…</p>
                ) : cards.length === 0 && !showAddCard ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(2,65,57,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💳</div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>No cards saved</p>
                    <p style={{ fontSize: 12.5, color: 'var(--color-text-muted)', maxWidth: 280, lineHeight: 1.6 }}>Add a card to pay for bookings quickly without re-entering details.</p>
                    <button className="btn btn-primary" style={{ fontSize: 13, marginTop: 4 }} onClick={() => setShowAddCard(true)}>Add your first card</button>
                  </div>
                ) : cards.map((card) => (
                  <div key={card.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    border: '1.5px solid', borderColor: card.is_default ? 'var(--color-primary)' : 'var(--color-border)',
                    borderRadius: 10, padding: '14px 16px', flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 22 }}>💳</span>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                          {card.brand} •••• {card.last4}
                          {card.is_default && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(2,65,57,0.08)', padding: '2px 7px', borderRadius: 99 }}>Default</span>}
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Expires {card.exp_month}/{card.exp_year}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {!card.is_default && (
                        <button onClick={() => handleSetDefault(card.id)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: '1.5px solid var(--color-border)', background: '#fff', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                          Set default
                        </button>
                      )}
                      <button onClick={() => handleRemoveCard(card.id)} style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: '1.5px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#DC2626' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ════ PRIVACY ════ */}
          {activeTab === 'Privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card>
                <CardHeader title="Privacy & Data" />
                {prefsLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>Loading…</div>
                ) : (
                  <div style={{ padding: '8px 28px 8px' }}>
                    {[
                      { key: 'profile_visibility',       label: 'Profile visibility',      sub: 'Allow providers to view your profile during bookings' },
                      { key: 'booking_history_sharing',  label: 'Booking history sharing', sub: 'Share your visit history with providers you book'     },
                      { key: 'analytics',                label: 'Analytics',               sub: 'Help improve Edenly with anonymous usage data'        },
                    ].map(({ key, label, sub }, i, arr) => (
                      <div key={key} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 0',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                      }}>
                        <div>
                          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>{label}</p>
                          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 3 }}>{sub}</p>
                        </div>
                        <ToggleSwitch
                          key={key + privacyPrefs[key]}
                          defaultOn={!!privacyPrefs[key]}
                          onChange={(val) => setPrivacyPrefs(p => ({ ...p, [key]: val }))}
                        />
                      </div>
                    ))}
                    <div style={{ padding: '16px 0', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => handlePrefsSave('privacy')} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, minWidth: 120, opacity: saving ? 0.7 : 1 }}>
                        {saving ? 'Saving…' : 'Save preferences'}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
              <Card>
                <CardHeader title="Danger Zone" />
                <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                    Deleting your account is permanent. All your bookings, history, and data will be erased and cannot be recovered.
                  </p>
                  <button style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', width: 'fit-content' }}>
                    Delete my account
                  </button>
                </div>
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Shared finance helpers
───────────────────────────────────────────────────────────────────────────── */
const Badge = ({ label, color = '#64748B', bg }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '3px 10px', borderRadius: 20,
    fontSize: 11.5, fontWeight: 600,
    color, background: bg || `${color}18`,
  }}>{label}</span>
);

const StatusBadge = ({ status }) => {
  const map = {
    completed:  { label: 'Completed',  color: '#16a34a', bg: '#dcfce7' },
    paid:       { label: 'Paid',       color: '#16a34a', bg: '#dcfce7' },
    pending:    { label: 'Pending',    color: '#d97706', bg: '#fef3c7' },
    processing: { label: 'Processing', color: '#2563eb', bg: '#dbeafe' },
    failed:     { label: 'Failed',     color: '#dc2626', bg: '#fee2e2' },
    refunded:   { label: 'Refunded',   color: '#7c3aed', bg: '#ede9fe' },
    active:     { label: 'Active',     color: '#16a34a', bg: '#dcfce7' },
    cancelled:  { label: 'Cancelled',  color: '#dc2626', bg: '#fee2e2' },
  };
  const s = map[status?.toLowerCase()] || { label: status, color: '#64748B', bg: '#F1F5F9' };
  return <Badge label={s.label} color={s.color} bg={s.bg} />;
};

const TableHeader = ({ cols }) => (
  <thead>
    <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
      {cols.map((col) => (
        <th key={col} style={{
          padding: '11px 16px', textAlign: 'left',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap',
        }}>{col}</th>
      ))}
    </tr>
  </thead>
);

const FilterTabs = ({ tabs, active, onSelect }) => (
  <div style={{ display: 'flex', gap: 4, padding: '4px', background: '#F1F5F9', borderRadius: 10, width: 'fit-content' }}>
    {tabs.map((tab) => (
      <button key={tab} onClick={() => onSelect(tab)} style={{
        padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
        fontSize: 12.5, fontWeight: 600, transition: 'all 0.14s',
        background: active === tab ? '#fff' : 'transparent',
        color: active === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        boxShadow: active === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
      }}>{tab}</button>
    ))}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Payouts
───────────────────────────────────────────────────────────────────────────── */
const ProviderPayouts = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Payouts</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Track your earnings and payout history</p>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 13 }}>Request Payout</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Earned" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="Pending Payout" value="€0.00" sub="Processing in 2–5 days" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        } accent="#F59E0B" />
        <StatCard label="Last Payout" value="—" sub="No payouts yet" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        } accent="var(--color-secondary)" />
      </div>

      {/* Bank account alert */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderRadius: 12,
        background: 'rgba(2,65,57,0.06)', border: '1px solid rgba(2,65,57,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(2,65,57,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-primary)' }}>Connect your bank account</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>Add a bank account to receive payouts from your bookings</p>
          </div>
        </div>
        <button className="btn btn-primary" style={{ fontSize: 12.5, padding: '8px 16px' }}>Connect Bank</button>
      </div>

      {/* Payout history */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Payout History</p>
          <FilterTabs tabs={['All', 'Pending', 'Completed', 'Failed']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Reference', 'Bank Account', 'Amount', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={5}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
                  title="No payouts yet"
                  description="Once you receive bookings and enable payouts, your payout history will appear here."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Transactions
───────────────────────────────────────────────────────────────────────────── */
const ProviderTransactions = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Transactions</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>All service order payments and revenue</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 9, border: '1.5px solid var(--color-border)',
          background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Revenue" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="This Month" value="€0.00" sub="March 2026" icon={<CalSvg />} accent="var(--color-secondary)" />
        <StatCard label="Avg. Transaction" value="—" sub="No data yet" icon={<ChartSvg />} accent="#7C3AED" />
      </div>

      {/* Table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Transaction History</p>
          <FilterTabs tabs={['All', 'Completed', 'Pending', 'Refunded']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Client', 'Service', 'Gross', 'Platform Fee', 'Net', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
                  title="No transactions yet"
                  description="Service order transactions will appear here once clients start booking your services."
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROVIDER — Subscription
───────────────────────────────────────────────────────────────────────────── */
const ProviderSubscription = () => {
  const plans = [
    {
      name: 'Free',
      price: '€0',
      period: 'forever',
      current: true,
      color: '#64748B',
      features: ['Up to 30 bookings/mo', '1 staff member', 'Basic calendar', 'Client management', 'Email support'],
    },
    {
      name: 'Starter',
      price: '€29',
      period: '/month',
      current: false,
      color: 'var(--color-secondary)',
      recommended: false,
      features: ['Up to 200 bookings/mo', 'Up to 3 staff', 'Advanced calendar', 'Automated reminders', 'Reports & analytics', 'Priority support'],
    },
    {
      name: 'Pro',
      price: '€79',
      period: '/month',
      current: false,
      color: '#7C3AED',
      recommended: true,
      features: ['Unlimited bookings', 'Unlimited staff', 'Custom branding', 'Online payments', 'Advanced reports', 'API access', 'Dedicated support'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Subscription</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Manage your plan and billing</p>
      </div>

      {/* Current plan banner */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', borderRadius: 14,
        background: 'linear-gradient(135deg, #024139 0%, #0A544A 60%, #49A96C 100%)',
        color: '#fff',
      }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>Current Plan</p>
          <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em' }}>Free Plan</p>
          <p style={{ fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>30 bookings/month · 1 staff member</p>
        </div>
        <button style={{
          background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)',
          color: '#fff', padding: '9px 20px', borderRadius: 9,
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          backdropFilter: 'blur(4px)',
        }}>
          Upgrade Plan
        </button>
      </div>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            background: '#fff', borderRadius: 14, overflow: 'hidden',
            border: plan.recommended ? '2px solid #7C3AED' : '1px solid var(--color-border-light)',
            boxShadow: plan.recommended ? '0 4px 20px rgba(124,58,237,0.12)' : '0 1px 4px rgba(2,65,57,0.05)',
            position: 'relative',
          }}>
            {plan.recommended && (
              <div style={{
                background: '#7C3AED', color: '#fff', textAlign: 'center',
                padding: '5px', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Most Popular
              </div>
            )}
            <div style={{ padding: '22px 22px 20px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: plan.color, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{plan.name}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.04em' }}>{plan.price}</span>
                <span style={{ fontSize: 12.5, color: 'var(--color-text-muted)', fontWeight: 500 }}>{plan.period}</span>
              </div>
              <div style={{ height: 1, background: 'var(--color-border-light)', margin: '16px 0' }} />
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <div style={{ padding: '9px', textAlign: 'center', borderRadius: 9, background: '#F1F5F9', fontSize: 12.5, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Current Plan
                </div>
              ) : (
                <button style={{
                  width: '100%', padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: plan.recommended ? '#7C3AED' : 'var(--color-primary)',
                  color: '#fff', fontSize: 13, fontWeight: 600, transition: 'opacity 0.14s',
                }}>
                  Upgrade to {plan.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Billing history */}
      <Card>
        <CardHeader title="Billing History" />
        <EmptyState
          icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          title="No billing history"
          description="Invoices and receipts for your subscription will appear here."
        />
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER — Invoices
───────────────────────────────────────────────────────────────────────────── */
const CustomerInvoices = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Invoices</h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>View and download your service invoices</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 16px', borderRadius: 9, border: '1.5px solid var(--color-border)',
          background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download All
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Spent" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="Paid Invoices" value="0" sub="Successfully paid" icon={<BookSvg />} accent="var(--color-secondary)" />
        <StatCard label="Pending" value="0" sub="Awaiting payment" icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        } accent="#F59E0B" />
      </div>

      {/* Invoices table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Invoice History</p>
          <FilterTabs tabs={['All', 'Paid', 'Pending']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Invoice #', 'Provider', 'Service', 'Date', 'Amount', 'Status', '']} />
          <tbody>
            <tr>
              <td colSpan={7}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  title="No invoices yet"
                  description="After you book and pay for services, your invoices will appear here for download."
                  action={
                    <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                      Discover services
                    </Link>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOMER — Transactions
───────────────────────────────────────────────────────────────────────────── */
const CustomerTransactions = () => {
  const [tab, setTab] = useState('All');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Transactions</h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 3 }}>Your payment history for service orders</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Spent" value="€0.00" sub="All time" icon={<EuroSvg />} accent="var(--color-primary)" />
        <StatCard label="This Month" value="€0.00" sub="March 2026" icon={<CalSvg />} accent="var(--color-secondary)" />
        <StatCard label="Bookings Paid" value="0" sub="Total services paid" icon={<BookSvg />} accent="#7C3AED" />
      </div>

      {/* Transactions table */}
      <Card>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>Payment History</p>
          <FilterTabs tabs={['All', 'Completed', 'Pending', 'Refunded']} active={tab} onSelect={setTab} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Date', 'Description', 'Provider', 'Payment Method', 'Amount', 'Status']} />
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyState
                  icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
                  title="No transactions yet"
                  description="Payment transactions for your service bookings will appear here."
                  action={
                    <Link to="/dashboard/discover" className="btn btn-primary" style={{ fontSize: 13 }}>
                      Book a service
                    </Link>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Page title map (for top bar)
───────────────────────────────────────────────────────────────────────────── */
const PAGE_TITLES = {
  '/dashboard':                'Home',
  '/dashboard/calendar':       'Calendar',
  '/dashboard/bookings':       'Bookings',
  '/dashboard/clients':        'Clients',
  '/dashboard/services':       'Services',
  '/dashboard/payouts':        'Payouts',
  '/dashboard/transactions':   'Transactions',
  '/dashboard/subscription':   'Subscription',
  '/dashboard/invoices':       'Invoices',
  '/dashboard/messages':       'Messages',
  '/dashboard/reports':        'Reports',
  '/dashboard/discover':       'Discover',
  '/dashboard/settings':       'Settings',
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main DashboardPage
───────────────────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, role } = useAuth();
  const isProvider = role === 'provider';
  const navItems   = isProvider ? PROVIDER_NAV : CUSTOMER_NAV;

  return (
    <DashboardLayout navItems={navItems} pageTitleMap={PAGE_TITLES}>
      <Routes>
        {isProvider ? (
          <>
            <Route index                  element={<ProviderHome user={user} />} />
            <Route path="calendar"        element={<ProviderCalendar />} />
            <Route path="bookings"        element={<ProviderBookings />} />
            <Route path="clients"         element={<ProviderClients />} />
            <Route path="services"        element={<ProviderServices />} />
            <Route path="payouts"         element={<ProviderPayouts />} />
            <Route path="transactions"    element={<ProviderTransactions />} />
            <Route path="subscription"    element={<ProviderSubscription />} />
            <Route path="messages"        element={<ProviderMessages />} />
            <Route path="reports"         element={<ProviderReports />} />
            <Route path="settings"        element={<ProviderSettings />} />
          </>
        ) : (
          <>
            <Route index                  element={<CustomerHome user={user} />} />
            <Route path="bookings"        element={<CustomerBookings />} />
            <Route path="discover"        element={<CustomerDiscover />} />
            <Route path="invoices"        element={<CustomerInvoices />} />
            <Route path="messages"        element={<CustomerMessages />} />
            <Route path="settings"        element={<CustomerSettings />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
