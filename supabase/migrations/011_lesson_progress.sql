create table if not exists lesson_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users not null,
  lesson_id   text not null,
  category_id text not null,
  understood  boolean not null,
  completed_at timestamptz default now()
);

create index lesson_progress_user_id_idx on lesson_progress(user_id);
create index lesson_progress_category_idx on lesson_progress(user_id, category_id);

alter table lesson_progress enable row level security;

create policy "Users can read own lesson progress"
  on lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own lesson progress"
  on lesson_progress for insert
  with check (auth.uid() = user_id);
