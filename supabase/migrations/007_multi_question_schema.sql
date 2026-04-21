-- 007_multi_question_schema.sql
-- Replace single-question columns with multi-question structure

alter table sample_problems
  drop column if exists question_text,
  drop column if exists choices,
  drop column if exists correct_label,
  drop column if exists explanation,
  add column if not exists scenario text not null default '',
  add column if not exists questions jsonb not null default '[]'::jsonb;

-- Remove the defaults after migration (new rows must supply values)
alter table sample_problems
  alter column scenario drop default,
  alter column questions drop default;
