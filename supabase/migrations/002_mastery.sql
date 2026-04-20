-- Run this in Supabase Dashboard > SQL Editor

create table if not exists mastery (
  user_id uuid references auth.users(id) on delete cascade not null,
  boss_type text not null check (boss_type in ('outline', 'email')),
  status text not null default 'untouched'
    check (status in ('untouched', 'in_progress', 'cleared')),
  cleared_at timestamptz,
  attempt_count integer not null default 0,
  primary key (user_id, boss_type)
);

alter table mastery enable row level security;

create policy "Users can access own mastery"
  on mastery for all
  using (auth.uid() = user_id);
