'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { SavedForm, ClientKnowledge } from '@/types'
import { toast } from 'sonner'

// ─── Saved Forms ─────────────────────────────────────────────────────────────

export function useSavedForms(clientId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['saved-forms', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_forms')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as SavedForm[]
    },
    enabled: !!clientId,
  })
}

export function useSaveForm() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (form: Omit<SavedForm, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('saved_forms')
        .insert({ ...form, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as SavedForm
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['saved-forms', data.client_id] })
      toast.success('Form saved to client!')
    },
    onError: () => toast.error('Failed to save form'),
  })
}

export function useDeleteSavedForm() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase.from('saved_forms').delete().eq('id', id)
      if (error) throw error
      return clientId
    },
    onSuccess: (clientId) => {
      qc.invalidateQueries({ queryKey: ['saved-forms', clientId] })
      toast.success('Form deleted')
    },
    onError: () => toast.error('Failed to delete form'),
  })
}

// ─── Client Knowledge ─────────────────────────────────────────────────────────

export function useClientKnowledge(clientId: string) {
  const supabase = createClient()
  return useQuery({
    queryKey: ['client-knowledge', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_knowledge')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ClientKnowledge[]
    },
    enabled: !!clientId,
  })
}

export function useAddKnowledge() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (entry: Omit<ClientKnowledge, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { data, error } = await supabase
        .from('client_knowledge')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as ClientKnowledge
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['client-knowledge', data.client_id] })
      toast.success('Note added to knowledge base')
    },
    onError: () => toast.error('Failed to add note'),
  })
}

export function useDeleteKnowledge() {
  const supabase = createClient()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, clientId }: { id: string; clientId: string }) => {
      const { error } = await supabase.from('client_knowledge').delete().eq('id', id)
      if (error) throw error
      return clientId
    },
    onSuccess: (clientId) => {
      qc.invalidateQueries({ queryKey: ['client-knowledge', clientId] })
      toast.success('Entry removed')
    },
    onError: () => toast.error('Failed to remove entry'),
  })
}
