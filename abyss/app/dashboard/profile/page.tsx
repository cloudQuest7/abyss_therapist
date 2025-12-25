'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Calendar, Download, Trash2, Bell, Shield,
  Lock, TrendingUp, BookOpen, MessageCircle, Sparkles,
  Edit2, Check, X, Loader2, Crown
} from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserStats,
  exportUserData
} from '@/lib/firebase-services'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState('anonymous')
  const [tempName, setTempName] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [dailyReminders, setDailyReminders] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [stats, setStats] = useState({
    streak: 0,
    journalCount: 0,
    chatCount: 0,
    memberSince: 'Dec 2025',
    isPremium: false
  })

  // Load all data on mount
  useEffect(() => {
    if (user) {
      loadAllData()
    }
  }, [user])

  const loadAllData = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Get profile
      const profileResult = await getUserProfile(user.uid)
      if (profileResult.success && profileResult.profile) {
        setDisplayName(profileResult.profile.displayName)
        setNotifications(profileResult.profile.notifications)
        setDailyReminders(profileResult.profile.dailyReminders)
        
        const memberDate = new Date(profileResult.profile.createdAt)
        const formattedDate = memberDate.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })
        
        setStats(prev => ({
          ...prev,
          memberSince: formattedDate,
          isPremium: profileResult.profile.isPremium
        }))
      }

      // Get stats
      const statsResult = await getUserStats(user.uid)
      if (statsResult.success) {
        setStats(prev => ({
          ...prev,
          ...statsResult.stats
        }))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartEditName = () => {
    setTempName(displayName)
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    if (!user || !tempName.trim()) return
    setSaving(true)

    const result = await updateUserProfile(user.uid, {
      displayName: tempName.trim()
    })

    if (result.success) {
      setDisplayName(tempName.trim())
      setIsEditingName(false)
    } else {
      alert('Failed to update name')
    }
    setSaving(false)
  }

  const handleCancelEditName = () => {
    setTempName('')
    setIsEditingName(false)
  }

  const handleToggleNotifications = async (value: boolean) => {
    if (!user) return
    setNotifications(value)
    await updateUserProfile(user.uid, { notifications: value })
  }

  const handleToggleDailyReminders = async (value: boolean) => {
    if (!user) return
    setDailyReminders(value)
    await updateUserProfile(user.uid, { dailyReminders: value })
  }

  const handleExportData = async () => {
    if (!user) return
    const result = await exportUserData(user.uid, user.email || '')
    if (!result.success) {
      alert('Failed to export data')
    }
  }

  const handleDeleteAccount = () => {
    if (confirm('⚠️ Are you absolutely sure?\n\nThis will permanently delete:\n• All your journal entries\n• All chat history\n• Your profile and settings\n\nThis action CANNOT be undone.')) {
      alert('Account deletion will be implemented soon. Please contact support.')
    }
  }

  // Generate gradient based on name
  const getGradientColors = (name: string) => {
    const gradients = [
      'from-red-500 via-pink-500 to-purple-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-yellow-500 via-orange-500 to-red-500',
      'from-green-500 via-teal-500 to-blue-500',
      'from-teal-500 via-cyan-500 to-blue-500',
      'from-blue-500 via-indigo-500 to-purple-500',
      'from-indigo-500 via-purple-500 to-pink-500',
      'from-purple-500 via-fuchsia-500 to-pink-500',
      'from-pink-500 via-rose-500 to-red-500',
      'from-cyan-500 via-blue-500 to-indigo-500',
    ]
    
    const charCode = name.charCodeAt(0) || 65
    const index = charCode % gradients.length
    return gradients[index]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Gradient */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-b border-zinc-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjcyNzI3IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative">
        
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-20 mb-8"
        >
          <div className="p-8 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              
              {/* Gradient Avatar */}
              <div className="relative">
                <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${getGradientColors(displayName)} border-2 border-zinc-700 flex items-center justify-center shadow-xl`}>
                  <span className="text-5xl font-light text-white drop-shadow-lg">
                    {displayName[0].toUpperCase()}
                  </span>
                </div>
                
                {/* Decorative ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
              </div>

              {/* Name & Info */}
              <div className="flex-1">
                <div className="mb-3">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-zinc-800/50 border border-zinc-700 rounded-2xl px-4 py-2.5 text-white text-xl outline-none focus:border-zinc-600 w-full md:w-auto"
                        placeholder="your name"
                        autoFocus
                        disabled={saving}
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={saving}
                        title="Save name"
                        className="p-2.5 rounded-xl bg-white text-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        disabled={saving}
                        title="Cancel editing"
                        className="p-2.5 rounded-xl bg-zinc-800 text-gray-400 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group/name">
                      <h1 className="text-2xl md:text-3xl font-light text-white">{displayName}</h1>
                      <button
                        onClick={handleStartEditName}
                        title="Edit name"
                        className="p-2 rounded-xl opacity-0 group-hover/name:opacity-100 hover:bg-zinc-800 transition-all"
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>member since {stats.memberSince}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700">
                  {stats.isPremium ? (
                    <>
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Premium Member</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-400">Free Account</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="relative group overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-4xl font-light text-white">{stats.streak}</span>
              </div>
              <p className="text-sm text-gray-400">day streak 🔥</p>
            </div>
          </div>

          <div className="relative group overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-4xl font-light text-white">{stats.journalCount}</span>
              </div>
              <p className="text-sm text-gray-400">journal entries 📖</p>
            </div>
          </div>

          <div className="relative group overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-4xl font-light text-white">{stats.chatCount}</span>
              </div>
              <p className="text-sm text-gray-400">chat sessions 💬</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800"
          >
            <h3 className="text-lg font-light mb-6 flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-gray-400" />
              preferences
            </h3>

            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
                <div>
                  <p className="text-white text-sm font-medium mb-1">notifications</p>
                  <p className="text-xs text-gray-500">gentle reminders throughout the day</p>
                </div>
                <button
                  onClick={() => handleToggleNotifications(!notifications)}
                  title="Toggle notifications"
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    notifications ? 'bg-white' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all shadow-lg ${
                      notifications ? 'translate-x-7 bg-black' : 'translate-x-1 bg-zinc-500'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
                <div>
                  <p className="text-white text-sm font-medium mb-1">daily check-in</p>
                  <p className="text-xs text-gray-500">evening journal reminder</p>
                </div>
                <button
                  onClick={() => handleToggleDailyReminders(!dailyReminders)}
                  title="Toggle daily check-in reminders"
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    dailyReminders ? 'bg-white' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 rounded-full transition-all shadow-lg ${
                      dailyReminders ? 'translate-x-7 bg-black' : 'translate-x-1 bg-zinc-500'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800"
          >
            <h3 className="text-lg font-light mb-6 flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-gray-400" />
              privacy & data
            </h3>

            <div className="space-y-3">
              <button 
                onClick={handleExportData}
                title="Export your data"
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-zinc-700/50 group-hover:bg-zinc-700 transition-colors">
                  <Download className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-white text-sm font-medium">export data</p>
                  <p className="text-xs text-gray-500">download all your content</p>
                </div>
              </button>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <Shield className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-green-400 text-sm font-medium">encrypted</p>
                  <p className="text-xs text-green-700">your data is secure</p>
                </div>
              </div>

              <button 
                onClick={handleDeleteAccount}
                title="Delete your account"
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-5 w-5 text-red-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-red-400 text-sm font-medium">delete account</p>
                  <p className="text-xs text-red-700">permanently erase everything</p>
                </div>
              </button>
            </div>
          </motion.div>

        </div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pb-12"
        >
          <button
            onClick={logout}
            className="px-8 py-3 rounded-full border border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/50 transition-all"
          >
            sign out
          </button>
        </motion.div>

      </div>
    </div>
  )
}
