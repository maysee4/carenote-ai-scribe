'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Users, Activity, Shield, HeartPulse, UserCheck, Trash2 } from 'lucide-react'
import { useOrganization, useOrgMembers, useActivityLogs, useRemoveMember } from '@/hooks/use-organizations'
import type { OrganizationMember, ActivityLog } from '@/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatActivity(log: ActivityLog): string {
  switch (log.action) {
    case 'form_filled':
      return `filled a ${log.details.form_name ?? 'form'} form for ${log.details.client_name ?? 'a client'}`
    case 'client_added':
      return `added a new client: ${log.details.client_name ?? 'unknown'}`
    case 'report_created':
      return `created a report: ${log.details.title ?? 'untitled'}`
    case 'form_saved':
      return `saved a ${log.details.form_name ?? 'form'} to ${log.details.client_name ?? "a client"}'s profile`
    default:
      return log.action.replace(/_/g, ' ')
  }
}

function roleBadge(role: OrganizationMember['role']) {
  if (role === 'nurse') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <HeartPulse className="h-3.5 w-3.5" />
        Nurse
      </span>
    )
  }
  if (role === 'support_worker') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        <UserCheck className="h-3.5 w-3.5" />
        Support Worker
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <Shield className="h-3.5 w-3.5" />
      Admin
    </span>
  )
}

// ─── Add Staff Dialog ─────────────────────────────────────────────────────────

