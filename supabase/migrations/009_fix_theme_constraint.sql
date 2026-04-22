-- 009_fix_theme_constraint.sql
-- Allow all 8 themes including health_food and education
ALTER TABLE sample_problems
  DROP CONSTRAINT IF EXISTS sample_problems_theme_check;

ALTER TABLE sample_problems
  ADD CONSTRAINT sample_problems_theme_check
  CHECK (theme IN (
    'travel', 'technology', 'environment', 'community',
    'daily_life', 'business', 'health_food', 'education'
  ));
