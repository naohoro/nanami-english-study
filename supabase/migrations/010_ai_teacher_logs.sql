CREATE TABLE ai_teacher_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  page_type  text NOT NULL CHECK (page_type IN ('problem', 'map', 'general')),
  boss_type  text,
  summary    text NOT NULL
);

CREATE INDEX ON ai_teacher_logs (user_id, created_at DESC);
