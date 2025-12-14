'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Loader2, Search, Calendar, Sparkles, Trash2, Edit2 } from 'lucide-react'
import { useAuth } from '@/components/AuthContext'
import {
  addJournalEntry,
  getUserJournals,
  updateJournalEntry,
  deleteJournalEntry,
  type JournalEntry as JournalEntryType
} from '@/lib/journal-service'

const moodEmojis = [
  { emoji: '😊', label: 'happy', value: 'happy' },
  { emoji: '😌', label: 'calm', value: 'calm' },
  { emoji: '😔', label: 'sad', value: 'sad' },
  { emoji: '😰', label: 'anxious', value: 'anxious' },
  { emoji: '😤', label: 'angry', value: 'angry' },
]

export default function JournalPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntryType[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [showAIInsight, setShowAIInsight] = useState(false)
  const [aiInsight, setAiInsight] = useState('')

  const loadEntries = async () => {
    if (!user) return
    setLoading(true)
    const result = await getUserJournals(user.uid)
    if (result.success) {
      setEntries(result.journals)
    }
    setLoading(false)
  }

  // Load entries on mount
  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  // Filter entries by search
  const filteredEntries = entries.filter(entry => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNew = () => {
    setSelectedEntry(null)
    setIsEditing(true)
    setTitle('')
    setContent('')
    setMood('')
    setShowAIInsight(false)
    setAiInsight('')
  }

  const handleSelectEntry = (entry: JournalEntryType) => {
    setSelectedEntry(entry)
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood || '')
    setIsEditing(false)
    setShowAIInsight(false)
    setAiInsight('')
  }

  const handleSave = async () => {
    if (!content.trim() || !user) return
    setIsSaving(true)

    const entryData = {
      userId: user.uid,
      title: title || 'untitled',
      content,
      mood,
      createdAt: selectedEntry?.createdAt || new Date().toISOString(),
    }

    try {
      if (selectedEntry?.id) {
        // Update existing
        await updateJournalEntry(selectedEntry.id, entryData)
      } else {
        // Create new
        await addJournalEntry(entryData)
      }

      await loadEntries() // Refresh list
      setIsEditing(false)
      
      // Select the entry we just saved/created
      if (!selectedEntry?.id) {
        // For new entries, wait a moment then select the first one
        setTimeout(() => {
          if (entries.length > 0) {
            handleSelectEntry(entries[0])
          }
        }, 500)
      }
    } catch (error) {
      console.error('Error saving journal:', error)
    }

    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!selectedEntry?.id) return
    
    if (!confirm('Delete this entry? This cannot be undone.')) return

    try {
      await deleteJournalEntry(selectedEntry.id)
      await loadEntries()
      handleNew()
    } catch (error) {
      console.error('Error deleting journal:', error)
    }
  }

  const generateAIInsight = async () => {
    if (!content.trim()) return
    setShowAIInsight(true)
    setAiInsight('')
    
    // TODO: Call OpenAI API when ready
    // const response = await fetch('/api/journal-insight', { 
    //   method: 'POST',
    //   body: JSON.stringify({ content })
    // })
    
    // Mock AI insight for now
    setTimeout(() => {
      setAiInsight("You're processing a lot today. Remember, it's okay to feel this way. Consider taking a few deep breaths and being gentle with yourself.")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          <p className="text-gray-400">loading your journals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-light mb-1">journal</h1>
          <p className="text-sm text-gray-600">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · your private space
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleNew}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-gray-200 hover:border-zinc-700 hover:bg-zinc-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            new
          </button>

          {content && !showAIInsight && (
            <button
              type="button"
              onClick={generateAIInsight}
              className="inline-flex items-center gap-2 rounded-full border border-purple-900/40 bg-purple-950/20 px-4 py-2.5 text-sm text-purple-300 hover:border-purple-800/60 hover:bg-purple-950/40 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              ai insight
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 md:gap-6">
        
        {/* Sidebar - Entry List */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:sticky lg:top-6 lg:h-[calc(100vh-120px)] flex flex-col bg-zinc-900/30 border border-zinc-800 rounded-3xl p-4 md:p-5"
        >
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search entries..."
              className="w-full bg-zinc-800/50 border border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Entry List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEntries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 mb-2">
                  {searchQuery ? 'no entries found' : 'no entries yet'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleNew}
                    className="text-sm text-gray-500 hover:text-gray-400 underline"
                  >
                    create your first entry
                  </button>
                )}
              </div>
            )}

            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => handleSelectEntry(entry)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                  selectedEntry?.id === entry.id
                    ? 'border-zinc-700 bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-100 line-clamp-1">
                    {entry.title}
                  </p>
                  {entry.mood && (
                    <span className="text-base">
                      {moodEmojis.find(m => m.value === entry.mood)?.emoji}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-1.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {entry.content}
                </p>
              </button>
            ))}
          </div>
        </motion.aside>

        {/* Main Editor */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col min-h-[500px]"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="untitled"
              disabled={!isEditing && !!selectedEntry}
              className="flex-1 bg-transparent text-xl md:text-2xl font-light text-gray-100 placeholder:text-gray-700 focus:outline-none disabled:cursor-default"
            />
            
            {selectedEntry && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  title="Edit entry"
                >
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Mood Selector */}
          {(isEditing || !selectedEntry) && (
            <div className="mb-6">
              <p className="text-xs text-gray-600 mb-3">how are you feeling?</p>
              <div className="flex gap-2 flex-wrap">
                {moodEmojis.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all ${
                      mood === m.value
                        ? 'bg-zinc-800 border-zinc-700'
                        : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/60'
                    } border`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <span className="text-gray-400">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="what's on your mind? write anything..."
              disabled={!isEditing && !!selectedEntry}
              className="w-full h-full min-h-[280px] bg-transparent resize-none outline-none text-base text-gray-100 placeholder:text-gray-600 leading-relaxed disabled:cursor-default"
            />
          </div>

          {/* AI Insight */}
          <AnimatePresence>
            {showAIInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 rounded-2xl border border-purple-900/40 bg-purple-950/20 p-4"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-purple-300 mb-1 font-medium">ai insight</p>
                    {aiInsight ? (
                      <p className="text-sm text-gray-300 leading-relaxed">{aiInsight}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                        <p className="text-sm text-gray-400">analyzing your entry...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Actions */}
          {(isEditing || !selectedEntry) && (
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    save
                  </>
                )}
              </button>
            </div>
          )}
        </motion.section>

      </div>
    </div>
  )
}
