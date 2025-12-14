'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, BookOpen, AlertCircle, Menu } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'

export default function MobileNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logout } = useAuth()

  const mainNavItems = [
    { name: 'home', href: '/dashboard', icon: Home },
    { name: 'chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'crisis', href: '/dashboard/crisis', icon: AlertCircle },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-900 z-50">
        <div className="flex justify-around items-center px-4 py-3">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors
                  ${active ? 'text-white' : 'text-gray-600'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
          
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black z-50 flex flex-col">
          <div className="flex justify-between items-center p-6 border-b border-zinc-900">
            <span className="text-xl font-light">menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-6 space-y-2">
            <Link
              href="/dashboard/voice"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-gray-400 hover:text-white rounded-xl hover:bg-zinc-900/50"
            >
              voice check-in
            </Link>
            <Link
              href="/dashboard/resources"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-gray-400 hover:text-white rounded-xl hover:bg-zinc-900/50"
            >
              resources
            </Link>
          </div>

          <div className="p-6 border-t border-zinc-900">
            <button
              onClick={() => {
                logout()
                setMenuOpen(false)
              }}
              className="w-full px-4 py-3 text-left text-gray-500 hover:text-white rounded-xl hover:bg-zinc-900/50"
            >
              logout
            </button>
          </div>
        </div>
      )}
    </>
  )
}
