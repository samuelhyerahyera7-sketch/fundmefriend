// Approximate USD -> ZAR conversion so a PayPal donation still counts
// correctly toward a campaign's ZAR-denominated goal. Tries a live rate
// first; falls back to a fixed estimate (override via USD_TO_ZAR_RATE) if
// the lookup fails, so a donation never gets blocked by an FX API outage.
const FALLBACK_USD_TO_ZAR = Number(process.env.USD_TO_ZAR_RATE) || 18

export async function getUsdToZarRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=ZAR', {
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return FALLBACK_USD_TO_ZAR
    const data = await res.json()
    const rate = data?.rates?.ZAR
    return typeof rate === 'number' && rate > 0 ? rate : FALLBACK_USD_TO_ZAR
  } catch {
    return FALLBACK_USD_TO_ZAR
  }
}
