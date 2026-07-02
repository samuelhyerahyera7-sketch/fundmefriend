'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Check your email!</h1>
          <p className="text-gray-500 mb-1">We sent a confirmation link to</p>
          <p className="font-semibold text-gray-800 mb-6">{email}</p>
          <p className="text-sm text-gray-400 mb-8">Click the link to activate your account, then come back to start fundraising.</p>
          <Link href="/login">
            <Button className="bg-green-600 hover:bg-green-700">Back to sign in</Button>
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
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Heart className="w-8 h-8 text-green-600 fill-green-600" />
              <span className="text-xl font-bold text-gray-900">FundMeFriend</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Join FundMeFriend — it&apos;s completely free</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                <Input
                  placeholder="Nomvula Dlamini"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</div>
              )}
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 font-bold" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account...</> : 'Create free account'}
              </Button>
              <p className="text-center text-xs text-gray-400">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="underline hover:text-green-600">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-green-600">Privacy Policy</Link>.
              </p>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 to-emerald-500 items-center justify-center p-12">
        <div className="text-white max-w-sm text-center">
          <Heart className="w-16 h-16 fill-white mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-extrabold mb-4">Start your campaign today</h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            It takes under 5 minutes. Zero fees. Your community is ready to help.
          </p>
          {[
            { emoji: '✓', text: 'Create your campaign for free' },
            { emoji: '✓', text: 'Share on WhatsApp instantly' },
            { emoji: '✓', text: 'Receive donations via Ozow EFT' },
            { emoji: '✓', text: '100% of donations go to you' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-3 text-left mb-3">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">{t.emoji}</span>
              <p className="text-sm text-green-100">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
