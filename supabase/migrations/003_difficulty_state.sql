-- Run this in Supabase Dashboard > SQL Editor

create table if not exists difficulty_state (
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  current_difficulty integer not null default 2
    check (current_difficulty between 1 and 5),
  consecutive_failures integer not null default 0,
  primary key (user_id, boss_type)
);

alter table difficulty_state enable row level security;

create policy "Users can access own difficulty state"
  on difficulty_state for all
  using (auth.uid() = user_id);
