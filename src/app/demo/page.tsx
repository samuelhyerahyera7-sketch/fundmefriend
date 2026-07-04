import Link from 'next/link'
import { Users } from 'lucide-react'
import DemoDonateForm from './DemoDonateForm'

const CAMPAIGN = {
  title: 'Help Thabo finish his engineering degree',
  category: 'Education',
  organiser: 'Nomvula Dlamini',
  raised: 4850,
  goal: 15000,
  donors: 5,
  daysLeft: 88,
  story: `Thabo Khumalo, 23, grew up in Soweto and worked three part-time jobs to fund his first three years of civil engineering at Wits University. He was weeks away from his final exams when his mother suffered a stroke. Medical bills drained the family savings overnight.

Thabo had to drop everything to care for his mom and younger siblings. He missed his exam registration deadline and now owes R14,200 in outstanding fees — the only thing standing between him and his degree.

His lecturers say he is one of the most talented students they have seen. His dream is to build better roads and water systems for communities like the one he grew up in.

Every rand gets him closer to graduation day. Please help Thabo finish what he started.`,
  donations: [
    { name: 'Marcus van Wyk',  amount: 3000, message: 'Future engineer — SA needs you!' },
    { name: 'Sipho Ndlovu',    amount: 500,  message: "Keep going Thabo! My son did engineering too — it's tough but worth it." },
    { name: 'Anonymous',       amount: 1000, message: null },
    { name: 'Zanele Mokoena',  amount: 200,  message: 'Sharing this with everyone I know. Go well!' },
    { name: 'Priya Naidoo',    amount: 150,  message: 'Proud of you for not giving up.' },
  ],
}

function formatCurrency(n: number) {
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

function Avatar({ name }: { name: string }) {
  const initials = name === 'Anonymous' ? 'AN' : name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0 border border-white/30">
      {initials}
    </div>
  )
}

function AvatarLight({ name }: { name: string }) {
  const initials = name === 'Anonymous' ? 'AN' : name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  )
}

export default function DemoPage() {
  const percent = Math.round((CAMPAIGN.raised / CAMPAIGN.goal) * 100)

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ── Navy hero banner ── */}
      <div className="bg-[#01224b] px-4 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-blue-300/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/campaigns" className="hover:text-white transition-colors">Campaigns</Link>
            <span>/</span>
            <span className="text-blue-200 truncate max-w-xs">Thabo&apos;s fundraiser</span>
          </nav>

          <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-4">
            {CAMPAIGN.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-3 max-w-2xl">
            {CAMPAIGN.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-blue-200 text-sm">
              by <span className="font-semibold text-white">{CAMPAIGN.organiser}</span>
            </p>
            <span className="text-blue-400">·</span>
            <p className="text-blue-200 text-sm flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {CAMPAIGN.donors} donors
            </p>
            <span className="text-blue-400">·</span>
            <p className="text-blue-200 text-sm">{CAMPAIGN.daysLeft} days left</p>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: story + donors */}
          <div className="lg:col-span-2 space-y-6">

            {/* Campaign image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#01224b] to-teal-700 flex items-center justify-center shadow-md">
              <div className="text-center text-white">
                <p className="text-sm font-semibold uppercase tracking-widest text-teal-300 mb-2">Education Campaign</p>
                <p className="text-2xl font-extrabold">{formatCurrency(CAMPAIGN.raised)} raised</p>
                <p className="text-teal-300 text-sm mt-1">of {formatCurrency(CAMPAIGN.goal)} goal</p>
              </div>
            </div>

            {/* Mobile: donate card */}
            <div className="lg:hidden rounded-2xl overflow-hidden shadow-md">
              <div className="bg-[#01224b] px-5 py-4">
                <p className="text-2xl font-extrabold text-white">{formatCurrency(CAMPAIGN.raised)}</p>
                <p className="text-blue-300 text-sm mt-0.5">raised of {formatCurrency(CAMPAIGN.goal)} goal</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                  <div className="bg-[#599e3a] h-2 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <p className="text-teal-300 text-xs mt-1.5">{percent}% funded · {CAMPAIGN.donors} donors · {CAMPAIGN.daysLeft} days left</p>
              </div>
              <div className="bg-white px-5 py-5">
                <DemoDonateForm />
              </div>
            </div>

            {/* Story */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">The story</h2>
              <div className="text-gray-600 text-sm leading-7 whitespace-pre-wrap">{CAMPAIGN.story}</div>
            </div>

            {/* Donors */}
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#01224b] px-6 py-4">
                <h2 className="font-bold text-white text-base">{CAMPAIGN.donors} people have donated</h2>
              </div>
              <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl divide-y divide-gray-100">
                {CAMPAIGN.donations.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4">
                    <AvatarLight name={d.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                      {d.message && (
                        <p className="text-xs text-gray-500 truncate">&ldquo;{d.message}&rdquo;</p>
                      )}
                    </div>
                    <span className="font-bold text-[#599e3a] text-sm shrink-0">{formatCurrency(d.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-md sticky top-24">
              {/* Dark header */}
              <div className="bg-[#01224b] px-6 py-5">
                <p className="text-3xl font-extrabold text-white">{formatCurrency(CAMPAIGN.raised)}</p>
                <p className="text-blue-300 text-sm mt-0.5">raised of {formatCurrency(CAMPAIGN.goal)} goal</p>
                <div className="w-full bg-white/10 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div className="bg-[#599e3a] h-2.5 rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-2">
                  <span className="text-teal-300 font-semibold">{percent}% funded</span>
                  <span className="text-blue-300 flex items-center gap-1">
                    <Users className="w-3 h-3" />{CAMPAIGN.donors} donors
                  </span>
                </div>

                {/* Recent donors preview */}
                <div className="flex items-center gap-1.5 mt-4">
                  {CAMPAIGN.donations.slice(0, 4).map((d, i) => (
                    <Avatar key={i} name={d.name} />
                  ))}
                  <span className="text-xs text-blue-300 ml-1">and {CAMPAIGN.donors - 4} more</span>
                </div>
              </div>

              {/* Form area */}
              <div className="bg-white px-6 py-5">
                <DemoDonateForm />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
