import Link from 'next/link'

export const metadata = { title: 'About — FundMeFriend' }

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[#01224b] mb-6">About FundMeFriend</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-5 leading-relaxed">
          <p>
            FundMeFriend is a crowdfunding platform built for South Africans raising money for the
            people and causes closest to them — medical bills, education, emergencies, and community
            projects.
          </p>
          <p>
            We keep things simple: start a fundraiser in minutes, share it with the people who care,
            and receive donations by instant EFT via Ozow — with no platform fee taken off the top.
          </p>
          <p>
            Have a question or want to reach the team? Email us at{' '}
            <a href="mailto:hello@fundmefriend.co.za" className="text-teal-600 hover:underline">
              hello@fundmefriend.co.za
            </a>.
          </p>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-teal-600 hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
