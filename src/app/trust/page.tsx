import Link from 'next/link'

export const metadata = { title: 'Trust & Safety — FundMeFriend' }

export default function TrustPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[#01224b] mb-6">Trust & Safety</h1>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p>
            We want every donor to feel confident giving, and every fundraiser to feel supported.
            Here&apos;s how we work to keep the Platform safe.
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Reporting a concern</h2>
            <p>
              If you believe a campaign is misleading, fraudulent, or violates our{' '}
              <Link href="/terms" className="text-teal-600 hover:underline">Terms</Link>, please email{' '}
              <a href="mailto:hello@fundmefriend.co.za" className="text-teal-600 hover:underline">
                hello@fundmefriend.co.za
              </a>{' '}
              with the campaign link and details. We review every report and may suspend a campaign
              while we investigate.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Payments</h2>
            <p>
              Donations are processed by Ozow, a licensed South African instant EFT provider. We never
              see or store your card or online banking credentials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Donor protection</h2>
            <p>
              Donations are gifts made directly to a fundraiser and are not guaranteed or insured by
              FundMeFriend. If a payment was taken in error — duplicated, failed, or unauthorized —
              contact us and we&apos;ll help resolve it with our payment processor.
            </p>
          </section>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-teal-600 hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  )
}
