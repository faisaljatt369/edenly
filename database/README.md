# Database Setup

## Requirements
- PostgreSQL installed and running

## Setup
1. Run the migration:
   ```bash
   psql -U postgres -f migrations/001_init.sql
   ```
2. Copy `.env.example` to `.env` in the backend folder and fill in your DB credentials.
