import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import type { Campaign } from '@/types'
import { CATEGORIES, CATEGORY_EMOJI } from '@/types'

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
            <h2 className="text-3xl font-extrabold text-[#01224b]">Real people, real moments</h2>
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
              See all categories <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/campaigns?category=${encodeURIComponent(cat)}`}>
                <div className="flex flex-col items-center gap-2.5 bg-white rounded-2xl py-5 px-2 hover:shadow-md transition-all border border-gray-100">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${CIRCLE[cat] ?? 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORY_EMOJI[cat]}
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="how-it-works">
        <h2 className="text-3xl font-extrabold text-[#01224b] text-center mb-12">How FundMeFriend works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 relative">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              ),
              num: '1',
              title: 'Create your fundraiser',
              desc: "It's quick, easy and free. Share your story and set your goal.",
            },
            {
              icon: (
                <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              ),
              num: '2',
              title: 'Share with friends & family',
              desc: 'Spread the word on WhatsApp, Facebook, email and more.',
            },
            {
              icon: (
                <svg className="w-8 h-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              ),
              num: '3',
              title: 'Receive support safely',
              desc: 'Donations go directly to your campaign. We handle the rest.',
            },
          ].map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center relative px-6 py-6">
              {/* Arrow between steps */}
              {i < 2 && (
                <div className="hidden sm:flex absolute top-[52px] right-0 translate-x-1/2 z-10 items-center justify-center">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center mb-4 relative z-10">
                {step.icon}
              </div>
              <div className="w-6 h-6 rounded-full bg-[#01224b] text-white text-xs font-bold flex items-center justify-center mb-3">
                {step.num}
              </div>
              <h3 className="font-bold text-[#01224b] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">{step.desc}</p>
            </div>
          ))}
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
              { icon: '✅', title: 'Verified campaigns', desc: 'We review campaigns to protect our community.' },
              { icon: '🔒', title: 'Secure payments', desc: 'Bank-level security on every transaction.' },
              { icon: '📍', title: 'Local SA support', desc: 'We speak your language and understand your needs.' },
              { icon: '💯', title: 'Transparent fees', desc: 'Low platform fee. No hidden charges, ever.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
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
