-- Allow campaigns to have no fixed end date ("open-ended").
alter table public.campaigns alter column deadline drop not null;

-- Location shown on the campaign page (freeform, e.g. "Gqeberha, South Africa").
alter table public.campaigns add column location text;

-- Extra gallery photos beyond the cover image_url, shown as a carousel.
alter table public.campaigns add column image_urls text[] not null default '{}';

-- Offline donations: campaign owners can log cash/EFT donations received outside
-- the platform so they count toward the goal and total raised.
alter table public.donations add column is_offline boolean not null default false;

-- Optional donor tip on top of the donation amount. Not part of raised_amount —
-- the campaign only receives `amount`; the tip is informational/platform support.
alter table public.donations add column tip_amount numeric(12,2) not null default 0 check (tip_amount >= 0);

-- Campaign owners can insert offline donations directly (server route verifies
-- ownership before using the service role, but this keeps the policy honest in
-- case that route is ever bypassed).
create policy "Owners can log offline donations for their campaigns" on public.donations
  for insert
  with check (
    is_offline = true
    and exists (select 1 from public.campaigns where id = campaign_id and user_id = auth.uid())
  );
