-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Campaigns
create table public.campaigns (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  story text not null default '',
  goal_amount numeric(12,2) not null check (goal_amount > 0),
  raised_amount numeric(12,2) not null default 0,
  category text not null,
  image_url text,
  deadline date not null,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  created_at timestamptz default now()
);
alter table public.campaigns enable row level security;
create policy "Campaigns are viewable by everyone" on public.campaigns for select using (true);
create policy "Users can insert own campaigns" on public.campaigns for insert with check (auth.uid() = user_id);
create policy "Users can update own campaigns" on public.campaigns for update using (auth.uid() = user_id);

-- Donations
create table public.donations (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  donor_id uuid references public.profiles(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  message text,
  is_anonymous boolean not null default false,
  payment_status text not null default 'pending' check (payment_status in ('pending','complete','cancelled','error')),
  payment_reference text unique not null,
  created_at timestamptz default now()
);
alter table public.donations enable row level security;
create policy "Anyone can view completed donations" on public.donations for select using (payment_status = 'complete');
create policy "Authenticated users can insert donations" on public.donations for insert with check (true);

-- Function to update raised_amount when donation completes
create or replace function public.update_campaign_raised()
returns trigger as $$
begin
  if new.payment_status = 'complete' and old.payment_status != 'complete' then
    update public.campaigns
    set raised_amount = raised_amount + new.amount
    where id = new.campaign_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_donation_complete
  after update on public.donations
  for each row execute procedure public.update_campaign_raised();

-- Campaign updates / posts
create table public.campaign_updates (
  id uuid default gen_random_uuid() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);
alter table public.campaign_updates enable row level security;
create policy "Updates viewable by everyone" on public.campaign_updates for select using (true);
create policy "Campaign owners can post updates" on public.campaign_updates for insert
  with check (
    auth.uid() = (select user_id from public.campaigns where id = campaign_id)
  );
