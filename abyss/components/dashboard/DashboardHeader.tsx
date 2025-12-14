'use client'

import { useAuth } from '@/components/AuthContext'

export default function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="md:hidden sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-900 z-40 px-6 py-4">
      <div className="flex justify-between items-center">
        <span className="text-xl font-light">abyss</span>
        <span className="text-sm text-gray-600">
          {user?.email?.split('@')[0]}
        </span>
      </div>
    </header>
  )
}
