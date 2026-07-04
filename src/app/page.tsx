import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import type { Campaign } from '@/types'

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
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#01224b] leading-[1.05] tracking-tight mb-5 max-w-2xl">
          Raise money for the{' '}
          <span className="text-teal-500">people</span>{' '}
          who need you.
        </h1>
        <p className="text-gray-500 text-lg sm:text-xl mb-8 max-w-lg leading-relaxed">
          FundMeFriend helps you rally friends, family, and neighbors around
          the moments that matter — medical bills, emergencies, education, and
          everything in between.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Link href="/create">
            <span className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-7 py-3.5 rounded-full hover:bg-brand-green-dark transition-colors text-sm">
              Start a fundraiser            </span>
          </Link>
          <Link href="/campaigns">
            <span className="inline-flex items-center justify-center border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-full hover:bg-gray-50 transition-colors text-sm">
              Browse fundraisers
            </span>
          </Link>
        </div>

        {/* Hero photo */}
        <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1400&q=80"
            alt="Friends and community coming together"
            fill
            sizes="(max-width: 1280px) 100vw, 1152px"
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
        </div>
      </section>

      {/* ── Trust / Why — teal background ── */}
      <section className="bg-teal-600 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal-200 text-xs font-semibold uppercase tracking-widest mb-4">WHY FUND ME FRIEND</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-12 max-w-sm leading-tight">
            Built on kindness, not commissions.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                title: 'Backed by trust',
                desc: 'Every fundraiser is verified. Funds are protected and released only to the person who needs them.',
              },
              {
                title: 'Built for real people',
                desc: 'No pushy tactics, no gimmicks. Just a clean space to tell your story and let friends help.',
              },
              {
                title: '0% platform fee',
                desc: "We don't take a cut from what your community gives. Only standard payment processing applies.",
              },
            ].map((item, i) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-teal-500/50 flex items-center justify-center shrink-0 text-white font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-teal-100 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured campaigns ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-brand-green text-xs font-semibold uppercase tracking-widest mb-2">FEATURED FRIENDS</p>
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Real people, real<br className="hidden sm:block" /> moments
          </h2>
          <Link
            href="/campaigns"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1 shrink-0 ml-4"
          >
            See all          </Link>
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

      {/* ── How it works ── */}
      <section className="bg-gray-50 py-16 px-4" id="how-it-works">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Here's how it works</h2>
          <div className="mb-10 space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">Simple.</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-brand-green">Transparent.</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500">Trustworthy.</p>
          </div>

          <ol className="text-left space-y-6 mb-10">
            {[
              { bold: 'Create your fundraiser', rest: ' — tell your story, set your goal, and add a photo.' },
              { bold: 'Share it', rest: ' — with family, friends, and your community.' },
              { bold: 'Donations come in', rest: ' — as the people who care about you show up.' },
              { bold: 'We verify', rest: ' — every fundraiser is reviewed and every donation is protected.' },
              { bold: 'Withdraw to your bank', rest: ' — securely and on your terms.' },
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="text-gray-700 text-base leading-relaxed">
                  <span className="font-bold text-gray-900">{step.bold}</span>{step.rest}
                </p>
              </li>
            ))}
          </ol>

          <Link href="/create">
            <span className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-full font-semibold hover:bg-brand-green-dark transition-colors">
              Start a fundraiser            </span>
          </Link>
        </div>
      </section>

      {/* ── Join the Movement ── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* 2×2 photo grid */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { src: '/hockey.jpg.png', alt: 'Girl playing field hockey' },
            { src: '/grandma.jpg.png', alt: 'South African grandmother' },
            { src: '/hospital.jpg.png', alt: 'Child in hospital' },
            { src: '/graduate.jpg.png', alt: 'Graduate celebrating' },
          ].map((img) => (
            <div key={img.src} className="relative h-44 sm:h-64 rounded-2xl overflow-hidden">
              <Image src={img.src} alt={img.alt} fill sizes="50vw" className="object-cover object-top" />
            </div>
          ))}
        </div>

        {/* Text below */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Some things you just can't face alone.
          </h2>
          <p className="text-lg sm:text-xl font-semibold italic text-teal-600 mb-5">
            A diagnosis. A fire. Fees due. A family in crisis.
          </p>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-4">
            FundMeFriend gives you a clear, dignified way to share what you're
            going through and let the people who care about you respond. Whether
            it's a cancer diagnosis, a home lost to fire, a medical emergency, or
            a genuine crisis that's left you with nowhere to turn — the people in
            your corner want to know. Let us help you reach them.
          </p>
          <Link href="/create">
            <span className="inline-flex items-center gap-2 bg-brand-green text-white font-semibold px-8 py-4 rounded-full hover:bg-brand-green-dark transition-colors text-base">
              Start a fundraiser            </span>
          </Link>
        </div>
      </section>

      {/* ── Bottom CTA — dark card ── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-gray-900 rounded-3xl px-8 py-14 sm:px-14 relative overflow-hidden">
          {/* teal accent blob */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5 max-w-lg">
              Someone in your life could use a friend today.
            </h2>
            <p className="text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
              Start a fundraiser in about five minutes. It&apos;s free to launch,
              free to share, and 100% of what people give goes where it should.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/create">
                <span className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm">
                  Start a fundraiser                </span>
              </Link>
              <Link href="/campaigns">
                <span className="inline-flex items-center justify-center border border-gray-600 text-white font-medium px-6 py-3 rounded-full hover:bg-white/5 transition-colors text-sm">
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
