import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Props {
  searchParams: Promise<{ campaign?: string; id?: string }>
}

export default async function DonateSuccessPage({ searchParams }: Props) {
  const { campaign, id } = await searchParams

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md w-full">
        {/* Animation */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-5xl">🎉</span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Thank you!</h1>
        <p className="text-gray-600 mb-2 text-lg">Your donation is on its way.</p>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Your payment is being processed via Ozow. The campaign owner will be notified and funds will reflect shortly.
          {campaign && (
            <> You donated to <span className="font-medium text-gray-700">&ldquo;{campaign}&rdquo;</span>.</>
          )}
        </p>

        {/* Share nudge */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-6 text-left">
          <p className="font-bold text-green-800 mb-1">💚 Want to help even more?</p>
          <p className="text-sm text-green-700 mb-4">
            Share this campaign with your friends and family. Every share could mean more donations for someone who needs it.
          </p>
          {id ? (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I just donated to "${campaign ?? 'a campaign'}" on FundMeFriend — check it out and help too! ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/campaigns/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#22be5c] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </a>
          ) : (
            <Link href="/campaigns">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">Browse more campaigns</Button>
            </Link>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {id && (
            <Link href={`/campaigns/${id}`}>
              <Button variant="outline" className="w-full sm:w-auto">Back to campaign</Button>
            </Link>
          )}
          <Link href="/campaigns">
            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">Browse more campaigns</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
