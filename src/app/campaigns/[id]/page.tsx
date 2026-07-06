import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import DonateForm from './DonateForm'
import ShareButtons from '@/components/ShareButtons'
import CampaignCard from '@/components/CampaignCard'
import { formatCurrency, formatDate, getProgressPercent, getDaysLeft } from '@/lib/utils'
import { CATEGORY_EMOJI, CATEGORY_COLORS } from '@/types'
import type { Campaign } from '@/types'

interface Props { params: Promise<{ id: string }> }

function InitialAvatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  )
}

export default async function CampaignPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [
    { data: campaign },
    { data: donations },
    { data: updates },
    { data: { user } },
  ] = await Promise.all([
    supabase.from('campaigns').select('*, profiles(full_name, avatar_url)').eq('id', id).single(),
    supabase.from('donations').select('*, profiles(full_name)').eq('campaign_id', id).eq('payment_status', 'complete').order('created_at', { ascending: false }).limit(20),
    supabase.from('campaign_updates').select('*').eq('campaign_id', id).order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  if (!campaign) notFound()

  const percent = getProgressPercent(campaign.raised_amount, campaign.goal_amount)
  const daysLeft = getDaysLeft(campaign.deadline)
  const isOwner = user?.id === campaign.user_id
  const donorCount = donations?.length ?? 0
  const isUrgent = daysLeft > 0 && daysLeft <= 7
  const colors = CATEGORY_COLORS[campaign.category] ?? CATEGORY_COLORS['Other']
  const emoji = CATEGORY_EMOJI[campaign.category] ?? '✨'

  // Related campaigns
  const { data: related } = await supabase
    .from('campaigns')
    .select('*, profiles(full_name, avatar_url)')
    .eq('status', 'active')
    .eq('category', campaign.category)
    .neq('id', id)
    .limit(3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/campaigns" className="hover:text-green-600 transition-colors">Campaigns</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{campaign.title}</span>
      </nav>

      {isOwner && campaign.status === 'pending_review' && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          Your fundraiser is awaiting review and isn&apos;t visible to the public yet. This usually takes less than a day.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${colors.bg} ${colors.text} ${colors.border}`}>
              {emoji} {campaign.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{campaign.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-500 text-sm">
                by <span className="font-medium text-gray-700">{campaign.profiles?.full_name ?? 'Anonymous'}</span>
              </p>
              <span className="text-gray-300">·</span>
              <p className="text-gray-400 text-sm">{formatDate(campaign.created_at)}</p>
              {donorCount > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {donorCount} donor{donorCount !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            {campaign.image_url ? (
              <Image src={campaign.image_url} alt={campaign.title} fill className="object-cover" />
            ) : (
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${colors.bg}`}>
                <span className="text-7xl">{emoji}</span>
                <p className={`text-sm font-medium ${colors.text}`}>{campaign.category}</p>
              </div>
            )}
          </div>

          {/* Progress — shown on mobile above story */}
          <div className="lg:hidden bg-white rounded-2xl border border-gray-200 p-5">
            <MobileProgressCard
              raised={campaign.raised_amount}
              goal={campaign.goal_amount}
              percent={percent}
              daysLeft={daysLeft}
              isUrgent={isUrgent}
              donorCount={donorCount}
              status={campaign.status}
              campaignId={id}
              isOwner={isOwner}
            />
          </div>

          {/* Story */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">The story</h2>
            <div className="text-gray-600 text-sm leading-7 whitespace-pre-wrap">{campaign.story || campaign.description}</div>
          </div>

          {/* Campaign updates */}
          {updates && updates.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">
                Campaign updates <span className="text-green-600 text-base font-semibold">({updates.length})</span>
              </h2>
              <div className="space-y-5">
                {updates.map(u => (
                  <div key={u.id} className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 shrink-0" />
                      <div className="flex-1 w-px bg-green-100" />
                    </div>
                    <div className="pb-5 flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{u.title}</p>
                      <p className="text-gray-400 text-xs mb-2">{formatDate(u.created_at)}</p>
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{u.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donors */}
          {donations && donations.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">
                {donorCount} donation{donorCount !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {donations.map(d => (
                  <div key={d.id} className="flex items-center gap-3">
                    <InitialAvatar name={d.is_anonymous ? 'AN' : (d.profiles?.full_name ?? 'Friend')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {d.is_anonymous ? 'Anonymous' : (d.profiles?.full_name ?? 'Friend')}
                      </p>
                      {d.message && (
                        <p className="text-xs text-gray-500 truncate">&ldquo;{d.message}&rdquo;</p>
                      )}
                      <p className="text-xs text-gray-400">{formatDate(d.created_at)}</p>
                    </div>
                    <span className="font-bold text-green-600 text-sm shrink-0">{formatCurrency(d.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — desktop */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-20">
            {/* Raised */}
            <div className="mb-4">
              <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(campaign.raised_amount)}</p>
              <p className="text-sm text-gray-500 mt-0.5">raised of {formatCurrency(campaign.goal_amount)} goal</p>
            </div>

            {/* Progress */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full progress-bar-animated" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span className="font-semibold text-gray-700">{percent}% funded</span>
              {donorCount > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {donorCount} donor{donorCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-1 text-sm mb-5 ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              <Calendar className="w-4 h-4" />
              {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left` : 'Campaign ended'}
              {isUrgent && ' — ending soon!'}
            </div>

            {/* Donate */}
            {campaign.status === 'active' && daysLeft > 0 && (
              <div className="mb-5">
                <DonateForm campaignId={campaign.id} />
              </div>
            )}

            {campaign.status === 'pending_review' && (
              <div className="mb-5 p-3 bg-amber-50 rounded-xl text-sm text-amber-700 text-center">
                This fundraiser is awaiting review.
              </div>
            )}
            {(campaign.status === 'completed' || campaign.status === 'cancelled' || (campaign.status === 'active' && daysLeft <= 0)) && (
              <div className="mb-5 p-3 bg-gray-50 rounded-xl text-sm text-gray-500 text-center">
                This campaign has ended.
              </div>
            )}

            {/* Share */}
            <div className="border-t border-gray-100 pt-5">
              <ShareButtons title={campaign.title} campaignId={id} />
            </div>

            {isOwner && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="block text-center text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                >
                  Manage this campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related campaigns */}
      {related && related.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">More {campaign.category} campaigns</h2>
            <Link href={`/campaigns?category=${campaign.category}`} className="text-green-600 text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(c => <CampaignCard key={c.id} campaign={c as Campaign} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function MobileProgressCard({
  raised, goal, percent, daysLeft, isUrgent, donorCount, status, campaignId, isOwner
}: {
  raised: number; goal: number; percent: number; daysLeft: number; isUrgent: boolean;
  donorCount: number; status: string; campaignId: string; isOwner: boolean;
}) {
  return (
    <>
      <div className="flex justify-between items-baseline mb-2">
        <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(raised)}</p>
        <p className="text-sm text-gray-500">of {formatCurrency(goal)}</p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>{percent}% funded · {donorCount} donors</span>
        <span className={isUrgent ? 'text-red-500 font-semibold' : ''}>
          {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
        </span>
      </div>
      {status === 'active' && daysLeft > 0 && (
        <DonateForm campaignId={campaignId} />
      )}
      {isOwner && (
        <Link href={`/dashboard/campaigns/${campaignId}`} className="block mt-3 text-center text-sm text-green-600 hover:underline font-medium">
          Manage campaign
        </Link>
      )}
    </>
  )
}
