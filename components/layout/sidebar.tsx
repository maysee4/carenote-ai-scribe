'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Trash2,
  Plus,
  LogOut,
  Brain,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/clients', icon: Users, label: 'Clients' },
]

const bottomItems = [
  { href: '/deleted', icon: Trash2, label: 'Deleted' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-[hsl(215,25%,27%)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[hsl(215,25%,22%)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold text-white">CareNote AI</span>
      </div>

      {/* New Report button */}
      <div className="px-4 py-4">
        <Link
          href="/reports/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(173,80%,30%)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[hsl(173,80%,25%)]"
        >
          <Plus className="h-4 w-4" />
          New Report
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-[hsl(215,25%,33%)] text-white'
                  : 'text-[hsl(210,20%,75%)] hover:bg-[hsl(215,25%,33%)] hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-[hsl(215,25%,22%)] space-y-0.5">
        {bottomItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-[hsl(215,25%,33%)] text-white'
                  : 'text-[hsl(210,20%,75%)] hover:bg-[hsl(215,25%,33%)] hover:text-white'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[hsl(210,20%,75%)] transition-colors hover:bg-[hsl(215,25%,33%)] hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
