'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { Home, MessageCircle, BookOpen, AlertCircle, LifeBuoy, LogOut, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  
  // Easter egg state
  const [logoClicks, setLogoClicks] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  const navItems = [
    { name: 'home', href: '/dashboard', icon: Home },
    { name: 'chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'crisis', href: '/dashboard/crisis', icon: AlertCircle },
    { name: 'profile', href: '/dashboard/profile', icon: LifeBuoy },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Easter egg click handler
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const now = Date.now()
    
    // Reset if more than 2 seconds between clicks
    if (now - lastClickTime > 2000) {
      setLogoClicks(1)
    } else {
      const newCount = logoClicks + 1
      setLogoClicks(newCount)
      
      // Trigger on 5 clicks
      if (newCount === 5) {
        // Navigate to secret dev chat
        router.push('/dashboard/dev-chat')
        setLogoClicks(0)
      }
    }
    
    setLastClickTime(now)
  }

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r border-zinc-900 bg-black h-screen sticky top-0">
      
      {/* Logo with Easter Egg */}
      <div className="p-6 border-b border-zinc-900">
        <div
          onClick={handleLogoClick}
          className="text-2xl font-light cursor-pointer select-none transition-opacity hover:opacity-80"
          style={{ fontFamily: 'Auralyess' }}
        >
          Abyss
        </div>
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
