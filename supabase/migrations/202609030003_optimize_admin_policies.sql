drop policy if exists registrations_admin_read on public.registrations;
drop policy if exists registrations_admin_update on public.registrations;
drop policy if exists business_inquiries_admin_read on public.business_inquiries;
drop policy if exists business_inquiries_admin_update on public.business_inquiries;

create policy registrations_admin_read
on public.registrations
for select
to authenticated
using (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com');

create policy registrations_admin_update
on public.registrations
for update
to authenticated
using (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com')
with check (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com');

create policy business_inquiries_admin_read
on public.business_inquiries
for select
to authenticated
using (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com');

create policy business_inquiries_admin_update
on public.business_inquiries
for update
to authenticated
using (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com')
with check (((select auth.jwt()) ->> 'email') = '5kyearrun@gmail.com');
