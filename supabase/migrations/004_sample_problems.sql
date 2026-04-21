create table if not exists sample_problems (
  id uuid primary key default gen_random_uuid(),
  boss_type text not null check (boss_type in ('outline', 'email')),
  theme text not null check (theme in ('travel', 'technology', 'environment', 'community', 'daily_life', 'business')),
  difficulty integer not null check (difficulty between 1 and 5),
  passage_html text not null,
  question_text text not null,
  choices jsonb not null,
  correct_label text not null check (correct_label in ('A', 'B', 'C', 'D')),
  explanation text,
  trick_hint text,
  created_at timestamptz not null default now()
);

create index sample_problems_lookup_idx on sample_problems (boss_type, difficulty);

alter table sample_problems enable row level security;

create policy "Authenticated users can read sample problems"
  on sample_problems for select to authenticated using (true);
