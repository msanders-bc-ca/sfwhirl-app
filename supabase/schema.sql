-- =============================================================
-- MedDevice Game — Supabase Schema
-- Run this in the Supabase SQL editor for your project
-- =============================================================

-- ---------------------------------------------------------------
-- User Profiles
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null,
  avatar_url    text,
  total_xp      integer not null default 0,
  level         integer not null default 1,
  streak_days   integer not null default 0,
  last_played_at timestamptz,
  badges        text[] not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read all profiles"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------
-- Topics
-- ---------------------------------------------------------------
create table if not exists public.topics (
  id          uuid primary key default gen_random_uuid(),
  title       text not null unique,
  category    text not null,
  description text not null,
  difficulty  text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz not null default now()
);

alter table public.topics enable row level security;
create policy "Anyone can read topics" on public.topics for select using (true);

-- ---------------------------------------------------------------
-- Questions (AI-generated, cached per topic)
-- ---------------------------------------------------------------
create table if not exists public.questions (
  id            uuid primary key default gen_random_uuid(),
  topic_id      uuid not null references public.topics(id) on delete cascade,
  question_text text not null,
  options       jsonb not null,   -- string[]
  correct_index smallint not null,
  explanation   text not null,
  difficulty    text not null,
  source_url    text,
  created_at    timestamptz not null default now()
);

alter table public.questions enable row level security;
create policy "Anyone can read questions" on public.questions for select using (true);

-- ---------------------------------------------------------------
-- Game Sessions
-- ---------------------------------------------------------------
create table if not exists public.game_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  topic_id         uuid not null references public.topics(id),
  started_at       timestamptz not null default now(),
  completed_at     timestamptz,
  score            integer,           -- 0-100
  total_questions  integer not null,
  correct_answers  integer,
  xp_earned        integer not null default 0
);

alter table public.game_sessions enable row level security;

create policy "Users can insert their own sessions"
  on public.game_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.game_sessions for update using (auth.uid() = user_id);

create policy "Users can read their own sessions"
  on public.game_sessions for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Leaderboard View
-- ---------------------------------------------------------------
create or replace view public.leaderboard as
  select
    p.id          as user_id,
    p.display_name,
    p.avatar_url,
    p.total_xp,
    p.level
  from public.profiles p
  order by p.total_xp desc
  limit 100;

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
create index if not exists idx_questions_topic on public.questions(topic_id);
create index if not exists idx_sessions_user on public.game_sessions(user_id);
create index if not exists idx_profiles_xp on public.profiles(total_xp desc);
