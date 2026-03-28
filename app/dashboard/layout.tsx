'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import MobileNav from '@/components/dashboard/MobileNav'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Easter egg state
  const [logoClicks, setLogoClicks] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Easter egg click handler
  const handleEasterEggClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const now = Date.now()
    
    // Reset if more than 2 seconds between clicks
    if (now - lastClickTime > 2000) {
      setLogoClicks(1)
    } else {
      const newCount = logoClicks + 1
      setLogoClicks(newCount)
      
      // Trigger on 5 clicks
      if (newCount === 5) {
        router.push('/dashboard/dev-chat')
        setLogoClicks(0)
      }
    }
    
    setLastClickTime(now)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white flex relative">
      
      {/* Hidden Easter Egg Trigger - Now with higher z-index to stay above sidebar */}
      <div
        onClick={handleEasterEggClick}
        className="fixed top-4 md:left-[280px] left-4 w-8 h-8 opacity-0 hover:opacity-5 cursor-default z-[100] transition-opacity duration-300"
        aria-hidden="true"
        title=""
      >
        <div className="w-full h-full rounded-full bg-zinc-700" />
      </div>
      
      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Mobile Header */}
        <DashboardHeader />

        {/* Page Content */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <MobileNav />
      </div>

    </div>
  )
}
