import Link from 'next/link'
import { Brain } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(173,80%,30%)]">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-gray-800">CareNote AI</span>
        </Link>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} CareNote AI. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/login" className="text-xs text-gray-500 hover:text-gray-800">Login</Link>
          <Link href="/signup" className="text-xs text-gray-500 hover:text-gray-800">Sign up</Link>
        </div>
      </div>
    </footer>
  )
}
