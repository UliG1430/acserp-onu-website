create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

grant select on public.site_content to anon;
grant select, insert, update, delete on public.site_content to authenticated;

drop policy if exists "Public can read published site content" on public.site_content;
drop policy if exists "Authenticated admins can insert site content" on public.site_content;
drop policy if exists "Authenticated admins can update site content" on public.site_content;
drop policy if exists "Authenticated admins can delete site content" on public.site_content;

create policy "Public can read published site content"
on public.site_content
for select
to anon, authenticated
using (id = 'main');

create policy "Authenticated admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

create policy "Authenticated admins can update site content"
on public.site_content
for update
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

create policy "Authenticated admins can delete site content"
on public.site_content
for delete
to authenticated
using (
  coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

insert into public.site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  15728640,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read site assets" on storage.objects;
drop policy if exists "Admins can upload site assets" on storage.objects;
drop policy if exists "Admins can update site assets" on storage.objects;
drop policy if exists "Admins can delete site assets" on storage.objects;

create policy "Public can read site assets"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-assets');

create policy "Admins can upload site assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

create policy "Admins can update site assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

create policy "Admins can delete site assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);
