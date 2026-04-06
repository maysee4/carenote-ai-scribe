'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/utils'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', organization: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setForm({
        full_name: user?.user_metadata?.full_name ?? '',
        organization: user?.user_metadata?.organization ?? '',
      })
    })
  }, [])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ data: form })
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile updated')
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) return toast.error('Passwords do not match')
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password: passwords.next })
    setSaving(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated')
      setPasswords({ current: '', next: '', confirm: '' })
    }
  }

  const name = user?.user_metadata?.full_name || user?.email || 'User'

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-card p-6 mb-5">
        <h2 className="font-semibold mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-[hsl(173,80%,30%)]/10 text-[hsl(173,80%,30%)] text-lg font-semibold">
              {initials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div className="space-y-2">
              <Label>Organisation</Label>
              <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Care Co." />
            </div>
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </form>
      </div>

      <Separator className="my-5" />

      {/* Password */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" placeholder="At least 8 characters" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} minLength={8} required />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" placeholder="Repeat new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required />
          </div>
          <Button type="submit" variant="outline" disabled={saving}>{saving ? 'Updating…' : 'Update Password'}</Button>
        </form>
      </div>
    </div>
  )
}
