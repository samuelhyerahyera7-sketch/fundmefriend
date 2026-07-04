'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirect)
      router.refresh()
    }
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
            <h1 className="text-2xl font-extrabold text-[#01224b] mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to manage your campaigns and donations</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</span> : 'Sign in'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand-green font-semibold hover:underline">Create one — it&apos;s free</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex flex-1 bg-[#01224b] items-center justify-center p-12">
        <div className="text-white max-w-sm text-center">
          <Image src="/logo.png.png" alt="FundMeFriend" width={200} height={70} className="h-16 w-auto object-contain mx-auto mb-8 brightness-0 invert" unoptimized />
          <h2 className="text-3xl font-extrabold mb-4">Help someone today</h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            South Africa&apos;s trusted crowdfunding platform. Zero fees. Real impact.
          </p>
          <div className="space-y-3 text-left">
            {[
              '💸 Zero platform fees — 100% goes to campaigns',
              '⚡ Fast EFT withdrawals to your bank',
              '📱 Share on WhatsApp in one tap',
              '🔒 Every fundraiser verified and protected',
            ].map(t => (
              <p key={t} className="text-sm text-blue-100">{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
