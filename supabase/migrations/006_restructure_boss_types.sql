-- 006: Restructure boss types to match 2025/2026 共通テスト format
-- Old types: vocab, grammar, conversation, chart, email, story, multi_source, outline
-- New types: short_text, survey_blog, short_story, essay_edit, multi_doc, long_story, article_slides, essay_synthesis

-- 1. Delete old sample problems (types being replaced)
delete from sample_problems
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 2. Delete old difficulty_state rows for removed types
delete from difficulty_state
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 3. Delete old mastery rows for removed types
delete from mastery
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 4. Delete old sessions rows for removed types
delete from sessions
where boss_type in ('vocab', 'grammar', 'conversation', 'chart', 'email', 'story', 'multi_source', 'outline');

-- 5. Update CHECK constraint on sample_problems
alter table sample_problems
  drop constraint if exists sample_problems_boss_type_check;

alter table sample_problems
  add constraint sample_problems_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 6. Update CHECK constraint on difficulty_state
alter table difficulty_state
  drop constraint if exists difficulty_state_boss_type_check;

alter table difficulty_state
  add constraint difficulty_state_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 7. Update CHECK constraint on mastery
alter table mastery
  drop constraint if exists mastery_boss_type_check;

alter table mastery
  add constraint mastery_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));

-- 8. Update CHECK constraint on sessions
alter table sessions
  drop constraint if exists sessions_boss_type_check;

alter table sessions
  add constraint sessions_boss_type_check
  check (boss_type in ('short_text', 'survey_blog', 'short_story', 'essay_edit', 'multi_doc', 'long_story', 'article_slides', 'essay_synthesis'));
