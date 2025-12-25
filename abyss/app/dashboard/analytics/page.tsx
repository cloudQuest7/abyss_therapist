'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, Flame, Heart, BookOpen, Sparkles, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Link from 'next/link'
import { HexagonBackground } from '@/components/animate-ui/components/backgrounds/hexagon'

interface MoodEntry {
  mood: number
  date: Date
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [moodData, setMoodData] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    averageMood: 0,
    bestMood: 0,
    totalChats: 0
  })

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return

      try {
        // Load journal entries
        const journalRef = collection(db, 'users', user.uid, 'journals')
        const q = query(journalRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)

        const entries: MoodEntry[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.mood) {
            entries.push({
              mood: data.mood,
              date: data.createdAt?.toDate() || new Date()
            })
          }
        })

        setMoodData(entries)

        // Calculate stats
        const totalEntries = entries.length
        const averageMood = entries.length > 0 
          ? entries.reduce((sum, e) => sum + e.mood, 0) / entries.length 
          : 0
        const bestMood = entries.length > 0 
          ? Math.max(...entries.map(e => e.mood)) 
          : 0

        // Calculate streak
        const streak = calculateStreak(entries)

        setStats({
          totalEntries,
          currentStreak: streak,
          averageMood: parseFloat(averageMood.toFixed(1)),
          bestMood,
          totalChats: 0 // Can add chat count later
        })

      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadAnalytics()
    }
  }, [user])

  const calculateStreak = (entries: MoodEntry[]): number => {
    if (entries.length === 0) return 0

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime())
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date)
      entryDate.setHours(0, 0, 0, 0)
      
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😭', '😔', '😐', '🙂', '😊']
    return emojis[mood - 1] || '😐'
  }

  const getMoodColor = (mood: number) => {
    const colors = [
      'from-red-500/20 to-red-600/20',
      'from-orange-500/20 to-orange-600/20',
      'from-yellow-500/20 to-yellow-600/20',
      'from-emerald-500/20 to-emerald-600/20',
      'from-green-500/20 to-green-600/20',
    ]
    return colors[mood - 1] || colors[2]
  }

  const last7Days = moodData.slice(0, 7).reverse()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-500">loading your insights...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <HexagonBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 py-6 pb-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">back to dashboard</span>
            </Link>
            
            <h1 className="text-4xl sm:text-5xl font-light text-white mb-2">
              your journey
            </h1>
            <p className="text-gray-500 text-lg">
              see how far you have come
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
            >
              <BookOpen className="w-6 h-6 text-purple-400 mb-3" />
              <h3 className="text-3xl font-light text-white mb-1">
                {stats.totalEntries}
              </h3>
              <p className="text-gray-500 text-sm">journal entries</p>
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
            >
              <Flame className="w-6 h-6 text-orange-400 mb-3" />
              <h3 className="text-3xl font-light text-white mb-1">
                {stats.currentStreak}
              </h3>
              <p className="text-gray-500 text-sm">day streak 🔥</p>
            </motion.div>

            {/* Average Mood */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
            >
              <Heart className="w-6 h-6 text-pink-400 mb-3" />
              <h3 className="text-3xl font-light text-white mb-1">
                {stats.averageMood > 0 ? stats.averageMood : '—'}
              </h3>
              <p className="text-gray-500 text-sm">average mood</p>
            </motion.div>

            {/* Best Mood */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
            >
              <Sparkles className="w-6 h-6 text-yellow-400 mb-3" />
              <h3 className="text-3xl font-light text-white mb-1">
                {stats.bestMood > 0 ? getMoodEmoji(stats.bestMood) : '—'}
              </h3>
              <p className="text-gray-500 text-sm">best day</p>
            </motion.div>
          </div>

          {/* Mood Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-xl font-light text-white">mood trend</h2>
                <p className="text-gray-500 text-sm">last 7 days</p>
              </div>
            </div>

            {last7Days.length > 0 ? (
              <>
                {/* Graph */}
                <div className="flex items-end justify-between gap-2 h-48 mb-6">
                  {last7Days.map((entry, i) => {
                    const height = (entry.mood / 5) * 100
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                        className="flex-1 relative group"
                      >
                        <div className={`w-full h-full bg-gradient-to-t ${getMoodColor(entry.mood)} rounded-t-lg border border-white/10`}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black border border-white/20 rounded-lg px-2 py-1 text-xs text-white whitespace-nowrap">
                              {getMoodEmoji(entry.mood)} {entry.mood}/5
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Days Labels */}
                <div className="flex justify-between text-xs text-gray-600">
                  {last7Days.map((entry, i) => (
                    <span key={i} className="flex-1 text-center">
                      {entry.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">no mood data yet</p>
                <p className="text-gray-700 text-sm mt-2">start journaling to see your trends</p>
              </div>
            )}
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-light text-white">recent check-ins</h2>
                <p className="text-gray-500 text-sm">your latest moods</p>
              </div>
            </div>

            {moodData.length > 0 ? (
              <div className="space-y-3">
                {moodData.slice(0, 5).map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="text-white font-light">
                          {entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {entry.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-lg">{entry.mood}/5</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">no entries yet</p>
                <Link href="/dashboard/journal" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
                  start journaling →
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
