'use client'

import { useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PRESETS = [
  { label: 'R50',  value: 50 },
  { label: 'R100', value: 100 },
  { label: 'R200', value: 200 },
  { label: 'R500', value: 500 },
]

const OZOW_POST_URL = 'https://pay.ozow.com/'

export default function DonateForm({ campaignId }: { campaignId: string }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amount = selectedPreset ?? (parseFloat(customAmount) || 0)
  const isValidAmount = amount >= 5

  function handlePreset(val: number) {
    setSelectedPreset(val)
    setCustomAmount('')
  }

  function handleCustomChange(val: string) {
    setCustomAmount(val)
    setSelectedPreset(null)
  }

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isValidAmount) { setError('Minimum donation is R5'); return }
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const res = await fetch('/api/ozow/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId,
        amount,
        message: message.trim() || null,
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

  /* ── Step 1: Choose amount ── */
  if (step === 1) {
    return (
      <div className="space-y-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Choose an amount</p>

        {/* 2×2 preset grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {PRESETS.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePreset(p.value)}
              className={`py-4 rounded-xl text-base font-bold border-2 transition-all ${
                selectedPreset === p.value
                  ? 'bg-[#01224b] text-white border-[#01224b] shadow-sm'
                  : 'border-gray-200 text-gray-800 hover:border-[#01224b] hover:text-[#01224b] bg-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div>
          <p className="text-xs text-gray-400 mb-1.5 font-medium">Or enter your own amount</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">R</span>
            <input
              type="number"
              placeholder="e.g. 350"
              min="5"
              step="1"
              value={customAmount}
              onChange={e => handleCustomChange(e.target.value)}
              className="w-full h-12 pl-8 pr-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:outline-none focus:border-[#01224b] bg-white"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!isValidAmount}
          className="w-full py-4 rounded-xl bg-[#599e3a] hover:bg-[#4a8730] text-white font-bold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {isValidAmount ? `Continue — R${amount.toLocaleString('en-ZA')}` : 'Select an amount'}
        </button>
      </div>
    )
  }

  /* ── Step 2: Your details ── */
  return (
    <form onSubmit={handleDonate} className="space-y-4">
      <button
        type="button"
        onClick={() => setStep(1)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors -mt-1"
      >
        Change amount
      </button>

      {/* Amount summary */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Donating</span>
        <span className="text-xl font-extrabold text-[#01224b]">R{amount.toLocaleString('en-ZA')}</span>
      </div>

      {/* Name field */}
      {!isAnonymous && (
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Your name <span className="font-normal normal-case">— optional</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sipho Ndlovu"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={80}
            className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#01224b] bg-white"
          />
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          Message <span className="font-normal normal-case">— optional</span>
        </label>
        <textarea
          placeholder="Leave an encouraging message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={200}
          rows={2}
          className="w-full rounded-xl border-2 border-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-[#01224b] resize-none bg-white"
        />
      </div>

      {/* Anonymous toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none py-1">
        <button
          type="button"
          role="switch"
          aria-checked={isAnonymous}
          onClick={() => setIsAnonymous(v => !v)}
          className={`relative w-10 h-6 rounded-full transition-colors focus:outline-none ${isAnonymous ? 'bg-[#01224b]' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-1'}`} />
        </button>
        <span className="text-sm text-gray-700 font-medium">Donate anonymously</span>
      </label>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-[#599e3a] hover:bg-[#4a8730] text-white font-bold text-base transition-colors disabled:opacity-50 shadow-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to payment...
          </span>
        ) : (
          `Donate R${amount.toLocaleString('en-ZA')}`
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        Secure payment via Ozow instant EFT
      </div>
    </form>
  )
}
