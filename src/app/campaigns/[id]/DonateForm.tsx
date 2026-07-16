'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import PayPalButton from './PayPalButton'

const PRESETS_ZAR = [
  { label: 'R50',  value: 50 },
  { label: 'R100', value: 100 },
  { label: 'R200', value: 200 },
  { label: 'R500', value: 500 },
]

const PRESETS_USD = [
  { label: '$5',  value: 5 },
  { label: '$10', value: 10 },
  { label: '$25', value: 25 },
  { label: '$50', value: 50 },
]

const OZOW_POST_URL = 'https://pay.ozow.com/'

export default function DonateForm({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR')
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [tipPercent, setTipPercent] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [donorId, setDonorId] = useState<string | null>(null)

  const presets = currency === 'ZAR' ? PRESETS_ZAR : PRESETS_USD
  const minAmount = currency === 'ZAR' ? 5 : 1
  const amount = selectedPreset ?? (parseFloat(customAmount) || 0)
  const isValidAmount = amount >= minAmount
  const tipAmount = currency === 'ZAR' ? Math.round(amount * tipPercent) / 100 : 0

  function handlePreset(val: number) {
    setSelectedPreset(val)
    setCustomAmount('')
  }

  function handleCustomChange(val: string) {
    setCustomAmount(val)
    setSelectedPreset(null)
  }

  function switchCurrency(next: 'ZAR' | 'USD') {
    setCurrency(next)
    setSelectedPreset(null)
    setCustomAmount('')
  }

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setDonorId(data.user?.id ?? null))
  }, [])

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault()
    if (currency !== 'ZAR') return
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
        tipAmount,
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
        {/* Currency toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => switchCurrency('ZAR')}
            className={`flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-all ${
              currency === 'ZAR' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
            }`}
          >
            <span className={`text-sm font-bold ${currency === 'ZAR' ? 'text-[#01224b]' : 'text-gray-500'}`}>ZAR</span>
            <span className="text-[10px] text-gray-400">Ozow · South Africa</span>
          </button>
          <button
            type="button"
            onClick={() => switchCurrency('USD')}
            className={`flex flex-col items-center gap-0.5 py-2.5 rounded-lg transition-all ${
              currency === 'USD' ? 'bg-white shadow-sm' : 'hover:bg-white/50'
            }`}
          >
            <span className={`text-sm font-bold ${currency === 'USD' ? 'text-[#01224b]' : 'text-gray-500'}`}>USD</span>
            <span className="text-[10px] text-gray-400">PayPal · International</span>
          </button>
        </div>

        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Choose an amount</p>

        {/* 2×2 preset grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {presets.map(p => (
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
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">{currency === 'ZAR' ? 'R' : '$'}</span>
            <input
              type="number"
              placeholder={currency === 'ZAR' ? 'e.g. 350' : 'e.g. 25'}
              min={minAmount}
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
          {isValidAmount ? `Continue — ${currency === 'ZAR' ? 'R' : '$'}${amount.toLocaleString('en-ZA')}` : 'Select an amount'}
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
        <span className="text-xl font-extrabold text-[#01224b]">{currency === 'ZAR' ? 'R' : '$'}{amount.toLocaleString('en-ZA')}</span>
      </div>

      {/* Optional tip — Ozow/ZAR only */}
      {currency === 'ZAR' && (
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            Support FundMeFriend <span className="font-normal normal-case">— optional tip, 0% platform fee</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 10, 15, 20].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => setTipPercent(pct)}
                className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                  tipPercent === pct
                    ? 'bg-[#01224b] text-white border-[#01224b]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                {pct === 0 ? 'No tip' : `${pct}%`}
              </button>
            ))}
          </div>
          {tipAmount > 0 && (
            <p className="text-xs text-gray-400 mt-1.5">
              R{tipAmount.toLocaleString('en-ZA')} tip · Total R{(amount + tipAmount).toLocaleString('en-ZA')}
            </p>
          )}
        </div>
      )}

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
          className={`relative shrink-0 w-12 h-7 rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green ${isAnonymous ? 'bg-brand-green border-brand-green-dark' : 'bg-gray-400 border-gray-400'}`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-transform duration-200 ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-gray-700 font-medium">Donate anonymously</span>
      </label>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</p>
      )}

      {currency === 'ZAR' ? (
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
            `Donate R${(amount + tipAmount).toLocaleString('en-ZA')}`
          )}
        </button>
      ) : (
        <PayPalButton
          campaignId={campaignId}
          amount={amount}
          message={message.trim()}
          isAnonymous={isAnonymous}
          donorId={donorId}
          onSuccess={() => router.push(`/donate/success?id=${campaignId}`)}
        />
      )}

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        {currency === 'ZAR' ? 'Secure payment via Ozow instant EFT' : 'Secure payment via PayPal'}
      </div>
    </form>
  )
}
