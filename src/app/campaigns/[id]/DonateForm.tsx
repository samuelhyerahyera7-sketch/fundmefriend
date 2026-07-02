'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const PRESETS = [
  { label: 'R50', value: 50 },
  { label: 'R100', value: 100 },
  { label: 'R200', value: 200 },
  { label: 'R500', value: 500 },
  { label: 'R1 000', value: 1000 },
]

const OZOW_POST_URL = 'https://pay.ozow.com/'

export default function DonateForm({ campaignId, campaignTitle }: { campaignId: string; campaignTitle: string }) {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const numAmount = parseFloat(amount) || 0

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!numAmount || numAmount < 5) { setError('Minimum donation is R5'); return }
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const res = await fetch('/api/ozow/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        amount: numAmount,
        message,
        isAnonymous,
        donorId: user?.id ?? null,
        donorEmail: user?.email ?? null,
      }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Something went wrong. Please try again.'); setLoading(false); return }

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = OZOW_POST_URL
    Object.entries(data.payload as Record<string, string>).forEach(([k, v]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = k
      input.value = v
      form.appendChild(input)
    })
    document.body.appendChild(form)
    form.submit()
  }

  return (
    <form onSubmit={handleDonate} className="space-y-3">
      {/* Preset amounts */}
      <div className="grid grid-cols-5 gap-1.5">
        {PRESETS.map(p => (
          <button
            key={p.value}
            type="button"
            onClick={() => setAmount(String(p.value))}
            className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
              amount === String(p.value)
                ? 'bg-green-600 text-white border-green-600'
                : 'border-gray-200 text-gray-700 hover:border-green-400 hover:text-green-700 bg-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">R</span>
        <input
          type="number"
          placeholder="Other amount"
          min="5"
          step="1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      {/* Message */}
      <textarea
        placeholder="Leave an encouraging message (optional)"
        value={message}
        onChange={e => setMessage(e.target.value)}
        maxLength={200}
        rows={2}
        className="w-full rounded-lg border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white"
      />

      {/* Anonymous */}
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={e => setIsAnonymous(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        Donate anonymously
      </label>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
        size="lg"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to Ozow...
          </span>
        ) : (
          `Donate${numAmount >= 5 ? ` R${numAmount.toLocaleString('en-ZA')}` : ''} via Ozow`
        )}
      </Button>

      <p className="text-center text-xs text-gray-400">🔒 Secure payment via Ozow instant EFT</p>
    </form>
  )
}
