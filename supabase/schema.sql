-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)

-- Shared punch counter (one row for the whole site)
create table if not exists public.global_stats (
  id int primary key default 1 check (id = 1),
  total_bonks bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.global_stats (id, total_bonks)
values (1, 0)
on conflict (id) do nothing;

-- Safe concurrent increment used by every punch
create or replace function public.increment_bonk()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_total bigint;
begin
  update public.global_stats
  set
    total_bonks = total_bonks + 1,
    updated_at = now()
  where id = 1
  returning total_bonks into new_total;

  return new_total;
end;
$$;

-- Public read access for the live counter
alter table public.global_stats enable row level security;

drop policy if exists "Anyone can read global stats" on public.global_stats;
create policy "Anyone can read global stats"
  on public.global_stats
  for select
  to anon, authenticated
  using (true);

-- Allow anonymous clients to call the increment function
grant usage on schema public to anon, authenticated;
grant select on public.global_stats to anon, authenticated;
grant execute on function public.increment_bonk() to anon, authenticated;

-- Enable realtime updates for total bonks
-- If this errors with "already member of publication", you can ignore it.
do $$
begin
  alter publication supabase_realtime add table public.global_stats;
exception
  when duplicate_object then null;
end $$;
