'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Brain, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [orgCode, setOrgCode] = useState('')
  const [codeValid, setCodeValid] = useState<null | { org_name: string }>(null)
  const [checkingCode, setCheckingCode] = useState(false)

  async function handleCodeBlur() {
    if (!orgCode.trim()) { setCodeValid(null); return }
    setCheckingCode(true)
    try {
      const res = await fetch(`/api/auth/validate-code?code=${encodeURIComponent(orgCode.trim())}`)
      const json = await res.json()
      if (json.valid) {
        setCodeValid({ org_name: json.org_name })
      } else {
        setCodeValid(null)
        toast.error('Invalid or already used organisation code')
      }
    } catch {
      setCodeValid(null)
    } finally {
      setCheckingCode(false)
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!codeValid) {
      toast.error('Please enter a valid organisation code')
      return
    }
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Claim the org code and create the organisation
    if (data.user) {
      await fetch('/api/auth/claim-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: orgCode.trim(), userId: data.user.id }),
      })
    }

    toast.success('Account created! Check your email to confirm.')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f0faf8' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: '#0a7c6d' }}
            >
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: '#0f1a1a' }}>
              CareNote<span style={{ color: '#0a7c6d' }}>.</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold" style={{ color: '#0f1a1a' }}>Create account</h1>
            <p className="text-sm mt-1" style={{ color: '#4a5568' }}>
              You&apos;ll need an organisation code to get started.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Org code first */}
            <div className="space-y-2">
              <Label htmlFor="orgCode">Organisation Code</Label>
              <div className="relative">
                <Input
                  id="orgCode"
                  type="text"
                  placeholder="e.g. 124-4QS"
                  value={orgCode}
                  onChange={(e) => { setOrgCode(e.target.value); setCodeValid(null) }}
                  onBlur={handleCodeBlur}
                  className="uppercase pr-10"
                  required
                />
                {checkingCode && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#0a7c6d]" />
                  </div>
                )}
                {codeValid && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a7c6d]" />
                )}
              </div>
              {codeValid && (
                <p className="text-sm font-medium" style={{ color: '#0a7c6d' }}>
                  {codeValid.org_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full font-semibold"
              style={{ backgroundColor: '#0a7c6d' }}
              disabled={loading || !codeValid}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm" style={{ color: '#4a5568' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: '#0a7c6d' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
