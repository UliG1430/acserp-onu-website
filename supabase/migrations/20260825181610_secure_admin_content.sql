create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
grant select on public.site_content to anon, authenticated;
revoke insert, update, delete on public.site_content from anon, authenticated;

drop policy if exists "Public can read published site content" on public.site_content;
create policy "Public can read published site content"
on public.site_content
for select
to anon, authenticated
using (id = 'main');

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

drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Admins can update site assets" on storage.objects;
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

drop policy if exists "Admins can delete site assets" on storage.objects;
create policy "Admins can delete site assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

create schema if not exists private;

create table if not exists private.site_content_drafts (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid
);

alter table private.site_content_drafts enable row level security;

revoke all on private.site_content_drafts from public, anon, authenticated;

insert into private.site_content_drafts (id, content, updated_at)
select id, content, updated_at
from public.site_content
where id = 'main'
on conflict (id) do nothing;

create or replace function private.visible_items(items jsonb, keep_hidden_tombstones boolean default false)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    jsonb_agg(
      case
        when keep_hidden_tombstones and item ->> 'hidden' = 'true'
          then jsonb_build_object('id', item -> 'id', 'hidden', true)
        else item
      end
      order by item_order
    ),
    '[]'::jsonb
  )
  from jsonb_array_elements(
    case when jsonb_typeof(items) = 'array' then items else '[]'::jsonb end
  ) with ordinality as entries(item, item_order)
  where keep_hidden_tombstones or item ->> 'hidden' is distinct from 'true';
$$;

revoke execute on function private.visible_items(jsonb, boolean) from public, anon, authenticated;

create or replace function private.publishable_site_content(source_content jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  published jsonb := coalesce(source_content, '{}'::jsonb);
begin
  published := jsonb_set(published, '{organs}', private.visible_items(source_content -> 'organs'), true);
  published := jsonb_set(published, '{adminNews}', private.visible_items(source_content -> 'adminNews', true), true);
  published := jsonb_set(published, '{links,additionalResources}', private.visible_items(source_content #> '{links,additionalResources}'), true);
  published := jsonb_set(published, '{photos,carouselSections}', private.visible_items(source_content #> '{photos,carouselSections}'), true);
  published := jsonb_set(published, '{photos,driveFolders}', private.visible_items(source_content #> '{photos,driveFolders}'), true);
  published := jsonb_set(published, '{donations,allocationItems}', private.visible_items(source_content #> '{donations,allocationItems}'), true);
  published := jsonb_set(published, '{donations,faqs}', private.visible_items(source_content #> '{donations,faqs}'), true);
  return published;
end;
$$;

revoke execute on function private.publishable_site_content(jsonb) from public, anon, authenticated;

create or replace function public.get_site_content_draft()
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  draft jsonb;
begin
  if (select auth.uid()) is null
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception 'No tenés permisos de administrador.' using errcode = '42501';
  end if;

  select jsonb_build_object('content', content, 'updated_at', updated_at)
  into draft
  from private.site_content_drafts
  where id = 'main';

  if draft is null then
    raise exception 'No existe el borrador principal.' using errcode = 'P0002';
  end if;

  return draft;
end;
$$;

revoke all on function public.get_site_content_draft() from public, anon;
grant execute on function public.get_site_content_draft() to authenticated;

create or replace function public.save_site_content(next_content jsonb, expected_updated_at timestamptz)
returns timestamptz
language plpgsql
security definer
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  current_updated_at timestamptz;
  next_updated_at timestamptz := clock_timestamp();
begin
  if (select auth.uid()) is null
    or coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception 'No tenés permisos de administrador.' using errcode = '42501';
  end if;

  select updated_at
  into current_updated_at
  from private.site_content_drafts
  where id = 'main'
  for update;

  if not found then
    raise exception 'No existe el borrador principal.' using errcode = 'P0002';
  end if;

  if expected_updated_at is null or current_updated_at <> expected_updated_at then
    raise exception 'El contenido fue modificado por otra sesión. Recargá antes de volver a guardar.' using errcode = '40001';
  end if;

  update private.site_content_drafts
  set content = next_content,
      updated_at = next_updated_at,
      updated_by = (select auth.uid())
  where id = 'main';

  insert into public.site_content (id, content, updated_at)
  values ('main', private.publishable_site_content(next_content), next_updated_at)
  on conflict (id) do update
  set content = excluded.content,
      updated_at = excluded.updated_at;

  return next_updated_at;
end;
$$;

revoke all on function public.save_site_content(jsonb, timestamptz) from public, anon;
grant execute on function public.save_site_content(jsonb, timestamptz) to authenticated;

revoke insert, update, delete on public.site_content from authenticated;
drop policy if exists "Authenticated admins can insert site content" on public.site_content;
drop policy if exists "Authenticated admins can update site content" on public.site_content;
drop policy if exists "Authenticated admins can delete site content" on public.site_content;

update public.site_content
set content = private.publishable_site_content(
  coalesce((select content from private.site_content_drafts where id = 'main'), content)
)
where id = 'main';

drop policy if exists "Public can read site assets" on storage.objects;
drop policy if exists "Admins can read site assets" on storage.objects;
create policy "Admins can read site assets"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'site-assets'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);
