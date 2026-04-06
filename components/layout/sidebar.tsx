'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Trash2,
  Plus,
  LogOut,
  ClipboardList,
  Building2,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/forms', icon: ClipboardList, label: 'Form Filler' },
  { href: '/clients', icon: Users, label: 'Clients' },
]

const bottomItems = [
  { href: '/deleted', icon: Trash2, label: 'Deleted' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar({ onClose, isOrgOwner = false }: { onClose?: () => void; isOrgOwner?: boolean }) {
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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white/10 shrink-0">
          <Image src="/logos/carenote.png" alt="CareNote" width={28} height={28} className="object-contain" />
        </div>
        <span className="text-[15px] font-semibold text-white flex-1">CareNote<span style={{ color: '#4db8aa' }}>.</span></span>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>

      {/* New Report button */}
      <div className="px-4 py-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
          <Link
            href="/reports/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[hsl(173,80%,30%)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[hsl(173,80%,25%)]"
          >
            <Plus className="h-4 w-4" />
            New Report
          </Link>
        </motion.div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <motion.div key={item.href} whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors',
                  active
                    ? 'bg-[hsl(215,25%,33%)] text-white'
                    : 'text-[hsl(210,20%,75%)] hover:bg-[hsl(215,25%,33%)] hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
        {isOrgOwner && (
          <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
            <Link
              href="/admin"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors',
                pathname === '/admin' || pathname.startsWith('/admin/')
                  ? 'bg-[hsl(215,25%,33%)] text-white'
                  : 'text-[hsl(210,20%,75%)] hover:bg-[hsl(215,25%,33%)] hover:text-white'
              )}
            >
              <Building2 className="h-5 w-5 shrink-0" />
              Admin
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-[hsl(215,25%,22%)] space-y-0.5">
        {bottomItems.map((item) => {
          const active = pathname === item.href
          return (
            <motion.div key={item.href} whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors',
                  active
                    ? 'bg-[hsl(215,25%,33%)] text-white'
                    : 'text-[hsl(210,20%,75%)] hover:bg-[hsl(215,25%,33%)] hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            </motion.div>
          )
        })}
        <motion.button
          onClick={handleSignOut}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.15 }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[hsl(210,20%,75%)] transition-colors hover:bg-[hsl(215,25%,33%)] hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </motion.button>
      </div>
    </aside>
  )
}
