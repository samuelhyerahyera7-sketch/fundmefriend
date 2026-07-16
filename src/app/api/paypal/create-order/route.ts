import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createPayPalOrder } from '@/lib/paypal'
import { getUsdToZarRate } from '@/lib/fx'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`paypal-create:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests, please try again shortly' }, { status: 429 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { campaignId, amount, message, isAnonymous, donorId } = await req.json()

  const amountUsd = parseFloat(amount)
  if (!amountUsd || amountUsd < 1) return NextResponse.json({ error: 'Minimum donation is $1' }, { status: 400 })
  if (!campaignId) return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })

  const { data: campaign, error: campaignErr } = await supabase
    .from('campaigns')
    .select('id, status, deadline')
    .eq('id', campaignId)
    .single()

  if (campaignErr || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }
  if (campaign.status !== 'active') {
    return NextResponse.json({ error: 'This fundraiser is no longer accepting donations' }, { status: 400 })
  }
  if (campaign.deadline && new Date(campaign.deadline) < new Date()) {
    return NextResponse.json({ error: 'This fundraiser has ended' }, { status: 400 })
  }

  const rate = await getUsdToZarRate()
  const zarEquivalent = Math.round(amountUsd * rate * 100) / 100
  const reference = `FMF-PP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const { data: donation, error: insertErr } = await supabase
    .from('donations')
    .insert({
      campaign_id: campaignId,
      donor_id: donorId ?? null,
      amount: zarEquivalent,
      original_amount: amountUsd,
      currency: 'USD',
      payment_method: 'paypal',
      message: message || null,
      is_anonymous: isAnonymous,
      payment_status: 'pending',
      payment_reference: reference,
    })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  let order
  try {
    order = await createPayPalOrder(amountUsd, reference)
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Could not start PayPal checkout. ${detail}` }, { status: 502 })
  }

  const { error: updateErr } = await supabase
    .from('donations')
    .update({ payment_reference: order.id })
    .eq('id', donation.id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ orderID: order.id })
}
