-- ── 004: Phase 2–4 Stub Tables ───────────────────────────────────────────────
-- Schema prepared; business logic wired in later phases.

-- Bookings (Phase 3)
CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      VARCHAR(50) NOT NULL DEFAULT 'pending',
  notes       TEXT,
  booked_at   TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payments (Phase 3)
CREATE TABLE IF NOT EXISTS payments (
  id          SERIAL PRIMARY KEY,
  booking_id  INTEGER        REFERENCES bookings(id) ON DELETE SET NULL,
  user_id     INTEGER        REFERENCES users(id)    ON DELETE SET NULL,
  amount      DECIMAL(10,2)  NOT NULL DEFAULT 0,
  currency    VARCHAR(3)     NOT NULL DEFAULT 'EUR',
  status      VARCHAR(50)    NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- Subscriptions (Phase 3)
CREATE TABLE IF NOT EXISTS subscriptions (
  id          SERIAL PRIMARY KEY,
  provider_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan        VARCHAR(50)  NOT NULL DEFAULT 'basic',
  status      VARCHAR(50)  NOT NULL DEFAULT 'inactive',
  stripe_subscription_id VARCHAR(255),
  current_period_end TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Conversations (Phase 4 chat)
CREATE TABLE IF NOT EXISTS conversations (
  id          SERIAL PRIMARY KEY,
  customer_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, provider_id)
);

-- Messages (Phase 4 chat)
CREATE TABLE IF NOT EXISTS messages (
  id              SERIAL PRIMARY KEY,
  conversation_id INTEGER   NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content         TEXT      NOT NULL,
  is_read         BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Referrals (Phase 4)
CREATE TABLE IF NOT EXISTS referrals (
  id          SERIAL PRIMARY KEY,
  referrer_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_id  INTEGER            REFERENCES users(id) ON DELETE SET NULL,
  code        VARCHAR(50) UNIQUE NOT NULL,
  used        BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reviews (Phase 3)
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  booking_id  INTEGER   REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating      SMALLINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
