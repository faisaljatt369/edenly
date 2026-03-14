-- ── 006: Fix legacy `name` column on users ───────────────────────────────────
-- The original 001_init.sql created `name VARCHAR(100) NOT NULL`.
-- Phase 1 replaced it with first_name + last_name.
-- This migration makes `name` nullable so existing DBs aren't broken.

ALTER TABLE users ALTER COLUMN name DROP NOT NULL;
ALTER TABLE users ALTER COLUMN name SET DEFAULT NULL;
