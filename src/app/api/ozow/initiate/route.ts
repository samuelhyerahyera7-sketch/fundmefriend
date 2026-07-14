import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildOzowPayload } from '@/lib/ozow'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(`ozow-initiate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests, please try again shortly' }, { status: 429 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { campaignId, amount, tipAmount, message, isAnonymous, donorId, donorEmail } = await req.json()

  const num = parseFloat(amount)
  if (!num || num < 5) return NextResponse.json({ error: 'Minimum R5' }, { status: 400 })

  const tip = Math.max(0, parseFloat(tipAmount) || 0)

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

  const reference = `FMF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const { error: dbErr } = await supabase.from('donations').insert({
    campaign_id: campaignId,
    donor_id: donorId ?? null,
    amount: num,
    tip_amount: tip,
    message: message || null,
    is_anonymous: isAnonymous,
    payment_status: 'pending',
    payment_reference: reference,
  })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  const payload = buildOzowPayload({
    amount: num + tip,
    reference,
    campaignId,
    donorEmail: donorEmail ?? 'guest@fundmefriend.co.za',
  })

  return NextResponse.json({ payload })
}
