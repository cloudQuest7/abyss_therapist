'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-400">loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white flex">
      
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
