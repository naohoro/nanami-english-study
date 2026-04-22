-- 008_fix_boss_type_constraint.sql
-- Allow all 8 boss types (previously only 'outline', 'email')
ALTER TABLE sample_problems
  DROP CONSTRAINT IF EXISTS sample_problems_boss_type_check;

ALTER TABLE sample_problems
  ADD CONSTRAINT sample_problems_boss_type_check
  CHECK (boss_type IN (
    'short_text', 'survey_blog', 'short_story', 'essay_edit',
    'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'
  ));
