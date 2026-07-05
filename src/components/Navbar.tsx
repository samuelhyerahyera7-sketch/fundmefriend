'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, Search, Compass, Sparkles, LayoutDashboard, LogOut, LogIn, UserPlus, Info, ShieldCheck, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  user: { id: string; email?: string } | null
}

function MenuLink({
  href, icon, iconBg, label, onClick,
}: { href: string; icon: React.ReactNode; iconBg: string; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors"
    >
      <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </Link>
  )
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  async function handleSignOut() {
    setMenuOpen(false)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setMenuOpen(false)
    router.push(search.trim() ? `/campaigns?q=${encodeURIComponent(search.trim())}` : '/campaigns')
  }

  const close = () => setMenuOpen(false)

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
            {user && (
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
            )}
            <Link href="/create">
              <span className="bg-brand-green hover:bg-brand-green-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors inline-block">
                Start a fundraiser
              </span>
            </Link>
          </div>

          {/* Mobile trigger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/create">
              <span className="bg-brand-green hover:bg-brand-green-dark text-white text-xs font-medium px-4 py-2 rounded-full inline-block">
                Start a fundraiser
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1 text-gray-600"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col fade-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-20 border-b border-gray-100 shrink-0">
              <Image src="/logo.png.png" alt="FundMeFriend" width={220} height={72} className="h-14 w-auto object-contain" unoptimized />
              <button onClick={close} className="p-2 text-gray-500 hover:text-gray-900" aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search fundraisers..."
                  className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white"
                />
              </form>

              {/* Primary CTA */}
              <Link
                href="/create"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-brand-green hover:bg-brand-green-dark text-white font-semibold py-3.5 rounded-full text-sm mb-6 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Start a fundraiser
              </Link>

              {/* Discover */}
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Discover</p>
              <div className="mb-5">
                <MenuLink href="/campaigns" onClick={close} label="Browse fundraisers" iconBg="bg-teal-100 text-teal-600" icon={<Compass className="w-4 h-4" />} />
                <MenuLink href="/#how-it-works" onClick={close} label="How it works" iconBg="bg-blue-100 text-blue-600" icon={<Info className="w-4 h-4" />} />
              </div>

              {/* Account */}
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Account</p>
              <div className="mb-5">
                {user ? (
                  <>
                    <MenuLink href="/dashboard" onClick={close} label="Dashboard" iconBg="bg-purple-100 text-purple-600" icon={<LayoutDashboard className="w-4 h-4" />} />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors w-full text-left"
                    >
                      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-red-100 text-red-600">
                        <LogOut className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold text-gray-800">Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <MenuLink href="/login" onClick={close} label="Log in" iconBg="bg-green-100 text-green-700" icon={<LogIn className="w-4 h-4" />} />
                    <MenuLink href="/register" onClick={close} label="Create account" iconBg="bg-orange-100 text-orange-600" icon={<UserPlus className="w-4 h-4" />} />
                  </>
                )}
              </div>

              {/* Company */}
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1">Company</p>
              <div>
                <MenuLink href="/about" onClick={close} label="About" iconBg="bg-indigo-100 text-indigo-600" icon={<Info className="w-4 h-4" />} />
                <MenuLink href="/trust" onClick={close} label="Trust & safety" iconBg="bg-emerald-100 text-emerald-600" icon={<ShieldCheck className="w-4 h-4" />} />
                <MenuLink href="mailto:hello@fundmefriend.co.za" onClick={close} label="Contact" iconBg="bg-pink-100 text-pink-600" icon={<Mail className="w-4 h-4" />} />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
