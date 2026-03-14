-- ── 007: Full Provider Onboarding Schema ─────────────────────────────────────

-- ── 1. Extend provider_profiles ──────────────────────────────────────────────
ALTER TABLE provider_profiles
  ADD COLUMN IF NOT EXISTS instagram            VARCHAR(100),
  ADD COLUMN IF NOT EXISTS tiktok              VARCHAR(100),
  ADD COLUMN IF NOT EXISTS service_type        VARCHAR(20)   NOT NULL DEFAULT 'studio', -- studio | mobile | both
  ADD COLUMN IF NOT EXISTS cancellation_policy VARCHAR(20)   NOT NULL DEFAULT '24h',    -- 24h | 72h
  ADD COLUMN IF NOT EXISTS buffer_time         INTEGER       NOT NULL DEFAULT 0,         -- minutes between bookings
  ADD COLUMN IF NOT EXISTS deposit_type        VARCHAR(20)   NOT NULL DEFAULT 'none',   -- none | fixed | percentage
  ADD COLUMN IF NOT EXISTS deposit_value       DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stripe_account_id   VARCHAR(255),
  ADD COLUMN IF NOT EXISTS is_stripe_connected BOOLEAN       NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step     INTEGER       NOT NULL DEFAULT 1;        -- already added in 003 but safe

-- ── 2. Replace generic categories with Edenly-specific ones ──────────────────
-- Keep old slugs in place; upsert the ones we need
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Hair',               'hair',               'scissors',  1),
  ('Braids',             'braids',             'scissors',  2),
  ('Nails',              'nails',              'brush',     3),
  ('Lashes',             'lashes',             'eye',       4),
  ('Brows',              'brows',              'feather',   5),
  ('Makeup',             'makeup',             'sparkles',  6),
  ('Tooth Gems',         'tooth-gems',         'gem',       7),
  ('Laser Hair Removal', 'laser-hair-removal', 'zap',       8)
ON CONFLICT (slug) DO UPDATE SET
  name       = EXCLUDED.name,
  icon       = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ── 3. Provider ↔ Category (many-to-many) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_categories (
  id          SERIAL    PRIMARY KEY,
  provider_id INTEGER   NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  category_id INTEGER   NOT NULL REFERENCES categories(id)        ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (provider_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_pcat_provider ON provider_categories(provider_id);

-- ── 4. Provider Services ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_services (
  id          SERIAL        PRIMARY KEY,
  provider_id INTEGER       NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  category_id INTEGER                REFERENCES categories(id)        ON DELETE SET NULL,
  name        VARCHAR(150)  NOT NULL,
  price       DECIMAL(10,2),          -- NULL = set per variant
  duration    INTEGER,                -- minutes; NULL = set per variant
  description TEXT,
  is_custom   BOOLEAN       NOT NULL DEFAULT FALSE,
  is_approved BOOLEAN       NOT NULL DEFAULT TRUE,  -- custom services → FALSE until admin approves
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  sort_order  INTEGER       NOT NULL DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_svc_provider ON provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_svc_category ON provider_services(category_id);

-- ── 5. Service Variants (e.g. Short/Medium/Long Braids) ──────────────────────
CREATE TABLE IF NOT EXISTS service_variants (
  id         SERIAL        PRIMARY KEY,
  service_id INTEGER       NOT NULL REFERENCES provider_services(id) ON DELETE CASCADE,
  name       VARCHAR(100)  NOT NULL,
  price      DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration   INTEGER       NOT NULL DEFAULT 60,  -- minutes
  sort_order INTEGER       NOT NULL DEFAULT 0,
  created_at TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_variant_service ON service_variants(service_id);

-- ── 6. Weekly Availability ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_availability (
  id          SERIAL    PRIMARY KEY,
  provider_id INTEGER   NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  day_of_week SMALLINT  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon … 6=Sat
  start_time  TIME      NOT NULL,
  end_time    TIME      NOT NULL,
  is_active   BOOLEAN   NOT NULL DEFAULT TRUE,
  UNIQUE (provider_id, day_of_week)
);

-- ── 7. Blocked Times (vacations, breaks, personal time) ─────────────────────
CREATE TABLE IF NOT EXISTS provider_blocked_times (
  id          SERIAL       PRIMARY KEY,
  provider_id INTEGER      NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  date        DATE         NOT NULL,
  start_time  TIME,                   -- NULL = full day blocked
  end_time    TIME,
  note        VARCHAR(255),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blocked_provider ON provider_blocked_times(provider_id);
CREATE INDEX IF NOT EXISTS idx_blocked_date     ON provider_blocked_times(date);

-- ── 8. Portfolio ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_portfolio (
  id          SERIAL    PRIMARY KEY,
  provider_id INTEGER   NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  image_url   TEXT      NOT NULL,
  sort_order  INTEGER   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_portfolio_provider ON provider_portfolio(provider_id);
