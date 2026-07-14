const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error('Failed to authenticate with PayPal')
  const data = await res.json()
  return data.access_token
}

export async function createPayPalOrder(amountUsd: number, reference: string) {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: reference,
        amount: { currency_code: 'USD', value: amountUsd.toFixed(2) },
      }],
    }),
  })

  if (!res.ok) throw new Error('Failed to create PayPal order')
  return res.json()
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken()

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error('Failed to capture PayPal order')
  return res.json()
}
