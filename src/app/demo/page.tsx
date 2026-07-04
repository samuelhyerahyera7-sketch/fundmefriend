import Link from 'next/link'
import { Calendar, Users } from 'lucide-react'
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
    { name: 'Marcus van Wyk',   amount: 3000, message: 'Future engineer — SA needs you!' },
    { name: 'Sipho Ndlovu',     amount: 500,  message: "Keep going Thabo! My son did engineering too — it's tough but worth it." },
    { name: 'Anonymous',        amount: 1000, message: null },
    { name: 'Zanele Mokoena',   amount: 200,  message: 'Sharing this with everyone I know. Go well!' },
    { name: 'Priya Naidoo',     amount: 150,  message: 'Proud of you for not giving up.' },
  ],
}

function formatCurrency(n: number) {
  return `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
}

function Avatar({ name }: { name: string }) {
  const initials = name === 'Anonymous' ? 'AN' : name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
      {initials}
    </div>
  )
}

export default function DemoPage() {
  const percent = Math.round((CAMPAIGN.raised / CAMPAIGN.goal) * 100)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/campaigns" className="hover:text-green-600 transition-colors">Campaigns</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{CAMPAIGN.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3 bg-blue-50 text-blue-700 border-blue-200">
              {CAMPAIGN.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{CAMPAIGN.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-500 text-sm">
                by <span className="font-medium text-gray-700">{CAMPAIGN.organiser}</span>
              </p>
              <span className="text-gray-300">·</span>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {CAMPAIGN.donors} donors
              </p>
            </div>
          </div>

          {/* Image placeholder */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
            <p className="text-blue-500 font-semibold text-sm tracking-wide uppercase">Education Campaign</p>
          </div>

          {/* Mobile progress */}
          <div className="lg:hidden bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex justify-between items-baseline mb-2">
              <p className="text-2xl font-extrabold text-gray-900">{formatCurrency(CAMPAIGN.raised)}</p>
              <p className="text-sm text-gray-500">of {formatCurrency(CAMPAIGN.goal)}</p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{percent}% funded · {CAMPAIGN.donors} donors</span>
              <span>{CAMPAIGN.daysLeft} days left</span>
            </div>
            <DemoDonateForm />
          </div>

          {/* Story */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">The story</h2>
            <div className="text-gray-600 text-sm leading-7 whitespace-pre-wrap">{CAMPAIGN.story}</div>
          </div>

          {/* Donors */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">
              {CAMPAIGN.donors} donations
            </h2>
            <div className="space-y-4">
              {CAMPAIGN.donations.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar name={d.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{d.name}</p>
                    {d.message && (
                      <p className="text-xs text-gray-500 truncate">&ldquo;{d.message}&rdquo;</p>
                    )}
                  </div>
                  <span className="font-bold text-green-600 text-sm shrink-0">{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <div className="mb-4">
              <p className="text-3xl font-extrabold text-gray-900">{formatCurrency(CAMPAIGN.raised)}</p>
              <p className="text-sm text-gray-500 mt-0.5">raised of {formatCurrency(CAMPAIGN.goal)} goal</p>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span className="font-semibold text-gray-700">{percent}% funded</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {CAMPAIGN.donors} donors
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400 mb-5">
              <Calendar className="w-4 h-4" />
              {CAMPAIGN.daysLeft} days left
            </div>

            <DemoDonateForm />
          </div>
        </div>
      </div>
    </div>
  )
}
