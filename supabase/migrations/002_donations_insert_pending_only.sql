-- Prevent forging completed donations by inserting directly with the anon/authenticated client.
-- Only the server (service role, which bypasses RLS) may mark a donation complete via the Ozow webhook.
drop policy if exists "Authenticated users can insert donations" on public.donations;

create policy "Users can insert own pending donations" on public.donations
  for insert
  with check (payment_status = 'pending');
