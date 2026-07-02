import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'FundMeFriend — Crowdfunding for South Africa',
  description: 'Raise money for what matters. Medical bills, education, emergencies & more. Zero platform fees. Instant EFT via Ozow.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {}

  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <Navbar user={user} />
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Brand */}
              <div>
                <Link href="/" className="inline-block mb-4">
                  <Image src="/logo.png.png" alt="FundMeFriend" width={160} height={56} className="h-12 w-auto object-contain" unoptimized />
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed">
                  A calmer, kinder way to raise money for the people and causes closest to you.
                </p>
              </div>

              {/* Platform */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Platform</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'Browse fundraisers', href: '/campaigns' },
                    { label: 'How it works', href: '/#how-it-works' },
                    { label: 'Start a fundraiser', href: '/create' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-3">
                  {[
                    { label: 'About', href: '/about' },
                    { label: 'Trust & safety', href: '/trust' },
                    { label: 'Contact', href: 'mailto:hello@fundmefriend.co.za' },
                  ].map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-gray-400">
                © 2026 FundMeFriend. Built with care. Made for real people, real needs.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 mr-1">Payments via</span>
                <span className="text-xs font-semibold text-white bg-[#003087] px-2.5 py-1 rounded-md">Pay<span className="text-[#009cde]">Pal</span></span>
                <span className="text-xs font-semibold text-white bg-brand-green-dark px-2.5 py-1 rounded-md">EFT</span>
                <span className="text-xs font-medium text-gray-500 border border-gray-200 px-2.5 py-1 rounded-md">Visa / MC</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
