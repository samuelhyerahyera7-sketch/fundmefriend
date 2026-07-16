import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { capturePayPalOrder } from '@/lib/paypal'

export async function POST(req: NextRequest) {
  const { orderID } = await req.json()
  if (!orderID) return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: donation } = await supabase
    .from('donations')
    .select('id, payment_status')
    .eq('payment_reference', orderID)
    .single()

  if (!donation) return NextResponse.json({ error: 'Donation not found' }, { status: 404 })

  // Already processed (e.g. a retried capture call) — nothing to do.
  if (donation.payment_status === 'complete') {
    return NextResponse.json({ ok: true })
  }

  let capture
  try {
    capture = await capturePayPalOrder(orderID)
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: `Could not capture PayPal payment. ${detail}` }, { status: 502 })
  }

  if (capture.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Payment was not completed' }, { status: 400 })
  }

  const { error: updateErr } = await supabase
    .from('donations')
    .update({ payment_status: 'complete' })
    .eq('id', donation.id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
