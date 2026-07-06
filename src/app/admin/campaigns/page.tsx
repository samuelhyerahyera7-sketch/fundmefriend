import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import ModerationActions from './ModerationActions'

export default async function AdminCampaignsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/admin/campaigns')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  const { data: pending } = await supabase
    .from('campaigns')
    .select('*, profiles(full_name)')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Campaigns awaiting review</h1>
      <p className="text-gray-500 text-sm mb-8">
        {pending?.length ?? 0} fundraiser{(pending?.length ?? 0) !== 1 ? 's' : ''} pending approval.
      </p>

      {pending && pending.length > 0 ? (
        <div className="space-y-4">
          {pending.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4">
              {c.image_url ? (
                <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  <Image src={c.image_url} alt={c.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-28 h-20 rounded-lg shrink-0 bg-gray-100 flex items-center justify-center">
                  <ImageOff className="w-6 h-6 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/campaigns/${c.id}`} target="_blank" className="font-bold text-gray-900 hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      by {c.profiles?.full_name ?? 'Unknown'} · {c.category} · goal {formatCurrency(c.goal_amount)} · submitted {formatDate(c.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>
                <div className="mt-4">
                  <ModerationActions campaignId={c.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
          <p className="text-gray-500">Nothing waiting for review right now.</p>
        </div>
      )}
    </div>
  )
}
