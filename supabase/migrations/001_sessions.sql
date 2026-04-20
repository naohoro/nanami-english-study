-- Run this in Supabase Dashboard > SQL Editor

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  difficulty integer not null check (difficulty between 1 and 5),
  theme text not null,
  mode text not null check (mode in ('answer_first', 'challenge')),
  generated_question jsonb not null,
  result text not null default 'pending'
    check (result in ('cleared', 'wakaranai', 'pending')),
  wakaranai_cause text
    check (wakaranai_cause in ('vocabulary', 'structure', 'background', 'question', 'unknown')),
  resolved boolean not null default false,
  ai_conversation jsonb,
  created_at timestamptz not null default now()
);

alter table sessions enable row level security;

create policy "Users can access own sessions"
  on sessions for all
  using (auth.uid() = user_id);
