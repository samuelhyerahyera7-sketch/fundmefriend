'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[85vh] flex">
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Heart className="w-8 h-8 text-green-600 fill-green-600" />
              <span className="text-xl font-bold text-gray-900">FundMeFriend</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to manage your campaigns and donations</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-bold" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...</> : 'Sign in'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-green-600 font-semibold hover:underline">Create one — it&apos;s free</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: visual (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-emerald-500 items-center justify-center p-12">
        <div className="text-white max-w-sm text-center">
          <Heart className="w-16 h-16 fill-white mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-extrabold mb-4">Help someone today</h2>
          <p className="text-green-100 text-lg leading-relaxed">
            South Africa&apos;s trusted crowdfunding platform. Zero fees. Instant EFT. Real impact.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              '💸 Zero platform fees — 100% goes to campaigns',
              '⚡ Instant EFT via Ozow',
              '📱 Share on WhatsApp in one tap',
              '🔒 Secure and trusted',
            ].map(t => (
              <p key={t} className="text-sm text-green-100">{t}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
