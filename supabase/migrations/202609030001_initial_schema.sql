create extension if not exists pgcrypto;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (char_length(email) <= 254),
  age_on_race_day integer not null check (age_on_race_day between 18 and 120),
  city text not null check (char_length(city) between 1 and 120),
  participation_type text not null check (participation_type in ('run', 'walk')),
  referral_source text check (referral_source is null or char_length(referral_source) <= 200),
  donor_name text not null check (char_length(donor_name) between 1 and 160),
  amount_claimed numeric(10, 2) not null check (amount_claimed >= 20),
  donation_status text not null default 'pending' check (donation_status in ('pending', 'verified', 'not_found', 'refunded')),
  donation_verified_at timestamptz,
  email_updates boolean not null default false,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index registrations_email_unique on public.registrations (lower(email));
create index registrations_created_at_idx on public.registrations (created_at desc);
create index registrations_donation_status_idx on public.registrations (donation_status);

create table public.business_inquiries (
  id uuid primary key default gen_random_uuid(),
  business_name text not null check (char_length(business_name) between 1 and 160),
  contact_name text not null check (char_length(contact_name) between 1 and 160),
  email text not null check (char_length(email) <= 254),
  phone text check (phone is null or char_length(phone) <= 40),
  city text check (city is null or char_length(city) <= 120),
  interest_type text not null check (
    interest_type in ('cash_sponsor', 'food_drink', 'products_merch', 'prize_gift_card', 'event_table', 'other')
  ),
  message text not null check (char_length(message) between 1 and 1500),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'declined')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index business_inquiries_created_at_idx on public.business_inquiries (created_at desc);
create index business_inquiries_status_idx on public.business_inquiries (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger registrations_set_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

create trigger business_inquiries_set_updated_at
before update on public.business_inquiries
for each row execute function public.set_updated_at();

alter table public.registrations enable row level security;
alter table public.business_inquiries enable row level security;

revoke all on table public.registrations from anon, authenticated;
revoke all on table public.business_inquiries from anon, authenticated;
revoke all on function public.set_updated_at() from public;

comment on table public.registrations is 'Adult Coach Arena 5K participant registrations. Server-only access.';
comment on table public.business_inquiries is 'Local business sponsor and vendor interest. Server-only access.';
