import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { campaignId, decision } = await req.json()
  if (!campaignId || !['approve', 'reject'].includes(decision)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const nextStatus = decision === 'approve' ? 'active' : 'cancelled'

  const { error } = await supabase
    .from('campaigns')
    .update({ status: nextStatus })
    .eq('id', campaignId)
    .eq('status', 'pending_review')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
