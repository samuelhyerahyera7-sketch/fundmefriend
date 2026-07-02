import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { buildOzowPayload } from '@/lib/ozow'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { campaignId, amount, message, isAnonymous, donorId, donorEmail } = await req.json()

  const num = parseFloat(amount)
  if (!num || num < 5) return NextResponse.json({ error: 'Minimum R5' }, { status: 400 })

  const reference = `FMF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const { error: dbErr } = await supabase.from('donations').insert({
    campaign_id: campaignId,
    donor_id: donorId ?? null,
    amount: num,
    message: message || null,
    is_anonymous: isAnonymous,
    payment_status: 'pending',
    payment_reference: reference,
  })

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  const payload = buildOzowPayload({
    amount: num,
    reference,
    campaignId,
    donorEmail: donorEmail ?? 'guest@fundmefriend.co.za',
  })

  return NextResponse.json({ payload })
}
