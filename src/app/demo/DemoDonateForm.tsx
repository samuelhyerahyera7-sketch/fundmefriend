'use client'

import { useState } from 'react'
import { ChevronLeft, ShieldCheck, CheckCircle2 } from 'lucide-react'

const PRESETS = [
  { label: 'R50',  value: 50 },
  { label: 'R100', value: 100 },
  { label: 'R200', value: 200 },
  { label: 'R500', value: 500 },
]

export default function DemoDonateForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
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

  /* ── Step 1: Choose amount ── */
  if (step === 1) {
    return (
      <div className="space-y-4">
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

  /* ── Step 3: Thank you ── */
  if (step === 3) {
    return (
      <div className="text-center py-4 space-y-3">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
        <p className="font-bold text-gray-900 text-lg">Thank you{name && !isAnonymous ? `, ${name.split(' ')[0]}` : ''}!</p>
        <p className="text-sm text-gray-500">
          Your R{amount.toLocaleString('en-ZA')} donation makes a real difference.
        </p>
        <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          This is a demo — no payment was taken. On the live site you would be redirected to Ozow to complete your EFT.
        </p>
        <button
          type="button"
          onClick={() => { setStep(1); setSelectedPreset(null); setCustomAmount(''); setName(''); setMessage('') }}
          className="text-sm text-[#01224b] font-medium hover:underline"
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
        <ChevronLeft className="w-4 h-4" /> Change amount
      </button>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">Donating</span>
        <span className="text-xl font-extrabold text-[#01224b]">R{amount.toLocaleString('en-ZA')}</span>
      </div>

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

      <button
        type="button"
        onClick={() => setStep(3)}
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
