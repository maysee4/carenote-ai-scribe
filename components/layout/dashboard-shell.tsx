'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export function DashboardShell({ children, isOrgOwner = false }: { children: React.ReactNode; isOrgOwner?: boolean }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar isOrgOwner={isOrgOwner} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar drawer */}
            <motion.div
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 md:hidden"
            >
              <Sidebar isOrgOwner={isOrgOwner} onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background min-w-0">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background border-b border-border md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center h-10 w-10 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold text-foreground">CareNote<span className="text-[hsl(173,80%,30%)]">.</span></span>
        </div>
        {children}
      </main>
    </div>
  )
}
