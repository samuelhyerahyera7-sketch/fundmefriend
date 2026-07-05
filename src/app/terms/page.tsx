import Link from 'next/link'

export const metadata = { title: 'Terms of Service — FundMeFriend' }

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold text-[#01224b] mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated 5 July 2026</p>

        <div className="prose prose-sm max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p>
            These Terms govern your use of FundMeFriend (&ldquo;we&rdquo;, &ldquo;us&rdquo;, the &ldquo;Platform&rdquo;).
            By creating a fundraiser, donating, or otherwise using the Platform, you agree to these Terms.
          </p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. What we are</h2>
            <p>
              FundMeFriend is a technology platform that lets people create fundraising campaigns and
              lets donors send money to them via Ozow instant EFT. We are not a bank, a charity, an
              escrow agent, or a party to any donation — we connect fundraisers and donors and pass
              payments through our payment processor.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Fundraiser responsibilities</h2>
            <p>
              If you create a campaign, you are solely responsible for the accuracy of what you post
              and for how donated funds are used. You must only raise money for genuine causes and
              must not misrepresent yourself, the beneficiary, or how funds will be used. We may
              remove a campaign or suspend an account at any time if we reasonably believe it is
              fraudulent, misleading, or violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Donor responsibilities</h2>
            <p>
              Donations are voluntary gifts made directly to a fundraiser, not purchases, and are
              generally non-refundable except where a payment failed, was duplicated, or was not
              authorized by you. We do not guarantee that any campaign will meet its goal or that
              funds will be used in a particular way.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Payments</h2>
            <p>
              Donations are processed by Ozow. We do not store your card or banking credentials.
              Once a donation is confirmed by our payment processor it is reflected on the campaign;
              disputed or reversed transactions may result in the corresponding amount being deducted
              from a campaign&apos;s raised total.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Prohibited use</h2>
            <p>
              You may not use the Platform for unlawful purposes, to raise funds for a cause you do
              not genuinely represent, to launder money, or to harass or defraud any person.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">6. Liability</h2>
            <p>
              The Platform is provided &ldquo;as is&rdquo;. To the fullest extent permitted by law, we are
              not liable for the conduct of any fundraiser or donor, or for how donated funds are
              ultimately used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">7. Changes</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Platform after a
              change means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">8. Contact</h2>
            <p>
              Questions about these Terms? Email us at{' '}
              <a href="mailto:hello@fundmefriend.co.za" className="text-teal-600 hover:underline">
                hello@fundmefriend.co.za
              </a>.
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
