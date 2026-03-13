-- ── 002: Auth, Roles & Tokens ──────────────────────────────────────────────

-- Extend users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS first_name     VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_name      VARCHAR(100),
  ADD COLUMN IF NOT EXISTS password_hash  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS role           VARCHAR(50)  NOT NULL DEFAULT 'customer',
  ADD COLUMN IF NOT EXISTS phone          VARCHAR(30),
  ADD COLUMN IF NOT EXISTS avatar_url     TEXT,
  ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN  NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMP    NOT NULL DEFAULT NOW();

-- Remove old name column if it was the only name field (rename to first_name safe fallback)
-- (If 'name' column exists we keep it for safety; Phase 1 uses first_name + last_name)

-- Dynamic roles table
CREATE TABLE IF NOT EXISTS roles (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50)  UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB        NOT NULL DEFAULT '{}',
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO roles (name, description, permissions) VALUES
  ('customer', 'Regular customer who can book services',      '{"book": true, "review": true}'),
  ('provider', 'Service provider who can offer services',     '{"manage_profile": true, "manage_bookings": true}'),
  ('admin',    'Platform administrator with full access',     '{"all": true}')
ON CONFLICT (name) DO NOTHING;

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_evt_token   ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_evt_user_id ON email_verification_tokens(user_id);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  used       BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_prt_token   ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id);

-- Refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      VARCHAR(512) UNIQUE NOT NULL,
  expires_at TIMESTAMP    NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rt_token   ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_rt_user_id ON refresh_tokens(user_id);
