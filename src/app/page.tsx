import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import type { Campaign } from '@/types'
import { CATEGORIES, CATEGORY_EMOJI } from '@/types'

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
      <section className="overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-0 items-stretch min-h-[500px]">
            {/* Left: text */}
            <div className="py-12 md:py-16 flex flex-col justify-center">
              <h1 className="text-5xl sm:text-6xl font-extrabold text-[#01224b] leading-[1.05] tracking-tight mb-5">
                Together,<br />we make<br />
                <span className="text-teal-500">dreams</span> possible.
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-md">
                Raise money for education, medical needs, funerals, emergencies and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link href="/create">
                  <span className="inline-flex items-center justify-center bg-brand-green text-white font-semibold px-7 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-sm">
                    Start a fundraiser
                  </span>
                </Link>
                <Link href="/campaigns">
                  <span className="inline-flex items-center justify-center border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-full hover:bg-gray-50 transition-colors text-sm">
                    Browse fundraisers
                  </span>
                </Link>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>🛡️</span> Safe. Secure. Trusted by South Africans.
              </p>
            </div>

            {/* Right: photo */}
            <div className="relative h-72 md:h-auto rounded-3xl md:rounded-none md:rounded-l-3xl overflow-hidden mt-4 md:mt-0">
              <Image
                src="/graduate.jpg.png"
                alt="Graduate celebrating with family"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured campaigns ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        ) : (
          <div className="text-center py-16 border border-gray-100 rounded-2xl">
            <p className="text-gray-400 mb-6 text-sm">No campaigns yet — be the first.</p>
            <Link href="/create">
              <span className="bg-brand-green text-white px-6 py-3 rounded-full text-sm font-medium inline-block hover:bg-brand-green-dark transition-colors">
                Start a fundraiser
              </span>
            </Link>
          </div>
        )}
      </section>

      {/* ── Browse by category ── */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-[#01224b]">Browse by category</h2>
            <Link href="/campaigns" className="text-sm text-teal-600 font-medium hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/campaigns?category=${encodeURIComponent(cat)}`}>
                <div className="flex flex-col items-center gap-2 bg-white rounded-2xl py-4 px-2 hover:shadow-sm transition-shadow border border-gray-100">
                  <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 py-14" id="how-it-works">
        <h2 className="text-3xl font-extrabold text-[#01224b] text-center mb-12">How FundMeFriend works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
          {[
            { num: '1', title: 'Create your fundraiser', desc: "It's quick, easy and free. Share your story and goal.", emoji: '📝' },
            { num: '2', title: 'Share with friends & family', desc: 'Spread the word on WhatsApp, Facebook, email and more.', emoji: '📲' },
            { num: '3', title: 'Receive support safely', desc: 'Donations go directly to your campaign. We handle the rest.', emoji: '🤝' },
          ].map((step, i) => (
            <div key={step.num} className="flex flex-col items-center text-center relative">
              {i < 2 && (
                <div className="hidden sm:block absolute top-8 left-[58%] right-[-42%] h-0.5 bg-gray-200 z-0" />
              )}
              <div className="w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center text-2xl mb-3 relative z-10">
                {step.emoji}
              </div>
              <div className="w-6 h-6 rounded-full bg-[#01224b] text-white text-xs font-bold flex items-center justify-center mb-3">
                {step.num}
              </div>
              <h3 className="font-bold text-[#01224b] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo grid + copy ── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { src: '/hockey.jpg.png', alt: 'Girl playing field hockey' },
            { src: '/grandma.jpg.png', alt: 'South African grandmother' },
            { src: '/hospital.jpg.png', alt: 'Child in hospital' },
            { src: '/graduate.jpg.png', alt: 'Graduate celebrating' },
          ].map((img) => (
            <div key={img.src} className="relative h-44 sm:h-64 rounded-2xl overflow-hidden">
              <Image src={img.src} alt={img.alt} fill sizes="50vw" className="object-cover object-top" unoptimized />
            </div>
          ))}
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#01224b] mb-4">
            Some things you just can&apos;t face alone.
          </h2>
          <p className="text-lg font-semibold italic text-teal-600 mb-5">
            A diagnosis. A fire. Fees due. A family in crisis.
          </p>
          <p className="text-gray-500 text-base leading-relaxed mb-6">
            FundMeFriend gives you a clear, dignified way to share what you&apos;re going through
            and let the people who care about you respond.
          </p>
          <Link href="/create">
            <span className="inline-flex items-center bg-brand-green text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-green-dark transition-colors text-base">
              Start a fundraiser
            </span>
          </Link>
        </div>
      </section>

      {/* ── Trust section ── */}
      <section className="bg-[#01224b] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Safe. Transparent. Trusted.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { emoji: '✅', title: 'Verified campaigns', desc: 'We review campaigns to help keep our community safe.' },
              { emoji: '🔒', title: 'Secure payments', desc: 'Your donations are protected with bank-level security.' },
              { emoji: '📍', title: 'Local SA support', desc: "We're here to help, in the languages you speak." },
              { emoji: '💯', title: 'Transparent fees', desc: 'Low platform fee. No hidden charges.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl mx-auto mb-3">
                  {item.emoji}
                </div>
                <h3 className="font-bold text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-blue-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="bg-gray-900 rounded-3xl px-8 py-14 sm:px-14 text-center relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Someone in your life could use a friend today.
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Start a fundraiser in about five minutes. Free to launch, free to share.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/create">
                <span className="inline-flex items-center justify-center bg-brand-green text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-sm">
                  Start a fundraiser
                </span>
              </Link>
              <Link href="/campaigns">
                <span className="inline-flex items-center justify-center border border-gray-600 text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/5 transition-colors text-sm">
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
