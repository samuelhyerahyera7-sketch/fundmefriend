import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { campaignId, amount, donorName, message, isAnonymous } = await req.json()

  const num = parseFloat(amount)
  if (!num || num < 5) return NextResponse.json({ error: 'Minimum R5' }, { status: 400 })
  if (!campaignId) return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('id, user_id')
    .eq('id', campaignId)
    .single()

  if (!campaign || campaign.user_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized to log donations for this campaign' }, { status: 403 })
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const reference = `FMF-OFFLINE-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const { data: donation, error: insertErr } = await service
    .from('donations')
    .insert({
      campaign_id: campaignId,
      donor_id: null,
      amount: num,
      message: (message || (donorName ? `Offline donation from ${donorName}` : null)) || null,
      is_anonymous: !!isAnonymous,
      payment_status: 'pending',
      payment_reference: reference,
      is_offline: true,
    })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  const { error: updateErr } = await service
    .from('donations')
    .update({ payment_status: 'complete' })
    .eq('id', donation.id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
