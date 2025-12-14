'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Loader2, Search, Calendar, Sparkles, Trash2, Edit2, ChevronLeft, Menu } from 'lucide-react'
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
  const [showSidebar, setShowSidebar] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // UI state
  const [isSaving, setIsSaving] = useState(false)
  const [showAIInsight, setShowAIInsight] = useState(false)
  const [aiInsight, setAiInsight] = useState('')

  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    if (!user) return
    setLoading(true)
    const result = await getUserJournals(user.uid)
    if (result.success) {
      setEntries(result.journals)
    }
    setLoading(false)
  }

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
    setShowSidebar(false)
  }

  const handleSelectEntry = (entry: JournalEntryType) => {
    setSelectedEntry(entry)
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood || '')
    setIsEditing(false)
    setShowAIInsight(false)
    setAiInsight('')
    setShowSidebar(false)
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
        await updateJournalEntry(selectedEntry.id, entryData)
      } else {
        await addJournalEntry(entryData)
      }

      await loadEntries()
      setIsEditing(false)
      
      if (!selectedEntry?.id) {
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-10">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Open journal entries menu"
          title="Open journal entries menu"
        >
          <Menu className="h-5 w-5 text-gray-400" />
        </button>
        
        <h1 className="text-xl font-light">journal</h1>
        
        <button
          onClick={handleNew}
          className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Create new journal entry"
          title="Create new entry"
        >
          <Plus className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:flex mb-8 items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-light mb-1">journal</h1>
          <p className="text-sm text-gray-600">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · your private space
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-sm text-gray-200 hover:border-zinc-700 hover:bg-zinc-900 transition-colors"
            aria-label="Create new journal entry"
          >
            <Plus className="h-4 w-4" />
            new
          </button>

          {content && !showAIInsight && (
            <button
              onClick={generateAIInsight}
              className="inline-flex items-center gap-2 rounded-full border border-purple-900/40 bg-purple-950/20 px-4 py-2.5 text-sm text-purple-300 hover:border-purple-800/60 hover:bg-purple-950/40 transition-colors"
              aria-label="Get AI insight for this entry"
            >
              <Sparkles className="h-4 w-4" />
              ai insight
            </button>
          )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 md:gap-6">
        
        {/* Sidebar - Mobile Overlay + Desktop Static */}
        <AnimatePresence>
          {(showSidebar || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.aside
              initial={showSidebar ? { x: -320 } : false}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`
                ${showSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'}
                lg:relative lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-120px)]
                w-[320px] flex flex-col bg-black lg:bg-zinc-900/30 border-r lg:border border-zinc-800 lg:rounded-3xl p-5
              `}
            >
              {/* Mobile Close Button */}
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800"
                aria-label="Close journal entries menu"
                title="Close menu"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>

              {/* Search */}
              <div className="relative mb-4 mt-12 lg:mt-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="search entries..."
                  aria-label="Search journal entries"
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
                        aria-label="Create your first journal entry"
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
                    aria-label={`Open journal entry: ${entry.title}`}
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
                        <span className="text-base flex-shrink-0" aria-label={`Mood: ${entry.mood}`}>
                          {moodEmojis.find(m => m.value === entry.mood)?.emoji}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
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
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            onClick={() => setShowSidebar(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            aria-hidden="true"
          />
        )}

        {/* Main Editor */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/30 border border-zinc-800 rounded-2xl lg:rounded-3xl p-4 md:p-8 flex flex-col min-h-[calc(100vh-180px)] md:min-h-[500px]"
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-3 md:pb-4 border-b border-zinc-800">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="untitled"
              disabled={!isEditing && !!selectedEntry}
              aria-label="Journal entry title"
              className="flex-1 bg-transparent text-lg md:text-2xl font-light text-gray-100 placeholder:text-gray-700 focus:outline-none disabled:cursor-default"
            />
            
            {selectedEntry && !isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  aria-label="Edit journal entry"
                  title="Edit entry"
                >
                  <Edit2 className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                  aria-label="Delete journal entry"
                  title="Delete entry"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>

          {/* Mood Selector */}
          {(isEditing || !selectedEntry) && (
            <div className="mb-4 md:mb-6">
              <p className="text-xs text-gray-600 mb-3">how are you feeling?</p>
              <div className="flex gap-2 flex-wrap" role="group" aria-label="Select mood">
                {moodEmojis.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    aria-label={`Select ${m.label} mood`}
                    aria-pressed={mood === m.value}
                    className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all ${
                      mood === m.value
                        ? 'bg-zinc-800 border-zinc-700'
                        : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/60'
                    } border`}
                  >
                    <span className="text-base md:text-lg" aria-hidden="true">{m.emoji}</span>
                    <span className="text-gray-400">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 mb-4 md:mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="what's on your mind? write anything..."
              disabled={!isEditing && !!selectedEntry}
              aria-label="Journal entry content"
              className="w-full h-full min-h-[200px] md:min-h-[280px] bg-transparent resize-none outline-none text-sm md:text-base text-gray-100 placeholder:text-gray-600 leading-relaxed disabled:cursor-default"
            />
          </div>

          {/* AI Insight */}
          <AnimatePresence>
            {showAIInsight && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 md:mb-6 rounded-2xl border border-purple-900/40 bg-purple-950/20 p-3 md:p-4"
                role="region"
                aria-label="AI insight"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <Sparkles className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-purple-300 mb-1 font-medium">ai insight</p>
                    {aiInsight ? (
                      <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{aiInsight}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-purple-400" aria-hidden="true" />
                        <p className="text-xs md:text-sm text-gray-400">analyzing...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Actions */}
          {(isEditing || !selectedEntry) && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 pt-3 md:pt-4 border-t border-zinc-800">
              <p className="text-xs text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>

              <div className="flex gap-2 w-full md:w-auto">
                {content && !showAIInsight && (
                  <button
                    onClick={generateAIInsight}
                    className="lg:hidden flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-full border border-purple-900/40 bg-purple-950/20 px-4 py-2.5 text-sm text-purple-300"
                    aria-label="Get AI insight for this entry"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="md:inline">ai insight</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !content.trim()}
                  aria-label={isSaving ? 'Saving journal entry' : 'Save journal entry'}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
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
            </div>
          )}
        </motion.section>

      </div>
    </div>
  )
}
