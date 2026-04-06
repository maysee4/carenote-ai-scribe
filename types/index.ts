export interface Client {
  id: string
  user_id: string
  name: string
  email?: string | null
  phone?: string | null
  date_of_birth?: string | null
  notes?: string | null
  description?: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  user_id: string
  client_id?: string | null
  client?: Client | null
  title: string
  transcript?: string | null
  content?: string | null
  audio_url?: string | null
  status: 'draft' | 'processing' | 'complete' | 'error'
  deleted_at?: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string | null
  organization?: string | null
  role?: string | null
  avatar_url?: string | null
  created_at: string
}

export interface SavedForm {
  id: string
  user_id: string
  client_id: string
  form_id: string
  form_name: string
  form_fields: Record<string, string>
  original_prompt?: string | null
  created_at: string
}

export interface ClientKnowledge {
  id: string
  user_id: string
  client_id: string
  category: 'health' | 'medications' | 'preferences' | 'risks' | 'general'
  content: string
  source?: string | null
  created_at: string
}

export type ReportStatus = Report['status']
