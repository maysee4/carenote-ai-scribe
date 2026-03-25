'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Brain, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm' : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">CareNote AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started free</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 pb-4 space-y-3">
          <a href="#how-it-works" className="block text-sm text-gray-600 py-2" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#pricing" className="block text-sm text-gray-600 py-2" onClick={() => setMobileOpen(false)}>Pricing</a>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1"><Button variant="outline" className="w-full" size="sm">Sign in</Button></Link>
            <Link href="/signup" className="flex-1"><Button className="w-full" size="sm">Get started</Button></Link>
          </div>
        </div>
      )}
    </nav>
  )
}
