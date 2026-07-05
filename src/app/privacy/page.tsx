import Link from 'next/link'

export const metadata = { title: 'Privacy Policy — FundMeFriend' }

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[#01224b] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated 5 July 2026</p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p>
            This policy explains what personal information FundMeFriend collects, why, and how it is
            protected, in line with South Africa&apos;s Protection of Personal Information Act (POPIA).
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Account details: name, email address, password (stored hashed by our authentication provider).</li>
              <li>Campaign content you choose to publish: title, story, photos, goal amount.</li>
              <li>Donation details: amount, optional message, and whether you chose to donate anonymously.</li>
              <li>Payment processing data handled directly by Ozow — we do not receive or store your card or bank login details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How we use it</h2>
            <p>
              We use this information to operate the Platform: creating your account, displaying
              campaigns, processing donations, sending payment confirmations, and keeping the
              Platform secure. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Who can see what</h2>
            <p>
              Campaign titles, stories, photos, and goal progress are public by design. Donations are
              shown publicly with the donor&apos;s name unless you choose to donate anonymously, in
              which case only &ldquo;Anonymous&rdquo; is shown. Your email address is never shown publicly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Where data is stored</h2>
            <p>
              Account and campaign data is stored with Supabase; payments are processed by Ozow.
              Both providers apply industry-standard security controls to data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your rights</h2>
            <p>
              You can request access to, correction of, or deletion of your personal information at
              any time by emailing{' '}
              <a href="mailto:hello@fundmefriend.co.za" className="text-teal-600 hover:underline">
                hello@fundmefriend.co.za
              </a>. Note that completed donation records may be retained where needed for financial
              record-keeping and fraud prevention.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Cookies</h2>
            <p>
              We use only the essential cookies required to keep you signed in and to secure your
              session. We do not use third-party advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Contact</h2>
            <p>
              Questions about this policy or how your data is handled? Email{' '}
              <a href="mailto:hello@fundmefriend.co.za" className="text-teal-600 hover:underline">
                hello@fundmefriend.co.za
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm text-teal-600 hover:underline">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
