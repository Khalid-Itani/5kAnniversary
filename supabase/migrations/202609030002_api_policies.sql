grant usage on schema public to anon, authenticated;

grant insert (
  first_name,
  last_name,
  email,
  age_on_race_day,
  city,
  participation_type,
  referral_source,
  donor_name,
  amount_claimed,
  email_updates
) on public.registrations to anon;

grant insert (
  business_name,
  contact_name,
  email,
  phone,
  city,
  interest_type,
  message
) on public.business_inquiries to anon;

grant select, update on public.registrations to authenticated;
grant select, update on public.business_inquiries to authenticated;

create policy registrations_public_submit
on public.registrations
for insert
to anon
with check (
  age_on_race_day >= 18
  and amount_claimed >= 20
  and donation_status = 'pending'
  and donation_verified_at is null
  and email_status = 'pending'
  and admin_notes is null
);

create policy registrations_admin_read
on public.registrations
for select
to authenticated
using ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com');

create policy registrations_admin_update
on public.registrations
for update
to authenticated
using ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com')
with check ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com');

create policy business_inquiries_public_submit
on public.business_inquiries
for insert
to anon
with check (status = 'new' and admin_notes is null);

create policy business_inquiries_admin_read
on public.business_inquiries
for select
to authenticated
using ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com');

create policy business_inquiries_admin_update
on public.business_inquiries
for update
to authenticated
using ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com')
with check ((select auth.jwt() ->> 'email') = '5kyearrun@gmail.com');
