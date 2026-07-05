import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyOzowNotification } from '@/lib/ozow'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.json()

  if (!verifyOzowNotification(body)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 })
  }

  const { TransactionReference, Status } = body

  const statusMap: Record<string, string> = {
    Complete: 'complete',
    Cancelled: 'cancelled',
    Error: 'error',
    PendingInvestigation: 'pending',
  }
  const nextStatus = statusMap[Status] ?? 'pending'

  const { data: donation } = await supabase
    .from('donations')
    .select('payment_status')
    .eq('payment_reference', TransactionReference)
    .single()

  // Already in this state (e.g. a retried webhook delivery) — nothing to do.
  if (donation?.payment_status === nextStatus) {
    return NextResponse.json({ ok: true })
  }

  await supabase
    .from('donations')
    .update({ payment_status: nextStatus })
    .eq('payment_reference', TransactionReference)

  return NextResponse.json({ ok: true })
}
