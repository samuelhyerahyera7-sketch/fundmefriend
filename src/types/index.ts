import type { LucideIcon } from 'lucide-react'
import { HeartPulse, GraduationCap, TriangleAlert, Users, PawPrint, Flower2, Trophy, Briefcase, Sparkles } from 'lucide-react'

export type Campaign = {
  id: string
  user_id: string
  title: string
  description: string
  story: string
  goal_amount: number
  raised_amount: number
  category: string
  image_url: string | null
  image_urls: string[]
  location: string | null
  deadline: string | null
  status: 'pending_review' | 'active' | 'completed' | 'cancelled'
  created_at: string
  profiles?: Profile
}

export type Donation = {
  id: string
  campaign_id: string
  donor_id: string | null
  amount: number
  tip_amount: number
  currency: string
  original_amount: number | null
  payment_method: 'ozow' | 'paypal' | 'offline'
  message: string | null
  is_anonymous: boolean
  is_offline: boolean
  payment_status: 'pending' | 'complete' | 'cancelled' | 'error'
  payment_reference: string
  created_at: string
  profiles?: Profile
  campaigns?: Campaign
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  is_admin?: boolean
}

export type CampaignUpdate = {
  id: string
  campaign_id: string
  title: string
  content: string
  created_at: string
}

export const CATEGORIES = [
  'Medical',
  'Education',
  'Emergency',
  'Community',
  'Animal Welfare',
  'Memorial',
  'Sports',
  'Business',
  'Other',
]

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  'Medical': HeartPulse,
  'Education': GraduationCap,
  'Emergency': TriangleAlert,
  'Community': Users,
  'Animal Welfare': PawPrint,
  'Memorial': Flower2,
  'Sports': Trophy,
  'Business': Briefcase,
  'Other': Sparkles,
}

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Medical':        { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-100' },
  'Education':      { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
  'Emergency':      { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'Community':      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  'Animal Welfare': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Memorial':       { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-100' },
  'Sports':         { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-100' },
  'Business':       { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  'Other':          { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-100' },
}
