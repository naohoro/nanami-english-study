-- Run in Supabase Dashboard > SQL Editor

-- Expand boss_type constraint in sample_problems
ALTER TABLE sample_problems DROP CONSTRAINT IF EXISTS sample_problems_boss_type_check;
ALTER TABLE sample_problems ADD CONSTRAINT sample_problems_boss_type_check
  CHECK (boss_type IN ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline'));

-- Expand boss_type constraint in difficulty_state
ALTER TABLE difficulty_state DROP CONSTRAINT IF EXISTS difficulty_state_boss_type_check;
ALTER TABLE difficulty_state ADD CONSTRAINT difficulty_state_boss_type_check
  CHECK (boss_type IN ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline'));

-- Expand boss_type constraint in mastery (if exists)
ALTER TABLE mastery DROP CONSTRAINT IF EXISTS mastery_boss_type_check;
ALTER TABLE mastery ADD CONSTRAINT mastery_boss_type_check
  CHECK (boss_type IN ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline'));

-- Expand boss_type constraint in sessions (if exists)
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_boss_type_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_boss_type_check
  CHECK (boss_type IN ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline'));
