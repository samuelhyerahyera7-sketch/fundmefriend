import Link from 'next/link'
import Image from 'next/image'
import { Heart, GraduationCap, AlertTriangle, Users, PawPrint, Flower2, Trophy, Briefcase, Sparkles, ShieldCheck, Lock, MapPin, BadgePercent, FileEdit, Share2, HandHeart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import type { Campaign } from '@/types'
import { CATEGORIES } from '@/types'

const CIRCLE: Record<string, string> = {
  'Medical':        'bg-teal-100 text-teal-600',
  'Education':      'bg-blue-100 text-blue-600',
  'Emergency':      'bg-orange-100 text-orange-600',
  'Community':      'bg-yellow-100 text-yellow-700',
  'Animal Welfare': 'bg-pink-100 text-pink-600',
  'Memorial':       'bg-purple-100 text-purple-600',
  'Sports':         'bg-green-100 text-green-700',
  'Business':       'bg-indigo-100 text-indigo-600',
  'Other':          'bg-gray-100 text-gray-600',
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  'Medical':        <Heart className="w-5 h-5" />,
  'Education':      <GraduationCap className="w-5 h-5" />,
  'Emergency':      <AlertTriangle className="w-5 h-5" />,
  'Community':      <Users className="w-5 h-5" />,
  'Animal Welfare': <PawPrint className="w-5 h-5" />,
  'Memorial':       <Flower2 className="w-5 h-5" />,
  'Sports':         <Trophy className="w-5 h-5" />,
  'Business':       <Briefcase className="w-5 h-5" />,
  'Other':          <Sparkles className="w-5 h-5" />,
}

export default async function HomePage() {
  let featured: Campaign[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('campaigns')
      .select('*, profiles(full_name, avatar_url)')
      .eq('status', 'active')
      .order('raised_amount', { ascending: false })
      .limit(3)
    featured = (data ?? []) as Campaign[]
  } catch {}

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-white relative">
        {/* Desktop image */}
        <div className="hidden md:block w-full">
          <Image
            src="/pc gogo kiss.png.png"
            alt="Together, we make dreams possible"
            width={1920}
            height={800}
            className="w-full h-auto"
            priority
            unoptimized
          />
        </div>
        {/* Mobile image */}
        <div className="block md:hidden w-full">
          <Image
            src="/Phone gogo kiss.png.png"
            alt="Together, we make dreams possible"
            width={1080}
            height={1080}
            className="w-full h-auto"
            priority
            unoptimized
          />
        </div>
        {/* CTA buttons — bottom-left overlaid, below the writing */}
        <div className="absolute bottom-8 left-3 sm:bottom-16 sm:left-8 md:bottom-20 md:left-12 lg:bottom-24 lg:left-20 flex flex-col gap-1.5 sm:gap-3">
          <Link href="/create">
            <span className="inline-flex items-center justify-center bg-brand-green text-white font-semibold px-4 sm:px-8 py-1.5 sm:py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-[11px] sm:text-sm shadow-md">
              Start a fundraiser
            </span>
          </Link>
          <Link href="/campaigns">
            <span className="inline-flex items-center justify-center bg-white/90 border border-gray-200 text-gray-700 font-medium px-4 sm:px-8 py-1.5 sm:py-3.5 rounded-full hover:bg-white transition-colors text-[11px] sm:text-sm shadow-sm">
              Browse fundraisers
            </span>
          </Link>
        </div>
      </section>

      {/* ── Featured campaigns ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-brand-green text-xs font-semibold uppercase tracking-widest mb-1">FEATURED CAMPAIGNS</p>
            <h2 className="text-3xl font-extrabold text-[#01224b]">Active fundraisers</h2>
          </div>
          <Link href="/campaigns" className="text-sm text-teal-600 font-medium hover:underline shrink-0 ml-4">
            View all campaigns
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        ) : (
          <div className="text-center py-16 border border-gray-100 rounded-2xl bg-gray-50">
            <p className="text-gray-400 mb-6 text-sm">No campaigns yet — be the first to start one.</p>
            <Link href="/create">
              <span className="bg-brand-green text-white px-6 py-3 rounded-full text-sm font-medium inline-block hover:bg-brand-green-dark transition-colors">
                Start a fundraiser
              </span>
            </Link>
          </div>
        )}
      </section>

      {/* ── Browse by category ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-[#01224b]">Browse by category</h2>
            <Link href="/campaigns" className="text-sm text-teal-600 font-medium hover:underline flex items-center gap-1">
              See all categories
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/campaigns?category=${encodeURIComponent(cat)}`}>
                <div className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-5 px-2 hover:shadow-md transition-all border border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${CIRCLE[cat] ?? 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORY_ICON[cat] ?? <Sparkles className="w-5 h-5" />}
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gray-50 py-16 px-4" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#01224b] text-center mb-3">How it works</h2>
          <p className="text-gray-500 text-center text-sm mb-12">Start a fundraiser in minutes. No experience needed.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 relative">
            {/* Connecting line on desktop */}
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gray-200" />
            {[
              { Icon: FileEdit,   num: '1', title: 'Create your fundraiser', desc: 'Tell your story, set your goal and add a photo. Takes about 5 minutes.' },
              { Icon: Share2,     num: '2', title: 'Share with your network', desc: 'Send your fundraiser link via WhatsApp, Facebook, email and more.' },
              { Icon: HandHeart,  num: '3', title: 'Receive donations safely', desc: 'Funds go directly to your campaign. Withdraw to your bank anytime.' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-teal-500 flex items-center justify-center mb-4 relative z-10 shadow-sm">
                  <step.Icon className="w-7 h-7 text-teal-500" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Step {step.num}</span>
                <h3 className="font-bold text-[#01224b] mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/create">
              <span className="inline-flex items-center justify-center bg-brand-green text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-sm">
                Start your fundraiser
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="bg-[#0f5c48] py-16 px-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-2">Safe. Transparent. Trusted.</h2>
          <p className="text-teal-200 text-sm text-center mb-12">
            Everything you need to fundraise with confidence in South Africa.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { Icon: ShieldCheck,   title: 'Verified campaigns', desc: 'We review campaigns to protect our community.' },
              { Icon: Lock,          title: 'Secure payments',    desc: 'Bank-level security on every transaction.' },
              { Icon: MapPin,        title: 'Local SA support',   desc: 'We speak your language and understand your needs.' },
              { Icon: BadgePercent,  title: 'Transparent fees',   desc: 'Low platform fee. No hidden charges, ever.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4">
                  <item.Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-white mb-1.5 text-sm">{item.title}</h3>
                <p className="text-xs text-teal-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#01224b] rounded-3xl px-8 py-14 sm:px-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Someone in your life could use a friend today.
            </h2>
            <p className="text-blue-200 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Start a fundraiser in about five minutes. Free to launch, free to share.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/create">
                <span className="inline-flex items-center justify-center bg-brand-green text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-sm">
                  Start a fundraiser
                </span>
              </Link>
              <Link href="/campaigns">
                <span className="inline-flex items-center justify-center border border-white/30 text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/5 transition-colors text-sm">
                  Back a friend
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
