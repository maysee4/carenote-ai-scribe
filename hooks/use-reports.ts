'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Report } from '@/types'
import { toast } from 'sonner'

export function useReports() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, client:clients(id, name)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Report[]
    },
  })
}

export function useReport(id: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['reports', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, client:clients(id, name, email, phone)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Report
    },
    enabled: !!id,
  })
}

export function useDeleteReport() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reports')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      toast.success('Report moved to trash')
    },
    onError: () => toast.error('Failed to delete report'),
  })
}

export function useRestoreReport() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reports')
        .update({ deleted_at: null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reports'] })
      qc.invalidateQueries({ queryKey: ['deleted-reports'] })
      toast.success('Report restored')
    },
    onError: () => toast.error('Failed to restore report'),
  })
}

export function useDeletedReports() {
  const supabase = createClient()
  return useQuery({
    queryKey: ['deleted-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*, client:clients(id, name)')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })
      if (error) throw error
      return data as Report[]
    },
  })
}

export function usePermanentlyDeleteReport() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reports').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deleted-reports'] })
      toast.success('Report permanently deleted')
    },
    onError: () => toast.error('Failed to delete report'),
  })
}
