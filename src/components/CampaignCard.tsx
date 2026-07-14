import Link from 'next/link'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'
import { formatCurrency, getProgressPercent, getDaysLeft } from '@/lib/utils'
import { CATEGORY_COLORS, CATEGORY_ICON } from '@/types'
import type { Campaign } from '@/types'

interface CampaignCardProps {
  campaign: Campaign & { donor_count?: number }
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percent = getProgressPercent(campaign.raised_amount, campaign.goal_amount)
  const daysLeft = getDaysLeft(campaign.deadline)
  const supporterCount = campaign.donor_count ?? 0
  const colors = CATEGORY_COLORS[campaign.category] ?? CATEGORY_COLORS['Other']
  const Icon = CATEGORY_ICON[campaign.category] ?? CATEGORY_ICON['Other']

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100">
        {campaign.image_url ? (
          <Image
            src={campaign.image_url}
            alt={campaign.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <ImageOff className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 border ${colors.bg} ${colors.text} ${colors.border}`}>
            <Icon className="w-3 h-3" /> {campaign.category}
          </span>
          <span className="text-xs text-gray-400">{campaign.location || 'South Africa'}</span>
        </div>

        <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-2 text-[15px]">
          {campaign.title}
        </h3>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-brand-green h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-baseline mb-1">
          <span className="font-bold text-gray-900 text-[15px]">{formatCurrency(campaign.raised_amount)}</span>
          <span className="text-sm text-gray-400">of {formatCurrency(campaign.goal_amount)}</span>
        </div>

        <p className="text-xs text-gray-400">
          {supporterCount > 0 ? `${supporterCount} supporters · ` : ''}
          {daysLeft === null ? 'Open-ended' : daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
        </p>
      </div>
    </Link>
  )
}
