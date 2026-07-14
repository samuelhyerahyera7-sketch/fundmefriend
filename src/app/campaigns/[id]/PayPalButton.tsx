'use client'

import { useEffect, useRef, useState } from 'react'

interface PayPalButtonsInstance {
  render: (el: HTMLElement) => void
}
interface PayPalButtonsOptions {
  style?: Record<string, string>
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }) => Promise<void>
  onError?: (err: unknown) => void
}
interface PayPalNamespace {
  Buttons: (opts: PayPalButtonsOptions) => PayPalButtonsInstance
}
declare global {
  interface Window { paypal?: PayPalNamespace }
}

interface Props {
  campaignId: string
  amount: number
  message: string
  isAnonymous: boolean
  donorId: string | null
  onSuccess: () => void
}

export default function PayPalButton({ campaignId, amount, message, isAnonymous, donorId, onSuccess }: Props) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(clientId ? '' : 'PayPal is not set up for this site yet.')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!clientId) return

    let cancelled = false

    function render() {
      if (cancelled || !window.paypal || !containerRef.current) return
      containerRef.current.innerHTML = ''
      window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
        createOrder: async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignId, amount, message, isAnonymous, donorId }),
          })
          const data = await res.json()
          if (!res.ok) { setError(data.error ?? 'Could not start PayPal checkout'); throw new Error(data.error) }
          return data.orderID
        },
        onApprove: async (data) => {
          const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID }),
          })
          if (!res.ok) {
            const d = await res.json().catch(() => ({}))
            setError(d.error ?? 'Payment could not be completed')
            return
          }
          onSuccess()
        },
        onError: () => setError('Something went wrong with PayPal. Please try again.'),
      }).render(containerRef.current)
      setReady(true)
    }

    if (window.paypal) {
      render()
    } else {
      const existing = document.getElementById('paypal-sdk') as HTMLScriptElement | null
      if (existing) {
        existing.addEventListener('load', render)
      } else {
        const script = document.createElement('script')
        script.id = 'paypal-sdk'
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
        script.onload = render
        script.onerror = () => setError('Could not load PayPal.')
        document.body.appendChild(script)
      }
    }

    return () => { cancelled = true }
  }, [campaignId, amount, message, isAnonymous, donorId, onSuccess, clientId])

  return (
    <div>
      <div ref={containerRef} />
      {!ready && !error && <p className="text-xs text-gray-400 text-center py-2">Loading PayPal…</p>}
      {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">{error}</p>}
    </div>
  )
}
