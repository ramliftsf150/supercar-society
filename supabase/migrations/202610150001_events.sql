-- Run once in the Supabase SQL editor. Administrators are managed ONLY through SQL.
create table public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admin_users enable row level security;
create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
create table public.events (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 1 and 180),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 short_description text not null default '', description text not null default '',
 start_date date not null, end_date date, start_time time, end_time time,
 venue_name text not null default '', address text not null default '', city text not null default '', state text not null default '',
 event_type text not null default '', cover_image_url text, cover_storage_path text,
 registration_url text check(registration_url is null or registration_url ~ '^https?://'), featured boolean not null default false,
 status text not null default 'draft' check(status in ('draft','published','cancelled')),
 published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(end_date is null or end_date >= start_date)
);
create index events_dates_idx on public.events(start_date, end_date);
create index events_status_idx on public.events(status, start_date);
create index events_effective_end_idx on public.events((coalesce(end_date,start_date)));
create table public.event_images (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
 image_url text not null default '', storage_path text not null unique,
 alt_text text not null default '', caption text not null default '', sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create index event_images_order_idx on public.event_images(event_id, sort_order);
create function public.stamp_event() returns trigger language plpgsql set search_path = '' as $$
begin
 new.updated_at = now();
 if new.status = 'published' and new.published_at is null then new.published_at = now(); end if;
 return new;
end; $$;
create trigger stamp_event before insert or update on public.events for each row execute function public.stamp_event();
alter table public.events enable row level security;
alter table public.event_images enable row level security;
create policy "Published events are readable" on public.events for select to anon, authenticated using(status = 'published');
create policy "Administrators manage events" on public.events for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy "Published galleries are readable" on public.event_images for select to anon, authenticated using(exists(select 1 from public.events e where e.id = event_id and e.status = 'published'));
create policy "Administrators manage galleries" on public.event_images for all to authenticated using(public.is_admin()) with check(public.is_admin());
grant select on public.events, public.event_images to anon;
grant select, insert, update, delete on public.events, public.event_images to authenticated;
-- Private bucket: anonymous users may sign URLs only for published-event photographs.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('event-images','event-images',false,10485760,array['image/jpeg','image/png','image/webp']);
create policy "Published photos are readable" on storage.objects for select to anon, authenticated using(
 bucket_id = 'event-images' and exists(select 1 from public.events e where e.status='published' and (
 e.cover_storage_path = name or exists(select 1 from public.event_images i where i.event_id=e.id and i.storage_path=name))));
create policy "Administrators read photos" on storage.objects for select to authenticated using(bucket_id='event-images' and public.is_admin());
create policy "Administrators upload photos" on storage.objects for insert to authenticated with check(
 bucket_id='event-images' and public.is_admin() and (storage.foldername(name))[1]='events'
 and (storage.foldername(name))[3] in ('cover','gallery')
 and exists(select 1 from public.events where id::text=(storage.foldername(name))[2]));
create policy "Administrators delete photos" on storage.objects for delete to authenticated using(bucket_id='event-images' and public.is_admin());
