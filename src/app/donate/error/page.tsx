import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DonateErrorPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-9 h-9 text-red-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment error</h1>
        <p className="text-gray-500 mb-8">Something went wrong with your payment. Please try again or contact support.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/campaigns"><Button>Back to Campaigns</Button></Link>
          <Link href="/"><Button variant="outline">Go Home</Button></Link>
        </div>
      </div>
    </div>
  )
}
