'use client'

import { useAuth } from '@/components/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardHome() {
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
        <div className="text-white text-xl">loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            hey, {user.email?.split('@')[0]} ✨
          </h1>
          <p className="text-gray-400 text-lg">
            how are you feeling today?
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Crisis Mode Card */}
          <Link href="/dashboard/crisis">
            <div className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-6 transition-all hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-4">💜</div>
              <h3 className="text-xl font-semibold mb-2">crisis mode</h3>
              <p className="text-sm text-gray-400">
                immediate support when you need it
              </p>
            </div>
          </Link>

          {/* Journal Card */}
          <Link href="/dashboard/journal">
            <div className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-6 transition-all hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-semibold mb-2">journal</h3>
              <p className="text-sm text-gray-400">
                write your thoughts, we listen
              </p>
            </div>
          </Link>

          {/* Voice Check-in Card */}
          <Link href="/dashboard/voice">
            <div className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl p-6 transition-all hover:scale-105 cursor-pointer group">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-xl font-semibold mb-2">voice check-in</h3>
              <p className="text-sm text-gray-400">
                let us hear how you're feeling
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Mood Tracker Preview */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">your week</h2>
          <div className="flex justify-between items-end h-32 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-lg"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4">
            you been tracking your mood consistently 🌟
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="max-w-4xl mx-auto px-6 py-8 pb-20">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">need more help?</h2>
          <div className="space-y-3">
            <Link href="/dashboard/resources" 
              className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span>helplines & resources</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
            
            <Link href="/dashboard/ai-chat" 
              className="flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <span>chat with AI support</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
