'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Organization, OrganizationMember, ActivityLog } from '@/types'
import { toast } from 'sonner'

// ─── My Organizations ────────────────────────────────────────────────────────

export function useMyOrganizations() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['organizations', 'mine'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Organization[]
    },
  })
}

// ─── Single Organization ─────────────────────────────────────────────────────

export function useOrganization(id: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Organization
    },
    enabled: !!id,
  })
}

// ─── Create Organization ──────────────────────────────────────────────────────

export function useCreateOrganization() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (org: { name: string; description?: string; address?: string }) => {
      const res = await fetch('/api/admin/create-org', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(org),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create clinic')
      }
      return res.json() as Promise<Organization>
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations', 'mine'] })
      toast.success('Clinic created!')
    },
    onError: (e: Error) => toast.error(e.message || 'Failed to create clinic'),
  })
}

// ─── Org Members ──────────────────────────────────────────────────────────────

export function useOrgMembers(orgId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as OrganizationMember[]
    },
    enabled: !!orgId,
  })
}

// ─── Remove Member ────────────────────────────────────────────────────────────

export function useRemoveMember(orgId: string) {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['org-members', orgId] })
      toast.success('Staff member removed')
    },
    onError: () => toast.error('Failed to remove staff member'),
  })
}

// ─── Activity Logs ────────────────────────────────────────────────────────────

export function useActivityLogs(orgId: string, limit = 50) {
  const supabase = createClient()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: ['activity-logs', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data as ActivityLog[]
    },
    enabled: !!orgId,
  })

  // Realtime subscription
  useEffect(() => {
    if (!orgId) return

    const channel = supabase
      .channel(`activity-logs-${orgId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `organization_id=eq.${orgId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ['activity-logs', orgId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId, supabase, qc])

  return query
}

// ─── Log Activity (mutation) ──────────────────────────────────────────────────

export function useLogActivity() {
  const supabase = createClient()
  return useMutation({
    mutationFn: async ({ action, details }: { action: string; details: Record<string, any> }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id, full_name')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!membership) throw new Error('Not a member of any organization')

      const { error } = await supabase.from('activity_logs').insert({
        organization_id: membership.organization_id,
        user_id: user.id,
        user_name: membership.full_name,
        action,
        details,
      })
      if (error) throw error
    },
  })
}

// ─── Is Org Owner ────────────────────────────────────────────────────────────

export function useIsOrgOwner() {
  const supabase = createClient()
  const { data } = useQuery({
    queryKey: ['is-org-owner'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false
      const { data, error } = await supabase
        .from('organizations')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1)
      if (error) {
        console.warn('useIsOrgOwner error:', error.message)
        return false
      }
      return (data?.length ?? 0) > 0
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  })
  return data ?? false
}
