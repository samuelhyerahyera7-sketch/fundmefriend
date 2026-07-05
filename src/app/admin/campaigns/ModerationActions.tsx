'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ModerationActions({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState('')

  async function decide(decision: 'approve' | 'reject') {
    setLoading(decision)
    setError('')
    const res = await fetch('/api/admin/campaigns/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, decision }),
    })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Something went wrong' }))
      setError(error)
      setLoading(null)
      return
    }
    router.refresh()
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => decide('approve')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 bg-brand-green text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {loading === 'approve' && <Loader2 className="w-4 h-4 animate-spin" />} Approve
        </button>
        <button
          onClick={() => decide('reject')}
          disabled={loading !== null}
          className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {loading === 'reject' && <Loader2 className="w-4 h-4 animate-spin" />} Reject
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  )
}
