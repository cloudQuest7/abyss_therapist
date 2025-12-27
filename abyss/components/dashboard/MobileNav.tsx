'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, BookOpen, AlertCircle, Menu, X, Users,User, LogOut, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { logout, user } = useAuth()

  const mainNavItems = [
    { name: 'home', href: '/dashboard', icon: Home },
    { name: 'chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'journal', href: '/dashboard/journal', icon: BookOpen },
    { name: 'community', href: '/dashboard/community', icon: Users },
    { name: 'crisis', href: '/dashboard/crisis', icon: AlertCircle },
  ]

  const menuItems = [
    { name: 'profile', href: '/dashboard/profile', icon: User, description: 'manage your account' },
    { name: 'analytics', href: '/dashboard/analytics', icon: Sparkles, description: 'view your progress' },
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-zinc-900 z-40">
        <div className="flex justify-around items-center px-2 py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
              >
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <Icon className={`w-5 h-5 relative z-10 transition-colors ${
                  active ? 'text-white' : 'text-gray-600'
                }`} />
                <span className={`text-xs relative z-10 transition-colors ${
                  active ? 'text-white' : 'text-gray-600'
                }`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-zinc-950 border-l border-zinc-900 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-900/50">
                <div>
                  <h2 className="text-xl font-light text-white mb-1">menu</h2>
                  <p className="text-xs text-gray-600">manage your account</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-zinc-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-light">{user?.displayName || 'user'}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-center gap-4 px-4 py-4 rounded-xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-all">
                          <Icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-light">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Logout Button */}
              <div className="p-6 border-t border-zinc-900/50">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all group"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-light">logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
