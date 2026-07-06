import crypto from 'crypto'

const SITE_CODE = process.env.OZOW_SITE_CODE!
const PRIVATE_KEY = process.env.OZOW_PRIVATE_KEY!

export function generateOzowHash(params: Record<string, string>) {
  const values = Object.values(params).join('').toLowerCase()
  const withKey = values + PRIVATE_KEY.toLowerCase()
  return crypto.createHash('sha512').update(withKey).digest('hex')
}

export function buildOzowPayload({
  amount,
  reference,
  campaignId,
  donorEmail,
}: {
  amount: number
  reference: string
  campaignId: string
  donorEmail: string
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

  const params: Record<string, string> = {
    SiteCode: SITE_CODE,
    CountryCode: 'ZA',
    CurrencyCode: 'ZAR',
    Amount: amount.toFixed(2),
    TransactionReference: reference,
    BankReference: `FMF-${campaignId.slice(0, 8)}`,
    Customer: donorEmail,
    CancelUrl: `${siteUrl}/donate/cancel`,
    ErrorUrl: `${siteUrl}/donate/error`,
    SuccessUrl: `${siteUrl}/donate/success?ref=${reference}`,
    NotifyUrl: `${siteUrl}/api/ozow/notify`,
    IsTest: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
  }

  const hashCheck = generateOzowHash(params)

  return { ...params, HashCheck: hashCheck }
}

export function verifyOzowNotification(body: Record<string, string>) {
  const { HashCheck, ...rest } = body
  const computed = generateOzowHash(rest)
  return computed.toLowerCase() === HashCheck?.toLowerCase()
}

export const OZOW_POST_URL = 'https://pay.ozow.com/'
