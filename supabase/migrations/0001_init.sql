-- Mini Poliglota: core schema.
-- One parent (auth.users) has one or more children; progress and session
-- history are scoped per child so a parent can check in from any device.

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Minha criança',
  created_at timestamptz not null default now()
);

create table if not exists public.word_progress (
  id bigint generated always as identity primary key,
  child_id uuid not null references public.children (id) on delete cascade,
  word_id text not null,
  lang text not null,
  box smallint not null default 0,
  due_at timestamptz,
  last_seen_at timestamptz,
  correct_count int not null default 0,
  wrong_count int not null default 0,
  forgotten_count int not null default 0,
  updated_at timestamptz not null default now(),
  unique (child_id, word_id, lang)
);

create table if not exists public.sessions (
  id bigint generated always as identity primary key,
  child_id uuid not null references public.children (id) on delete cascade,
  completed_at timestamptz not null default now(),
  correct_count int not null,
  total_count int not null
);

create index if not exists word_progress_child_idx on public.word_progress (child_id);
create index if not exists sessions_child_idx on public.sessions (child_id);

alter table public.children enable row level security;
alter table public.word_progress enable row level security;
alter table public.sessions enable row level security;

-- A parent can only ever see/manage their own children...
create policy "parents manage own children" on public.children
  for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

-- ...and, transitively, only the progress/sessions belonging to those children.
create policy "parents manage own children's word progress" on public.word_progress
  for all
  using (exists (select 1 from public.children c where c.id = word_progress.child_id and c.parent_id = auth.uid()))
  with check (exists (select 1 from public.children c where c.id = word_progress.child_id and c.parent_id = auth.uid()));

create policy "parents manage own children's sessions" on public.sessions
  for all
  using (exists (select 1 from public.children c where c.id = sessions.child_id and c.parent_id = auth.uid()))
  with check (exists (select 1 from public.children c where c.id = sessions.child_id and c.parent_id = auth.uid()));
