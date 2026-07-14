-- Track the donor's original currency/amount when it differs from ZAR
-- (e.g. a USD donation via PayPal). `amount` always stays the ZAR-equivalent
-- that counts toward raised_amount, so campaign progress stays consistent
-- regardless of payment method.
alter table public.donations add column currency text not null default 'ZAR';
alter table public.donations add column original_amount numeric(12,2);
alter table public.donations add column payment_method text not null default 'ozow'
  check (payment_method in ('ozow', 'paypal', 'offline'));
