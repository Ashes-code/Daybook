create table entries (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  entry_date text not null,
  title text,
  body text not null,
  mood text,
  favorited boolean not null default false,
  created_at text not null,
  updated_at text not null
);

alter table entries enable row level security;

create policy "Users can CRUD their own entries"
  on entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_entries_user_date on entries (user_id, entry_date);
