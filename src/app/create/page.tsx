'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES } from '@/types'

const minDeadline = new Date(Date.now() + 86400000).toISOString().split('T')[0]

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function canProceed() {
    if (step === 1) return form.title.trim() && form.description.trim() && form.category
    if (step === 2) return form.story.trim().length >= 50 && parseFloat(form.goal_amount) >= 100 && form.deadline
    return false
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canProceed()) return
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
        {/* Header */}
        <p className="text-teal-500 text-xs font-semibold uppercase tracking-widest mb-3">
          {step === 1 ? 'START A FUNDRAISER' : 'YOUR STORY'}
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
          {step === 1 ? 'Tell us who\nthis is for.' : 'Set your goal\nand details.'}
        </h1>
        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          {step === 1
            ? 'Just a few gentle questions. You can always come back and polish everything later.'
            : "Tell your story honestly. People give to people, not just causes."}
        </p>

        {/* Step indicator dots */}
        <div className="flex gap-2 mb-10">
          {[1, 2].map(s => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all ${s === step ? 'w-8 bg-teal-500' : s < step ? 'w-4 bg-teal-300' : 'w-4 bg-gray-200'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Fundraiser title</label>
                  <p className="text-xs text-gray-400 mb-2">One clear sentence — like a headline.</p>
                  <input
                    type="text"
                    placeholder="Help Nomvula pay for cancer treatment"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    required
                    maxLength={120}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Short description</label>
                  <p className="text-xs text-gray-400 mb-2">One sentence shown on campaign cards.</p>
                  <input
                    type="text"
                    placeholder="A brief summary of what this campaign is for"
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    required
                    maxLength={200}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Category</label>
                  <p className="text-xs text-gray-400 mb-2">Choose the one that fits best.</p>
                  <select
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent appearance-none"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Goal amount (ZAR)</label>
                  <p className="text-xs text-gray-400 mb-2">Set a realistic, specific goal.</p>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">R</span>
                    <input
                      type="number"
                      placeholder="5 000"
                      min="100"
                      value={form.goal_amount}
                      onChange={e => set('goal_amount', e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">End date</label>
                  <p className="text-xs text-gray-400 mb-2">30–90 days works best.</p>
                  <input
                    type="date"
                    min={minDeadline}
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Your story</label>
                  <p className="text-xs text-gray-400 mb-2">Who is this for? What&apos;s happened? What will the money do?</p>
                  <textarea
                    placeholder="Share what's happening in your own words — friends respond to real stories."
                    value={form.story}
                    onChange={e => set('story', e.target.value)}
                    required
                    rows={6}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
                  />
                  {form.story.length > 0 && form.story.length < 50 && (
                    <p className="text-xs text-gray-400 mt-1">{50 - form.story.length} more characters needed</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Campaign photo</label>
                  <p className="text-xs text-gray-400 mb-2">Campaigns with photos raise 2× more.</p>
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview(null) }}
                        className="text-xs text-gray-400 hover:text-gray-700"
                      >
                        Remove photo
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer py-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
                      <span className="text-2xl">📷</span>
                      <span className="text-sm text-gray-500">Click to upload a photo</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-sm text-red-600">{error}</div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 mb-4">
                By continuing you agree to our{' '}
                <a href="/terms" className="underline hover:text-gray-700">friendly-but-real terms</a>.
              </p>

              <div className="flex items-center justify-between gap-3">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError('') }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => { if (canProceed()) setStep(2) }}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !canProceed()}
                    className="flex items-center gap-2 bg-gray-900 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Launching...</>
                    ) : (
                      <>Save draft <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
