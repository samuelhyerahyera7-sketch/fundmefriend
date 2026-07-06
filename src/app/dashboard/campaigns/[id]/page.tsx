'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Download, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ShareButtons from '@/components/ShareButtons'
import { formatCurrency, getProgressPercent, formatDate, getDaysLeft } from '@/lib/utils'
import type { Campaign, Donation, CampaignUpdate } from '@/types'

export default function ManageCampaignPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
  const [updates, setUpdates] = useState<CampaignUpdate[]>([])
  const [updateTitle, setUpdateTitle] = useState('')
  const [updateContent, setUpdateContent] = useState('')
  const [postingUpdate, setPostingUpdate] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('campaigns').select('*').eq('id', id).single(),
      supabase.from('donations').select('*, profiles(full_name)').eq('campaign_id', id).eq('payment_status', 'complete').order('created_at', { ascending: false }),
      supabase.from('campaign_updates').select('*').eq('campaign_id', id).order('created_at', { ascending: false }),
    ]).then(([{ data: c }, { data: d }, { data: u }]) => {
      if (c) setCampaign(c as Campaign)
      if (d) setDonations(d as Donation[])
      if (u) setUpdates(u as CampaignUpdate[])
    })
  }, [id])

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPostingUpdate(true)
    setError('')
    const supabase = createClient()
    const { data: newUpdate, error: err } = await supabase
      .from('campaign_updates')
      .insert({ campaign_id: id, title: updateTitle, content: updateContent })
      .select()
      .single()
    if (err) { setError(err.message) }
    else {
      setSuccessMsg('Update posted! Donors can see it on your campaign page.')
      setUpdateTitle('')
      setUpdateContent('')
      if (newUpdate) setUpdates(u => [newUpdate as CampaignUpdate, ...u])
    }
    setPostingUpdate(false)
  }

  async function cancelCampaign() {
    if (!confirm('Cancel this campaign? Donors will no longer be able to donate. This cannot be undone.')) return
    setCancelling(true)
    const supabase = createClient()
    await supabase.from('campaigns').update({ status: 'cancelled' }).eq('id', id)
    router.push('/dashboard')
  }

  function downloadCSV() {
    const headers = ['Name', 'Amount (ZAR)', 'Message', 'Date', 'Anonymous']
    const rows = donations.map(d => [
      d.is_anonymous ? 'Anonymous' : (d.profiles?.full_name ?? 'Friend'),
      d.amount,
      d.message ?? '',
      formatDate(d.created_at),
      d.is_anonymous ? 'Yes' : 'No',
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${campaign?.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() ?? id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!campaign) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="w-10 h-10 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400">Loading campaign...</p>
      </div>
    )
  }

  const percent = getProgressPercent(campaign.raised_amount, campaign.goal_amount)
  const daysLeft = getDaysLeft(campaign.deadline)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-green-600 hover:underline mb-2 block">Dashboard</Link>
          <h1 className="text-xl font-extrabold text-gray-900 leading-tight">{campaign.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm">
            <span className={`flex items-center gap-1.5 font-semibold ${campaign.status === 'active' ? 'text-green-600' : campaign.status === 'pending_review' ? 'text-amber-600' : 'text-gray-400'}`}>
              {campaign.status === 'active' ? <><span className="w-2 h-2 rounded-full bg-green-600" /> Active</>
                : campaign.status === 'pending_review' ? <><span className="w-2 h-2 rounded-full bg-amber-600" /> Under review</>
                : campaign.status === 'completed' ? <><CheckCircle2 className="w-4 h-4" /> Completed</>
                : <><XCircle className="w-4 h-4" /> Cancelled</>}
            </span>
            {daysLeft > 0 && campaign.status === 'active' && (
              <span className="text-gray-400">{daysLeft} days remaining</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Started {formatDate(campaign.created_at)}</p>
        </div>
        <Link
          href={`/campaigns/${id}`}
          target="_blank"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition-colors border border-gray-200 rounded-lg px-3 py-1.5 hover:border-green-300"
        >
          <ExternalLink className="w-4 h-4" /> View public page
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-3 gap-6 mb-5">
          <div>
            <p className="text-2xl font-extrabold text-green-600">{formatCurrency(campaign.raised_amount)}</p>
            <p className="text-xs text-gray-500">Raised</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{percent}%</p>
            <p className="text-xs text-gray-500">of {formatCurrency(campaign.goal_amount)}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900">{donations.length}</p>
            <p className="text-xs text-gray-500">Donors</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* Share */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Share your campaign</h2>
        <p className="text-sm text-gray-500 mb-4">Campaigns shared on WhatsApp raise 3× more. Send it to friends and family!</p>
        <ShareButtons title={campaign.title} campaignId={id} />
      </div>

      {/* Donors */}
      {donations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Donations ({donations.length})</h2>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-green-300 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {donations.map(d => (
              <div key={d.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {d.is_anonymous ? '?' : (d.profiles?.full_name?.[0] ?? 'F')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{d.is_anonymous ? 'Anonymous' : (d.profiles?.full_name ?? 'Friend')}</p>
                    <p className="text-xs text-gray-400">{formatDate(d.created_at)}</p>
                    {d.message && <p className="text-xs text-gray-500 italic truncate">&ldquo;{d.message}&rdquo;</p>}
                  </div>
                </div>
                <span className="font-bold text-green-600 text-sm shrink-0 ml-3">{formatCurrency(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post update */}
      {campaign.status === 'active' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-1">Post an update</h2>
          <p className="text-sm text-gray-500 mb-4">Keep your donors informed — they care about your progress!</p>
          <form onSubmit={postUpdate} className="space-y-3">
            <Input
              placeholder="Update title (e.g. Treatment has started!)"
              value={updateTitle}
              onChange={e => setUpdateTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Share what's happening and how their support is helping..."
              value={updateContent}
              onChange={e => setUpdateContent(e.target.value)}
              required
              className="min-h-[100px]"
            />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {successMsg && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">{successMsg}</p>}
            <Button type="submit" size="sm" disabled={postingUpdate} className="bg-green-600 hover:bg-green-700">
              {postingUpdate ? 'Posting...' : 'Post update'}
            </Button>
          </form>
        </div>
      )}

      {/* Past updates */}
      {updates.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Past updates</h2>
          <div className="space-y-4">
            {updates.map(u => (
              <div key={u.id} className="border-l-2 border-green-300 pl-4">
                <p className="text-sm font-semibold text-gray-900">{u.title}</p>
                <p className="text-xs text-gray-400 mb-1">{formatDate(u.created_at)}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{u.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger zone */}
      {campaign.status === 'active' && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <h2 className="font-bold text-red-800 mb-1">Cancel campaign</h2>
          <p className="text-sm text-red-600 mb-4">This will stop new donations and cannot be undone.</p>
          <Button variant="destructive" size="sm" onClick={cancelCampaign} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Cancel campaign'}
          </Button>
        </div>
      )}
    </div>
  )
}
