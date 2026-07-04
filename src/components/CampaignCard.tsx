import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency, getProgressPercent, getDaysLeft } from '@/lib/utils'
import { CATEGORY_EMOJI } from '@/types'
import type { Campaign } from '@/types'

const BADGE: Record<string, string> = {
  'Medical':        'bg-teal-500 text-white',
  'Education':      'bg-blue-500 text-white',
  'Emergency':      'bg-orange-500 text-white',
  'Community':      'bg-yellow-600 text-white',
  'Animal Welfare': 'bg-pink-500 text-white',
  'Memorial':       'bg-purple-500 text-white',
  'Sports':         'bg-green-600 text-white',
  'Business':       'bg-indigo-500 text-white',
  'Other':          'bg-gray-500 text-white',
}

interface CampaignCardProps {
  campaign: Campaign & { donor_count?: number }
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percent = getProgressPercent(campaign.raised_amount, campaign.goal_amount)
  const daysLeft = getDaysLeft(campaign.deadline)
  const emoji = CATEGORY_EMOJI[campaign.category] ?? '✨'
  const supporterCount = campaign.donor_count ?? 0
  const badgeColor = BADGE[campaign.category] ?? 'bg-gray-500 text-white'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      {/* Image */}
      <Link href={`/campaigns/${campaign.id}`} className="block">
        <div className="relative h-52 bg-gray-100">
          {campaign.image_url ? (
            <Image src={campaign.image_url} alt={campaign.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
              <span className="text-5xl">{emoji}</span>
            </div>
          )}
          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>
              {campaign.category}
            </span>
          </div>
          {/* Heart button */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/campaigns/${campaign.id}`}>
          <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-2 text-[15px] hover:text-teal-600 transition-colors">
            {campaign.title}
          </h3>
        </Link>

        {/* Progress */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
          <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <span className="font-bold text-teal-600 text-[14px]">{formatCurrency(campaign.raised_amount)} raised</span>
          <span className="text-xs text-gray-400">{Math.round(percent)}%</span>
        </div>
        <p className="text-xs text-gray-400 mb-3">of {formatCurrency(campaign.goal_amount)} goal</p>

        <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <span>👥</span>
          {supporterCount > 0 ? `${supporterCount} supporters` : 'Be the first'}
          {daysLeft > 0 ? ` · ${daysLeft} days left` : ' · Ended'}
        </p>

        <div className="mt-auto">
          <Link href={`/campaigns/${campaign.id}`}>
            <span className="flex items-center justify-center border border-teal-500 text-teal-600 font-semibold py-2.5 rounded-xl hover:bg-teal-50 transition-colors text-sm">
              Donate now
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
