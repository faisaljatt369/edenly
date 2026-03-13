-- ─────────────────────────────────────────────────────────────────────────────
-- 005_legal_consents.sql
-- Stores GDPR consent records captured at registration and for providers
-- ─────────────────────────────────────────────────────────────────────────────

-- Legal consents: one row per consent event per user
CREATE TABLE IF NOT EXISTS legal_consents (
  id             BIGSERIAL PRIMARY KEY,
  user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type   VARCHAR(64) NOT NULL,   -- 'terms', 'privacy', 'provider_legal'
  version        VARCHAR(32) NOT NULL DEFAULT '1.0',
  consented_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address     INET,
  user_agent     TEXT
);

CREATE INDEX IF NOT EXISTS idx_legal_consents_user_id ON legal_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_consents_type    ON legal_consents(consent_type);

-- Add phone to users if it wasn't already added in 002
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(32);

-- Add business_name to provider_profiles if missing
ALTER TABLE provider_profiles ADD COLUMN IF NOT EXISTS business_name VARCHAR(255);