function AddStaffDialog({
  open,
  onClose,
  orgId,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  orgId: string
  onSuccess: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'nurse' | 'support_worker'>('nurse')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ fullName: string; email: string; password: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, email, password, fullName, role }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create staff member')
      setSuccess({ fullName, email, password })
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setFullName('')
    setEmail('')
    setPassword('')
    setRole('nurse')
    setError('')
    setSuccess(null)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-[hsl(215,25%,15%)]">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-[hsl(215,25%,22%)]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Staff Member</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
            Create login credentials for a new staff member
          </p>
        </div>

        {success ? (
          <div className="px-6 py-6 space-y-4">
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
              <p className="text-base font-semibold text-green-800 dark:text-green-400 mb-3">
                Staff member created successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-500 mb-3">
                Share these credentials with {success.fullName}:
              </p>
              <div className="space-y-2 rounded-lg bg-white border border-green-100 p-3 dark:bg-[hsl(215,25%,18%)] dark:border-green-900">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</span>
                  <p className="text-base font-mono text-gray-900 dark:text-white">{success.email}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Password</span>
                  <p className="text-base font-mono text-gray-900 dark:text-white">{success.password}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full min-h-12 rounded-xl bg-[hsl(173,80%,30%)] text-base font-semibold text-white transition-colors hover:bg-[hsl(173,80%,25%)]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-base text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Jane Smith"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@clinic.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password for them"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base font-mono text-gray-900 placeholder-gray-400 placeholder:font-sans focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
                required
                minLength={6}
              />
              <p className="mt-1.5 text-sm text-gray-400">Shown in plain text so you can share it with them</p>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'nurse' | 'support_worker')}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
              >
                <option value="nurse">Nurse / RN</option>
                <option value="support_worker">Support Worker</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 min-h-12 rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[hsl(215,25%,30%)] dark:bg-transparent dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 min-h-12 rounded-xl bg-[hsl(173,80%,30%)] text-base font-semibold text-white transition-colors hover:bg-[hsl(173,80%,25%)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Add Staff Member'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Staff Card ───────────────────────────────────────────────────────────────

function StaffCard({ member, orgId }: { member: OrganizationMember; orgId: string }) {
  const remove = useRemoveMember(orgId)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-[hsl(215,25%,25%)] dark:bg-[hsl(215,25%,18%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{member.full_name}</p>
            {roleBadge(member.role)}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
        </div>
        {confirming ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setConfirming(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => remove.mutate(member.id)}
              disabled={remove.isPending}
              className="min-h-9 rounded-lg bg-red-500 px-3 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {remove.isPending ? '...' : 'Confirm'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            aria-label="Remove staff member"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

function ActivityFeed({ orgId }: { orgId: string }) {
  const { data: logs, isLoading } = useActivityLogs(orgId, 50)

  return (
    <div className="rounded-2xl border border-gray-100 bg-white dark:border-[hsl(215,25%,25%)] dark:bg-[hsl(215,25%,18%)]">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[hsl(215,25%,22%)]">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[hsl(173,80%,30%)]" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Activity Feed</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
        </div>
      </div>

      <div className="divide-y divide-gray-50 dark:divide-[hsl(215,25%,22%)]">
        {isLoading ? (
          <div className="px-5 py-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse dark:bg-[hsl(215,25%,22%)]" />
            ))}
          </div>
        ) : logs && logs.length > 0 ? (
          logs.map(log => (
            <div key={log.id} className="px-5 py-3.5 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(173,80%,95%)] text-[hsl(173,80%,30%)] dark:bg-[hsl(173,80%,10%)] dark:text-[hsl(173,80%,50%)]">
                <Activity className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base text-gray-800 dark:text-gray-200">
                  <span className="font-semibold">{log.user_name}</span>{' '}
                  {formatActivity(log)}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{timeAgo(log.created_at)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="px-5 py-10 text-center">
            <Activity className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400">No activity yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Activity will appear here as staff use the app
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClinicPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params)
  const [showAddStaff, setShowAddStaff] = useState(false)
  const { data: org, isLoading: orgLoading } = useOrganization(orgId)
  const { data: members, isLoading: membersLoading, refetch: refetchMembers } = useOrgMembers(orgId)

  if (orgLoading) {
    return (
      <div className="min-h-full bg-gray-50 dark:bg-[hsl(215,25%,12%)] flex items-center justify-center">
        <div className="text-base text-gray-500">Loading clinic...</div>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="min-h-full bg-gray-50 dark:bg-[hsl(215,25%,12%)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Clinic not found</p>
          <Link href="/admin" className="mt-3 text-base text-[hsl(173,80%,30%)] hover:underline">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[hsl(215,25%,12%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{org.name}</h1>
              {org.description && (
                <p className="mt-1 text-base text-gray-500 dark:text-gray-400">{org.description}</p>
              )}
              {org.address && (
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">{org.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT: Staff list */}
          <div className="rounded-2xl border border-gray-100 bg-white dark:border-[hsl(215,25%,25%)] dark:bg-[hsl(215,25%,18%)]">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-[hsl(215,25%,22%)]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Staff
                  {members && members.length > 0 && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-600 dark:bg-[hsl(215,25%,25%)] dark:text-gray-400">
                      {members.length}
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setShowAddStaff(true)}
                className="inline-flex items-center gap-1.5 min-h-10 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
              >
                <Plus className="h-4 w-4" />
                Add Staff
              </button>
            </div>
            <div className="p-4 space-y-3">
              {membersLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse dark:bg-[hsl(215,25%,22%)]" />
                ))
              ) : members && members.length > 0 ? (
                members.map(member => (
                  <StaffCard key={member.id} member={member} orgId={orgId} />
                ))
              ) : (
                <div className="py-10 text-center">
                  <Users className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400">No staff added yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Add nurses and support workers to get started
                  </p>
                  <button
                    onClick={() => setShowAddStaff(true)}
                    className="mt-4 inline-flex items-center gap-1.5 min-h-10 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Staff Member
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Activity feed */}
          <ActivityFeed orgId={orgId} />
        </div>
      </div>

      <AddStaffDialog
        open={showAddStaff}
        onClose={() => setShowAddStaff(false)}
        orgId={orgId}
        onSuccess={() => {
          refetchMembers()
          setShowAddStaff(false)
        }}
      />
    </div>
  )
}
