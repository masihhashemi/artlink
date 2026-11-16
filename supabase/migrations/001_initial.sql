-- Art Link initial schema

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  headline text not null default '',
  description text not null default '',
  avatar_url text,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.profile_skills (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (profile_id, skill_id)
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  university text not null,
  degree_or_program text not null default '',
  field_of_study text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  organization text not null default '',
  location text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.portfolio_images (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create type public.post_type as enum ('looking_for', 'offering', 'update');

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type public.post_type not null default 'update',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_skills (
  post_id uuid not null references public.posts(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (post_id, skill_id)
);

create type public.connection_status as enum ('pending', 'accepted', 'rejected');

create table public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status public.connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);

create table public.message_threads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thread_participants (
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (thread_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index profiles_full_name_idx on public.profiles (full_name);
create index education_profile_idx on public.education (profile_id);
create index experiences_profile_idx on public.experiences (profile_id);
create index portfolio_profile_idx on public.portfolio_images (profile_id);
create index posts_created_idx on public.posts (created_at desc);
create index posts_author_idx on public.posts (author_id);
create index post_skills_skill_idx on public.post_skills (skill_id);
create index connections_recipient_idx on public.connections (recipient_id, status);
create index connections_requester_idx on public.connections (requester_id, status);
create index messages_thread_idx on public.messages (thread_id, created_at);
create index notifications_user_idx on public.notifications (user_id, read, created_at desc);
create index likes_profile_idx on public.likes (profile_id);
create index comments_post_idx on public.comments (post_id, created_at);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute procedure public.set_updated_at();
create trigger connections_updated_at before update on public.connections
  for each row execute procedure public.set_updated_at();
create trigger threads_updated_at before update on public.message_threads
  for each row execute procedure public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.profile_skills enable row level security;
alter table public.education enable row level security;
alter table public.experiences enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.posts enable row level security;
alter table public.post_skills enable row level security;
alter table public.connections enable row level security;
alter table public.message_threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;

-- Profiles
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);
create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Skills (read-all, no client writes needed)
create policy "Skills are readable"
  on public.skills for select to authenticated using (true);

-- Profile skills
create policy "Profile skills readable"
  on public.profile_skills for select to authenticated using (true);
create policy "Own profile skills insert"
  on public.profile_skills for insert to authenticated with check (auth.uid() = profile_id);
create policy "Own profile skills delete"
  on public.profile_skills for delete to authenticated using (auth.uid() = profile_id);

-- Education
create policy "Education readable"
  on public.education for select to authenticated using (true);
create policy "Own education insert"
  on public.education for insert to authenticated with check (auth.uid() = profile_id);
create policy "Own education update"
  on public.education for update to authenticated using (auth.uid() = profile_id);
create policy "Own education delete"
  on public.education for delete to authenticated using (auth.uid() = profile_id);

-- Experiences
create policy "Experiences readable"
  on public.experiences for select to authenticated using (true);
create policy "Own experiences insert"
  on public.experiences for insert to authenticated with check (auth.uid() = profile_id);
create policy "Own experiences update"
  on public.experiences for update to authenticated using (auth.uid() = profile_id);
create policy "Own experiences delete"
  on public.experiences for delete to authenticated using (auth.uid() = profile_id);

-- Portfolio
create policy "Portfolio readable"
  on public.portfolio_images for select to authenticated using (true);
create policy "Own portfolio insert"
  on public.portfolio_images for insert to authenticated with check (auth.uid() = profile_id);
create policy "Own portfolio update"
  on public.portfolio_images for update to authenticated using (auth.uid() = profile_id);
create policy "Own portfolio delete"
  on public.portfolio_images for delete to authenticated using (auth.uid() = profile_id);

-- Posts
create policy "Posts readable"
  on public.posts for select to authenticated using (true);
create policy "Own posts insert"
  on public.posts for insert to authenticated with check (auth.uid() = author_id);
create policy "Own posts update"
  on public.posts for update to authenticated using (auth.uid() = author_id);
create policy "Own posts delete"
  on public.posts for delete to authenticated using (auth.uid() = author_id);

create policy "Post skills readable"
  on public.post_skills for select to authenticated using (true);
create policy "Post skills insert by author"
  on public.post_skills for insert to authenticated
  with check (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));
create policy "Post skills delete by author"
  on public.post_skills for delete to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));

-- Connections
create policy "Connections visible to participants"
  on public.connections for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "Users can request connections"
  on public.connections for insert to authenticated
  with check (auth.uid() = requester_id);
create policy "Participants can update connections"
  on public.connections for update to authenticated
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- Threads / messages
create policy "Participants can view threads"
  on public.message_threads for select to authenticated
  using (exists (
    select 1 from public.thread_participants tp
    where tp.thread_id = id and tp.profile_id = auth.uid()
  ));
create policy "Authenticated can create threads"
  on public.message_threads for insert to authenticated with check (true);
create policy "Authenticated can update threads"
  on public.message_threads for update to authenticated
  using (exists (
    select 1 from public.thread_participants tp
    where tp.thread_id = id and tp.profile_id = auth.uid()
  ));

create policy "Participants readable"
  on public.thread_participants for select to authenticated
  using (exists (
    select 1 from public.thread_participants tp
    where tp.thread_id = thread_id and tp.profile_id = auth.uid()
  ) or profile_id = auth.uid());
create policy "Participants insert"
  on public.thread_participants for insert to authenticated with check (true);

create policy "Messages readable by participants"
  on public.messages for select to authenticated
  using (exists (
    select 1 from public.thread_participants tp
    where tp.thread_id = messages.thread_id and tp.profile_id = auth.uid()
  ));
create policy "Participants can send messages"
  on public.messages for insert to authenticated
  with check (
    auth.uid() = sender_id and exists (
      select 1 from public.thread_participants tp
      where tp.thread_id = thread_id and tp.profile_id = auth.uid()
    )
  );

-- Notifications
create policy "Own notifications select"
  on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "Own notifications update"
  on public.notifications for update to authenticated using (auth.uid() = user_id);
create policy "Authenticated can create notifications"
  on public.notifications for insert to authenticated with check (true);

-- Likes / comments
create policy "Likes readable"
  on public.likes for select to authenticated using (true);
create policy "Own likes insert"
  on public.likes for insert to authenticated with check (auth.uid() = profile_id);
create policy "Own likes delete"
  on public.likes for delete to authenticated using (auth.uid() = profile_id);

create policy "Comments readable"
  on public.comments for select to authenticated using (true);
create policy "Own comments insert"
  on public.comments for insert to authenticated with check (auth.uid() = author_id);
create policy "Own comments delete"
  on public.comments for delete to authenticated using (auth.uid() = author_id);

-- Storage buckets (run in dashboard or via API): avatars, portfolio
-- Policies for storage objects
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can update own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can delete own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Portfolio images are publicly accessible"
  on storage.objects for select using (bucket_id = 'portfolio');
create policy "Users can upload own portfolio"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can update own portfolio"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can delete own portfolio"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
