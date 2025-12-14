'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardHome() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [moodValue, setMoodValue] = useState(50)

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

  const getMoodText = (value: number) => {
    if (value < 33) return 'rough'
    if (value < 66) return 'okay'
    return 'good'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-light">
            abyss
          </Link>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            leave
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6">
        
        {/* Greeting Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-16 pb-12 md:pt-24 md:pb-20"
        >
          <p className="text-xl md:text-2xl font-light text-gray-400">
            hey, {user.email?.split('@')[0]}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            you've been here for a while
          </p>
        </motion.section>

        {/* Mood Check Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-12 md:py-20"
        >
          <h2 className="text-2xl md:text-3xl font-light text-center mb-12 md:mb-16">
            how are you feeling right now?
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <input 
              type="range" 
              min="0" 
              max="100"
              value={moodValue}
              onChange={(e) => setMoodValue(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-6 text-sm text-gray-600">
              <span>rough</span>
              <span className="text-gray-400">{getMoodText(moodValue)}</span>
              <span>good</span>
            </div>
          </div>
        </motion.section>

        {/* Action Cards */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-12 md:py-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Crisis Mode */}
            <Link href="/dashboard/crisis">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 
                hover:border-zinc-700 transition-all duration-300 cursor-pointer group
                min-h-[180px] flex flex-col justify-center">
                <p className="text-base md:text-lg mb-2 group-hover:text-white transition-colors">
                  need help now
                </p>
                <p className="text-xs md:text-sm text-gray-600">crisis mode</p>
              </div>
            </Link>

            {/* AI Chat */}
            <Link href="/dashboard/chat">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 
                hover:border-zinc-700 transition-all duration-300 cursor-pointer group
                min-h-[180px] flex flex-col justify-center">
                <p className="text-base md:text-lg mb-2 group-hover:text-white transition-colors">
                  want to talk
                </p>
                <p className="text-xs md:text-sm text-gray-600">ai chat</p>
              </div>
            </Link>

            {/* Journal */}
            <Link href="/dashboard/journal">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 
                hover:border-zinc-700 transition-all duration-300 cursor-pointer group
                min-h-[180px] flex flex-col justify-center">
                <p className="text-base md:text-lg mb-2 group-hover:text-white transition-colors">
                  journal
                </p>
                <p className="text-xs md:text-sm text-gray-600">write</p>
              </div>
            </Link>

          </div>
        </motion.section>

        {/* Secondary Actions */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-12 pb-20 md:pb-32"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Voice Check-in */}
            <Link href="/dashboard/voice">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 
                hover:border-zinc-700 transition-colors cursor-pointer">
                <p className="text-sm mb-1">voice check-in</p>
                <p className="text-xs text-gray-600">record how you feel</p>
              </div>
            </Link>

            {/* Resources */}
            <Link href="/dashboard/resources">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 
                hover:border-zinc-700 transition-colors cursor-pointer">
                <p className="text-sm mb-1">resources</p>
                <p className="text-xs text-gray-600">helplines & support</p>
              </div>
            </Link>

          </div>
        </motion.section>

      </main>

    </div>
  )
}
