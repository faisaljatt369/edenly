-- ── 008: Stripe Customer ID on Users ─────────────────────────────────────────
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
