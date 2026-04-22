#!/bin/bash
# scripts/export-staging-seed.sh
# Exports production sample_problems as static SQL for staging DB import.
#
# Usage:
#   bash scripts/export-staging-seed.sh > scripts/staging-seed.sql
#
# Prerequisites:
#   - psql installed (brew install postgresql)
#   - SUPABASE_DB_URL set in .env.local
#     Get from: Supabase Dashboard → Settings → Database → Connection string → URI
#     Format: postgresql://postgres:[password]@[host]:5432/postgres

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: .env.local not found at $ENV_FILE" >&2
  exit 1
fi

# Load env vars
set -o allexport
source "$ENV_FILE"
set +o allexport

if [[ -z "$SUPABASE_DB_URL" ]]; then
  echo "ERROR: SUPABASE_DB_URL is not set in .env.local" >&2
  echo "  Add: SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:5432/postgres" >&2
  exit 1
fi

echo "-- staging-seed.sql: exported from production sample_problems"
echo "-- Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "-- Import to staging: paste into Supabase Dashboard → SQL Editor"
echo ""
echo "TRUNCATE TABLE sample_problems RESTART IDENTITY CASCADE;"
echo ""

psql "$SUPABASE_DB_URL" \
  --no-psqlrc \
  --tuples-only \
  --no-align \
  --command "
    SELECT
      'INSERT INTO sample_problems (boss_type, theme, difficulty, scenario, passage_html, questions, trick_hint) VALUES (' ||
      quote_literal(boss_type) || ', ' ||
      quote_literal(theme) || ', ' ||
      difficulty || ', ' ||
      quote_literal(scenario) || ', ' ||
      quote_literal(passage_html) || ', ' ||
      quote_literal(questions::text) || '::jsonb, ' ||
      COALESCE(quote_literal(trick_hint), 'NULL') ||
      ');'
    FROM sample_problems
    ORDER BY boss_type, theme, difficulty, id;
  "

echo ""
echo "-- Export complete"
