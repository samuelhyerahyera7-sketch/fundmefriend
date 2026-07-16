'use client'

import { useState, useEffect } from 'react'
import { ShieldCheck, CheckCircle2, Loader2, Lock } from 'lucide-react'

const PRESETS = [
  { label: 'R50',  value: 50 },
  { label: 'R100', value: 100 },
  { label: 'R200', value: 200 },
  { label: 'R500', value: 500 },
]

type Step = 1 | 2 | 'paying' | 'done'

export default function DemoDonateForm() {
  const [step, setStep] = useState<Step>(1)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

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

  function reset() {
    setStep(1)
    setSelectedPreset(null)
    setCustomAmount('')
    setName('')
    setMessage('')
    setIsAnonymous(false)
  }

  // Simulate payment gateway redirect delay then success
  useEffect(() => {
    if (step !== 'paying') return
    const t = setTimeout(() => setStep('done'), 2800)
    return () => clearTimeout(t)
  }, [step])

  /* ── Step 1: Choose amount ── */
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700 font-medium">
          Preview only — this form does not take a real payment.
        </div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Choose an amount</p>
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

  /* ── Paying: simulated gateway redirect ── */
  if (step === 'paying') {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#01224b] flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-base">Connecting to Ozow</p>
          <p className="text-sm text-gray-500 mt-1">Securing your R{amount.toLocaleString('en-ZA')} payment...</p>
        </div>
        <Loader2 className="w-6 h-6 text-[#599e3a] animate-spin mx-auto" />
        <p className="text-xs text-gray-400">You would be redirected to Ozow&apos;s secure EFT page</p>
      </div>
    )
  }

  /* ── Done: payment confirmed ── */
  if (step === 'done') {
    return (
      <div className="text-center py-4 space-y-4">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
        <div>
          <p className="font-bold text-gray-900 text-lg">
            Payment confirmed!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {isAnonymous ? 'Your anonymous donation of' : `${name || 'Your'} donation of`} R{amount.toLocaleString('en-ZA')} was received.
          </p>
        </div>
        {message && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 text-left border border-gray-100">
            &ldquo;{message}&rdquo;
          </div>
        )}
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-xs text-green-700 text-left">
          A confirmation email has been sent. The campaign organiser will be notified.
        </div>
        <p className="text-xs text-gray-400">
          This is a demo — no real payment was taken.
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-[#01224b] font-semibold hover:underline"
        >
          Donate again
        </button>
      </div>
    )
  }

  /* ── Step 2: Your details ── */
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setStep(1)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors -mt-1"
      >
        Change amount
      </button>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Donating</span>
        <span className="text-xl font-extrabold text-[#01224b]">R{amount.toLocaleString('en-ZA')}</span>
      </div>

      {/* Name field — always in DOM, fades out when anonymous to avoid layout jump */}
      <div className={`transition-all duration-200 overflow-hidden ${isAnonymous ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          Your name <span className="font-normal normal-case">— optional</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Sipho Ndlovu"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={80}
          tabIndex={isAnonymous ? -1 : 0}
          className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-[#01224b] bg-white"
        />
      </div>

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
          className={`relative shrink-0 w-12 h-7 rounded-full transition-all duration-300 ease-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01224b] ${
            isAnonymous
              ? 'bg-gradient-to-r from-[#01224b] to-[#012a5e] shadow-[0_0_0_1px_rgba(1,34,75,0.4),0_2px_8px_rgba(1,34,75,0.5)]'
              : 'bg-gray-400 shadow-[0_0_0_1px_rgba(0,0,0,0.05)]'
          }`}
        >
          <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${isAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-gray-700 font-medium">Donate anonymously</span>
      </label>

      <button
        type="button"
        onClick={() => setStep('paying')}
        className="w-full py-4 rounded-xl bg-[#599e3a] hover:bg-[#4a8730] text-white font-bold text-base transition-colors shadow-sm"
      >
        Donate R{amount.toLocaleString('en-ZA')}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
        Secure payment via Ozow instant EFT
      </div>
    </div>
  )
}
