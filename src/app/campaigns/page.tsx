import Link from 'next/link'
import { Search, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import CampaignCard from '@/components/CampaignCard'
import { CATEGORIES, CATEGORY_EMOJI } from '@/types'
import type { Campaign } from '@/types'

interface Props {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>
}

export default async function CampaignsPage({ searchParams }: Props) {
  const { category, q, sort } = await searchParams
  const supabase = await createClient()
  const now = new Date().toISOString()
  const sevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  let query = supabase
    .from('campaigns')
    .select('*, profiles(full_name, avatar_url)')
    .eq('status', 'active')

  if (category) query = query.eq('category', category)
  if (q) query = query.ilike('title', `%${q}%`)

  if (sort === 'funded') {
    query = query.order('raised_amount', { ascending: false })
  } else if (sort === 'urgent') {
    query = query.lt('deadline', sevenDays).gt('deadline', now).order('deadline', { ascending: true })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data: campaigns } = await query

  const hasFilters = !!(category || q || sort)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse campaigns</h1>
        <p className="text-gray-500 text-sm">
          {campaigns?.length ?? 0} campaign{(campaigns?.length ?? 0) !== 1 ? 's' : ''}
          {category ? ` in ${category}` : ''}
          {q ? ` matching "${q}"` : ''}
        </p>
      </div>

      {/* Search bar */}
      <form method="GET" className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search campaigns..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {category && <input type="hidden" name="category" value={category} />}
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            name="sort"
            defaultValue={sort ?? ''}
            className="h-10 pl-9 pr-8 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          >
            <option value="">Newest first</option>
            <option value="funded">Most funded</option>
            <option value="urgent">Ending soon</option>
          </select>
        </div>
        <button type="submit" className="h-10 px-5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
          Search
        </button>
        {hasFilters && (
          <Link href="/campaigns" className="h-10 px-4 border border-gray-300 rounded-lg text-sm font-medium flex items-center hover:bg-gray-50 text-gray-600 transition-colors">
            Clear
          </Link>
        )}
      </form>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <Link
          href={q ? `/campaigns?q=${q}` : '/campaigns'}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            !category
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700'
          }`}
        >
          All
        </Link>
        {CATEGORIES.map(cat => {
          const emoji = CATEGORY_EMOJI[cat] ?? '✨'
          const isActive = category === cat
          return (
            <Link
              key={cat}
              href={`/campaigns?category=${encodeURIComponent(cat)}${q ? `&q=${q}` : ''}${sort ? `&sort=${sort}` : ''}`}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700'
              }`}
            >
              {emoji} {cat}
            </Link>
          )
        })}
      </div>

      {/* Results */}
      {campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(c => <CampaignCard key={c.id} campaign={c as Campaign} />)}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg font-semibold text-gray-700 mb-2">No campaigns found</p>
          <p className="text-gray-400 text-sm mb-6">
            {hasFilters ? 'Try different filters or search terms.' : 'Be the first to start a campaign!'}
          </p>
          <div className="flex gap-3 justify-center">
            {hasFilters && (
              <Link href="/campaigns" className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Clear filters
              </Link>
            )}
            <Link href="/create" className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700">
              Start a campaign
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
