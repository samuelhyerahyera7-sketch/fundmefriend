import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, TrendingUp, Heart, Users, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, getProgressPercent } from '@/lib/utils'
import type { Campaign, Donation } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: campaigns },
    { data: myDonations },
    { data: recentReceived },
  ] = await Promise.all([
    supabase.from('campaigns').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('donations').select('*, campaigns(title, id)').eq('donor_id', user.id).eq('payment_status', 'complete').order('created_at', { ascending: false }).limit(10),
    supabase.from('donations').select('*, campaigns!inner(user_id, title, id), profiles(full_name)').eq('campaigns.user_id', user.id).eq('payment_status', 'complete').order('created_at', { ascending: false }).limit(8),
  ])

  const totalRaised = campaigns?.reduce((s, c) => s + c.raised_amount, 0) ?? 0
  const totalDonated = myDonations?.reduce((s, d) => s + d.amount, 0) ?? 0
  const activeCampaigns = campaigns?.filter(c => c.status === 'active') ?? []
  const pendingCampaigns = campaigns?.filter(c => c.status === 'pending_review') ?? []
  const completedCampaigns = campaigns?.filter(c => c.status === 'completed' || c.status === 'cancelled') ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
        </div>
        <Link href="/create">
          <Button className="gap-1.5 bg-green-600 hover:bg-green-700">
            <PlusCircle className="w-4 h-4" /> New campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total raised', value: formatCurrency(totalRaised), icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Active campaigns', value: activeCampaigns.length, icon: <PlusCircle className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Total donated', value: formatCurrency(totalDonated), icon: <Heart className="w-5 h-5 text-pink-600" />, bg: 'bg-pink-50' },
          { label: 'Donations received', value: recentReceived?.length ?? 0, icon: <Users className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
            </div>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Active campaigns */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Active campaigns</h2>
          <Link href="/create" className="text-green-600 text-sm font-medium hover:underline flex items-center gap-1">
            <PlusCircle className="w-3.5 h-3.5" /> New
          </Link>
        </div>

        {activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeCampaigns.map(c => (
              <div key={c.id} className="relative">
                <CampaignCard campaign={c as Campaign} />
                <Link
                  href={`/dashboard/campaigns/${c.id}`}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:bg-white hover:text-green-700 transition-colors shadow-sm"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="text-4xl mb-3">💚</div>
            <p className="text-gray-500 font-medium mb-3">You have no active campaigns</p>
            <Link href="/create"><Button size="sm" className="bg-green-600 hover:bg-green-700">Start your first campaign</Button></Link>
          </div>
        )}
      </div>

      {/* Pending review */}
      {pendingCampaigns.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Awaiting review</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingCampaigns.map(c => (
              <div key={c.id} className="relative">
                <CampaignCard campaign={c as Campaign} />
                <div className="absolute top-3 left-3 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  Under review
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            New fundraisers are reviewed before they appear publicly. This usually takes less than a day.
          </p>
        </div>
      )}

      {/* Recent donations received */}
      {recentReceived && recentReceived.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent donations received</h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
            {recentReceived.map((d: Donation & { campaigns?: { title: string; id: string } }) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {d.is_anonymous ? '?' : (d.profiles?.full_name?.[0] ?? 'F')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {d.is_anonymous ? 'Anonymous' : (d.profiles?.full_name ?? 'Friend')}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      → {(d as any).campaigns?.title ?? 'Your campaign'}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-bold text-green-600 text-sm">{formatCurrency(d.amount)}</p>
                  <p className="text-xs text-gray-400">{formatDate(d.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My donations */}
      {myDonations && myDonations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My donations</h2>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
            {myDonations.map(d => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="min-w-0">
                  <Link href={`/campaigns/${(d as any).campaigns?.id}`} className="text-sm font-medium text-gray-800 hover:text-green-600 transition-colors truncate block">
                    {(d as any).campaigns?.title ?? 'Campaign'}
                  </Link>
                  <p className="text-xs text-gray-400">{formatDate(d.created_at)}</p>
                </div>
                <span className="font-bold text-green-600 text-sm shrink-0 ml-4">{formatCurrency(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past campaigns */}
      {completedCampaigns.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Past campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
            {completedCampaigns.map(c => (
              <div key={c.id} className="relative">
                <CampaignCard campaign={c as Campaign} />
                <div className="absolute inset-0 bg-white/40 rounded-xl flex items-end p-3 pointer-events-none">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {c.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
