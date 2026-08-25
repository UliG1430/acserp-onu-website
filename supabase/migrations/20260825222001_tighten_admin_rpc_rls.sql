grant usage on schema private to authenticated;

grant select, update on private.site_content_drafts to authenticated;
grant execute on function private.visible_items(jsonb, boolean) to authenticated;
grant execute on function private.publishable_site_content(jsonb) to authenticated;

drop policy if exists "Admins can read site content draft" on private.site_content_drafts;
create policy "Admins can read site content draft"
on private.site_content_drafts
for select
to authenticated
using (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Admins can update site content draft" on private.site_content_drafts;
create policy "Admins can update site content draft"
on private.site_content_drafts
for update
to authenticated
using (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

grant insert, update on public.site_content to authenticated;

drop policy if exists "Authenticated admins can insert site content" on public.site_content;
create policy "Authenticated admins can insert site content"
on public.site_content
for insert
to authenticated
with check (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

drop policy if exists "Authenticated admins can update site content" on public.site_content;
create policy "Authenticated admins can update site content"
on public.site_content
for update
to authenticated
using (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
)
with check (
  id = 'main'
  and coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
);

alter function public.get_site_content_draft() security invoker;
alter function public.save_site_content(jsonb, timestamptz) security invoker;
