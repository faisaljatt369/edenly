-- ── 003: Categories & Provider Profiles ─────────────────────────────────────

-- Dynamic service categories
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) UNIQUE NOT NULL,
  icon       VARCHAR(50),
  is_active  BOOLEAN   NOT NULL DEFAULT TRUE,
  sort_order INTEGER   NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Hair & Beauty',    'hair-beauty',    'scissors',  1),
  ('Wellness & Spa',   'wellness-spa',   'sparkles',  2),
  ('Fitness & Training','fitness-training','dumbbell', 3),
  ('Skin & Care',      'skin-care',      'leaf',      4),
  ('Nails & Makeup',   'nails-makeup',   'brush',     5),
  ('Other',            'other',          'star',      6)
ON CONFLICT (slug) DO NOTHING;

-- Provider profiles
CREATE TABLE IF NOT EXISTS provider_profiles (
  id                      SERIAL PRIMARY KEY,
  user_id                 INTEGER      UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name           VARCHAR(150),
  category_id             INTEGER      REFERENCES categories(id) ON DELETE SET NULL,
  description             TEXT,
  address                 TEXT,
  city                    VARCHAR(100),
  postal_code             VARCHAR(20),
  country                 VARCHAR(100) NOT NULL DEFAULT 'Germany',
  latitude                DECIMAL(10,8),
  longitude               DECIMAL(11,8),
  onboarding_step         INTEGER      NOT NULL DEFAULT 1,
  is_onboarding_complete  BOOLEAN      NOT NULL DEFAULT FALSE,
  is_active               BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pp_user_id     ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pp_category_id ON provider_profiles(category_id);
CREATE INDEX IF NOT EXISTS idx_pp_city        ON provider_profiles(city);
