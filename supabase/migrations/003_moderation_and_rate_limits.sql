-- Admin flag, used to gate the moderation queue at /admin/campaigns.
-- After running this migration, make yourself an admin with:
--   update public.profiles set is_admin = true where id = '<your-user-id>';
alter table public.profiles add column is_admin boolean not null default false;

-- Campaigns now start in "pending_review" and only become public once an admin approves them.
alter table public.campaigns drop constraint campaigns_status_check;
alter table public.campaigns add constraint campaigns_status_check
  check (status in ('pending_review', 'active', 'completed', 'cancelled'));
alter table public.campaigns alter column status set default 'pending_review';

-- Tighten campaign visibility: the public can only see active/completed campaigns.
-- Owners and admins can always see their own / any campaign, including pending ones.
drop policy if exists "Campaigns are viewable by everyone" on public.campaigns;
create policy "Campaigns are viewable by owner, admin, or when public" on public.campaigns
  for select
  using (
    status in ('active', 'completed')
    or auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and is_admin)
  );

-- Admins can approve/reject pending campaigns (owners keep their existing update policy).
create policy "Admins can update any campaign" on public.campaigns
  for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin));

-- Basic anti-spam: cap how many campaigns a single user can create per rolling 24h window.
create or replace function public.enforce_campaign_rate_limit()
returns trigger as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from public.campaigns
  where user_id = new.user_id
    and created_at > now() - interval '24 hours';

  if recent_count >= 3 then
    raise exception 'You can only launch up to 3 fundraisers per day. Please try again later.';
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger campaign_rate_limit
  before insert on public.campaigns
  for each row execute procedure public.enforce_campaign_rate_limit();
