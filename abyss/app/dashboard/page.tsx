'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/components/AuthContext'

export default function DashboardHome() {
  const { user } = useAuth()
  const [moodValue, setMoodValue] = useState(50)

  const getMoodText = (value: number) => {
    if (value < 33) return 'rough'
    if (value < 66) return 'okay'
    return 'good'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">
      
      {/* Greeting */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 md:mb-20"
      >
        <h1 className="text-2xl md:text-3xl font-light mb-2">
          hey, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-sm text-gray-600">
          how are you today?
        </p>
      </motion.section>

      {/* Mood Slider */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12 md:mb-20"
      >
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 md:p-12">
          <p className="text-lg md:text-xl mb-8 text-center">
            how are you feeling?
          </p>
          
          <input 
            type="range" 
            min="0" 
            max="100"
            value={moodValue}
            onChange={(e) => setMoodValue(Number(e.target.value))}
            title="mood slider"
            aria-label="mood slider"
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
              [&::-moz-range-thumb]:border-0"
          />
          
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            <span>rough</span>
            <span className="text-gray-400">{getMoodText(moodValue)}</span>
            <span>good</span>
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-sm text-gray-600 mb-4">quick actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <Link href="/dashboard/crisis">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <p className="text-base mb-1">need help now</p>
              <p className="text-xs text-gray-600">crisis support</p>
            </div>
          </Link>

          <Link href="/dashboard/chat">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <p className="text-base mb-1">want to talk</p>
              <p className="text-xs text-gray-600">ai companion</p>
            </div>
          </Link>

          <Link href="/dashboard/journal">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <p className="text-base mb-1">journal</p>
              <p className="text-xs text-gray-600">write your thoughts</p>
            </div>
          </Link>

          <Link href="/dashboard/voice">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <p className="text-base mb-1">voice check-in</p>
              <p className="text-xs text-gray-600">speak your mind</p>
            </div>
          </Link>

        </div>
      </motion.section>

    </div>
  )
}
