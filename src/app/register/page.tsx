'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Eye, EyeOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-brand-green" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#01224b] mb-2">You&apos;re in!</h1>
          <p className="text-gray-500 mb-1">We sent a confirmation link to</p>
          <p className="font-semibold text-gray-800 mb-6">{email}</p>
          <p className="text-sm text-gray-400 mb-8">Click the link in your email to activate your account, then come back to start fundraising.</p>
          <Link href="/login">
            <button className="bg-brand-green text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-green-dark transition-colors text-sm">
              Back to sign in
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo.png.png" alt="FundMeFriend" width={180} height={60} className="h-14 w-auto object-contain mx-auto" unoptimized />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#01224b] mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Join FundMeFriend — it&apos;s completely free</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                <input
                  placeholder="Nomvula Dlamini"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={8}
                    required
                    autoComplete="new-password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</span> : 'Create free account'}
              </button>
              <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="underline hover:text-brand-green">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-brand-green">Privacy Policy</Link>.
              </p>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-green font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-1 bg-[#01224b] items-center justify-center p-12">
        <div className="text-white max-w-sm text-center">
          <Image src="/logo.png.png" alt="FundMeFriend" width={200} height={70} className="h-16 w-auto object-contain mx-auto mb-8 brightness-0 invert" unoptimized />
          <h2 className="text-3xl font-extrabold mb-4">Start your campaign today</h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            It takes under 5 minutes. Zero fees. Your community is ready to help.
          </p>
          <div className="space-y-3 text-left">
            {[
              '✓ Create your campaign for free',
              '✓ Share on WhatsApp instantly',
              '✓ Receive donations directly to your bank',
              '✓ 100% of donations go to you',
            ].map(t => (
              <div key={t} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center text-xs font-bold shrink-0">✓</span>
                <p className="text-sm text-blue-100">{t.slice(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
