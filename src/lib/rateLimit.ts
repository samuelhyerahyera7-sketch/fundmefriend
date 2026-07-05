// In-memory fixed-window rate limiter. Good enough to blunt casual abuse on a
// single-instance deployment; state resets on redeploy/restart and isn't
// shared across instances. If you scale to multiple instances, swap this for
// a shared store (e.g. Upstash Redis).
const hits = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = hits.get(key)

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count += 1
  return true
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}
