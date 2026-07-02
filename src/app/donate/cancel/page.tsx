import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function DonateCancelPage({ searchParams }: Props) {
  const { id } = await searchParams

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">😕</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          No money has been charged. You can try again whenever you&apos;re ready — every rand makes a difference.
        </p>
        <div className="flex flex-col gap-3">
          {id && (
            <Link href={`/campaigns/${id}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">Try again</Button>
            </Link>
          )}
          <Link href="/campaigns">
            <Button variant="outline" className="w-full">Browse campaigns</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full text-gray-500">Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
