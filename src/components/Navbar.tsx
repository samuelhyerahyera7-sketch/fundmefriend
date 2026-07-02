'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  user: { id: string; email?: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png.png" alt="FundMeFriend" width={360} height={120} className="h-24 w-auto object-contain" unoptimized />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/campaigns" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Browse fundraisers
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Sign in
              </Link>
            )}
            <Link href="/create">
              <span className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors inline-block">
                Start a fundraiser
              </span>
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/create">
              <span className="bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full inline-block">
                Start a fundraiser
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-gray-600"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/campaigns" className="block text-gray-700 py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
            Browse fundraisers
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-gray-700 py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="block text-gray-700 py-2 w-full text-left">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-700 py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
              <Link href="/register" className="block text-gray-700 py-2" onClick={() => setMenuOpen(false)}>
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
