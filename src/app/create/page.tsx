'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, CATEGORY_EMOJI } from '@/types'

const minDeadline = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const STEP_LABELS = ['Your cause', 'Your story', 'Photo & launch']

export default function CreateCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    story: '',
    goal_amount: '',
    deadline: '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function canProceed() {
    if (step === 1) return form.title.trim().length >= 5 && form.description.trim().length >= 10 && form.category
    if (step === 2) return form.story.trim().length >= 50 && parseFloat(form.goal_amount) >= 100 && form.deadline
    return true
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let image_url: string | null = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `campaigns/${user.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('campaign-images').upload(path, imageFile)
      if (uploadErr) { setError('Image upload failed: ' + uploadErr.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('campaign-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const { data, error: insertErr } = await supabase
      .from('campaigns')
      .insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        story: form.story,
        goal_amount: parseFloat(form.goal_amount),
        category: form.category,
        deadline: form.deadline,
        image_url,
      })
      .select()
      .single()

    if (insertErr) { setError(insertErr.message); setLoading(false); return }
    router.push(`/campaigns/${data.id}`)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => {
            const s = i + 1
            const active = s === step
            const done = s < step
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  done ? 'bg-brand-green text-white' : active ? 'bg-[#01224b] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {done ? '✓' : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-[#01224b]' : done ? 'text-brand-green' : 'text-gray-400'}`}>
                  {label}
                </span>
                {s < STEP_LABELS.length && <div className={`flex-1 h-0.5 ${done ? 'bg-brand-green' : 'bg-gray-100'}`} />}
              </div>
            )
          })}
        </div>

        {/* Header */}
        <div className="mb-8">
          {step === 1 && (
            <>
              <p className="text-teal-500 text-xs font-semibold uppercase tracking-widest mb-2">Step 1 of 3</p>
              <h1 className="text-4xl font-extrabold text-[#01224b] mb-2">What is this for?</h1>
              <p className="text-gray-500 text-sm leading-relaxed">Give your fundraiser a clear title, choose a category, and write one sentence about it.</p>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-teal-500 text-xs font-semibold uppercase tracking-widest mb-2">Step 2 of 3</p>
              <h1 className="text-4xl font-extrabold text-[#01224b] mb-2">Tell your story.</h1>
              <p className="text-gray-500 text-sm leading-relaxed">People give to people, not just causes. Be honest and specific — it makes a real difference.</p>
            </>
          )}
          {step === 3 && (
            <>
              <p className="text-teal-500 text-xs font-semibold uppercase tracking-widest mb-2">Step 3 of 3</p>
              <h1 className="text-4xl font-extrabold text-[#01224b] mb-2">Add a photo & launch.</h1>
              <p className="text-gray-500 text-sm leading-relaxed">Fundraisers with a photo raise significantly more. Add one if you can, then launch.</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            {/* ── Step 1 ── */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Fundraiser title</label>
                  <p className="text-xs text-gray-400 mb-2">One clear sentence — like a headline.</p>
                  <input
                    type="text"
                    placeholder="e.g. Help Nomvula pay for cancer treatment"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    required
                    maxLength={120}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/120</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
                  <p className="text-xs text-gray-400 mb-3">Choose the one that fits best.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => set('category', cat)}
                        className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-medium transition-all ${
                          form.category === cat
                            ? 'border-[#01224b] bg-[#01224b] text-white'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{CATEGORY_EMOJI[cat]}</span>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Short description</label>
                  <p className="text-xs text-gray-400 mb-2">One sentence shown on campaign cards.</p>
                  <input
                    type="text"
                    placeholder="A brief summary shown to potential donors"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    required
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Your story</label>
                  <p className="text-xs text-gray-400 mb-2">Who is this for? What happened? What will the money do? Be specific.</p>
                  <textarea
                    placeholder="Share what's happening in your own words. The more honest and specific you are, the more people will want to help."
                    value={form.story}
                    onChange={e => set('story', e.target.value)}
                    required
                    rows={8}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    {form.story.length > 0 && form.story.length < 50
                      ? <p className="text-xs text-amber-500">{50 - form.story.length} more characters needed</p>
                      : <p className="text-xs text-brand-green">{form.story.length > 0 ? '✓ Good' : ''}</p>
                    }
                    <p className="text-xs text-gray-400">{form.story.length} chars</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Fundraising goal (ZAR)</label>
                  <p className="text-xs text-gray-400 mb-2">Set a realistic, specific amount.</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-semibold">R</span>
                    <input
                      type="number"
                      placeholder="5 000"
                      min="100"
                      value={form.goal_amount}
                      onChange={e => set('goal_amount', e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">End date</label>
                  <p className="text-xs text-gray-400 mb-2">30–90 days works best for most campaigns.</p>
                  <input
                    type="date"
                    min={minDeadline}
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>
              </>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Campaign photo</label>
                  <p className="text-xs text-gray-400 mb-3">Fundraisers with a photo raise significantly more.</p>
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-56 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-3 cursor-pointer py-12 border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
                      <span className="text-3xl">📷</span>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">Click to upload a photo</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Review summary */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Review your fundraiser</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-20 shrink-0">Title</span>
                      <span className="text-gray-900 font-medium">{form.title}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-20 shrink-0">Category</span>
                      <span className="text-gray-900">{CATEGORY_EMOJI[form.category]} {form.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-20 shrink-0">Goal</span>
                      <span className="text-gray-900 font-medium">R {parseFloat(form.goal_amount || '0').toLocaleString('en-ZA')}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400 w-20 shrink-0">Ends</span>
                      <span className="text-gray-900">{form.deadline}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  By launching you agree to our{' '}
                  <a href="/terms" className="underline hover:text-gray-700">terms</a>.
                  Every fundraiser is reviewed before going live.
                </p>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600">{error}</div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setStep(s => s - 1); setError('') }}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => { if (canProceed()) { setStep(s => s + 1); setError('') } }}
                  disabled={!canProceed()}
                  className="bg-[#01224b] text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-[#012a5e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-brand-green text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-brand-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Launching...</>
                  ) : (
                    'Launch fundraiser'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
