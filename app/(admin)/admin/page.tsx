'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Building2, Users, Activity, MapPin } from 'lucide-react'
import { useMyOrganizations, useCreateOrganization } from '@/hooks/use-organizations'
import type { Organization } from '@/types'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function CreateClinicDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const createOrg = useCreateOrganization()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await createOrg.mutateAsync({ name: name.trim(), description: description.trim() || undefined, address: address.trim() || undefined })
    setName('')
    setDescription('')
    setAddress('')
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-[hsl(215,25%,15%)]">
        <div className="border-b border-gray-100 px-6 py-5 dark:border-[hsl(215,25%,22%)]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Clinic</h2>
          <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Add a new clinic to your organisation</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
              Clinic Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sunrise Care Clinic"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the clinic..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. 123 Care St, Sydney NSW"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-[hsl(215,25%,30%)] dark:bg-[hsl(215,25%,20%)] dark:text-white"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-12 rounded-xl border border-gray-200 bg-white text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-[hsl(215,25%,30%)] dark:bg-transparent dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createOrg.isPending || !name.trim()}
              className="flex-1 min-h-12 rounded-xl bg-[hsl(173,80%,30%)] text-base font-semibold text-white transition-colors hover:bg-[hsl(173,80%,25%)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrg.isPending ? 'Creating...' : 'Create Clinic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ClinicCard({ org }: { org: Organization }) {
  return (
    <Link href={`/admin/${org.id}`}>
      <div className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-[hsl(173,80%,40%)] cursor-pointer dark:border-[hsl(215,25%,25%)] dark:bg-[hsl(215,25%,18%)] dark:hover:border-[hsl(173,80%,35%)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(173,80%,95%)] text-[hsl(173,80%,30%)] shrink-0 dark:bg-[hsl(173,80%,15%)] dark:text-[hsl(173,80%,50%)]">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-[hsl(173,80%,30%)] transition-colors truncate dark:text-white dark:group-hover:text-[hsl(173,80%,50%)]">
              {org.name}
            </h3>
            {org.description && (
              <p className="mt-1 text-base text-gray-500 line-clamp-2 dark:text-gray-400">{org.description}</p>
            )}
            {org.address && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{org.address}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 dark:border-[hsl(215,25%,22%)]">
          <span className="text-sm text-gray-400 dark:text-gray-500">Created {formatDate(org.created_at)}</span>
          <span className="text-sm font-semibold text-[hsl(173,80%,30%)] dark:text-[hsl(173,80%,50%)]">
            Manage →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function AdminPage() {
  const [showCreate, setShowCreate] = useState(false)
  const { data: orgs, isLoading } = useMyOrganizations()

  return (
    <div className="min-h-full bg-gray-50 dark:bg-[hsl(215,25%,12%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
              Manage your clinics, staff, and track team activity
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 min-h-12 rounded-xl bg-amber-500 px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            <Plus className="h-5 w-5" />
            Create Clinic
          </button>
        </div>

        {/* Stats bar */}
        {orgs && orgs.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white border border-gray-100 p-5 dark:bg-[hsl(215,25%,18%)] dark:border-[hsl(215,25%,25%)]">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-[hsl(173,80%,30%)]" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{orgs.length}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Clinics</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-white border border-gray-100 p-5 dark:bg-[hsl(215,25%,18%)] dark:border-[hsl(215,25%,25%)]">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Live</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Activity Feed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clinic grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse dark:bg-[hsl(215,25%,20%)]" />
            ))}
          </div>
        ) : orgs && orgs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orgs.map(org => (
              <ClinicCard key={org.id} org={org} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[hsl(173,80%,95%)] dark:bg-[hsl(173,80%,10%)]">
              <Building2 className="h-12 w-12 text-[hsl(173,80%,30%)]" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">No clinics yet</h2>
            <p className="mt-2 max-w-sm text-base text-gray-500 dark:text-gray-400">
              Create your first clinic to start managing your staff and tracking their activity.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 min-h-12 rounded-xl bg-amber-500 px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
            >
              <Plus className="h-5 w-5" />
              Create Your First Clinic
            </button>
          </div>
        )}
      </div>

      <CreateClinicDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  )
}
