'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { Home, MessageCircle, BookOpen, AlertCircle, Mic, LifeBuoy, LogOut } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { name: 'home', href: '/dashboard', icon: Home },
    { name: 'chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'crisis', href: '/dashboard/crisis', icon: AlertCircle },
    { name: 'voice', href: '/dashboard/voice', icon: Mic },
    { name: 'resources', href: '/dashboard/resources', icon: LifeBuoy },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r border-zinc-900 bg-black h-screen sticky top-0">
      
      {/* Logo */}
      <div className="p-6 border-b border-zinc-900">
        <Link href="/dashboard" className="text-2xl font-light">
          abyss
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors
                ${active 
                  ? 'bg-zinc-900 text-white' 
                  : 'text-gray-500 hover:text-white hover:bg-zinc-900/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-zinc-900">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-zinc-900/50 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>logout</span>
        </button>
      </div>

    </aside>
  )
}
